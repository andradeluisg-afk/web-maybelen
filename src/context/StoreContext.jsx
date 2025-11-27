import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== CARGAR DATOS INICIALES DESDE SUPABASE =====
  useEffect(() => {
    loadInitialData();
    loadCart();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Cargar categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      const categoryNames = categoriesData.map(c => c.name);
      setCategories(categoryNames);

      // Cargar tipos/subcategorías agrupados por categoría
      const { data: typesData, error: typesError } = await supabase
        .from('types')
        .select('*, categories(name)')
        .order('name');

      if (typesError) throw typesError;

      // Agrupar tipos por categoría
      const typesMap = {};
      typesData.forEach(type => {
        const categoryName = type.categories.name;
        if (!typesMap[categoryName]) {
          typesMap[categoryName] = [];
        }
        typesMap[categoryName].push(type.name);
      });
      setTypes(typesMap);

      // Cargar productos con sus imágenes
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          types:subcategory_id(name),
          product_images(image_url, position)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Transformar productos al formato que espera el frontend
      const transformedProducts = productsData.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        cost: parseFloat(p.cost),
        stock: p.stock,
        tax: parseFloat(p.tax),
        discount: parseFloat(p.discount),
        category: p.categories?.name || 'Sin categoría',
        subcategory: p.types?.name || '',
        images: p.product_images
          ? p.product_images.sort((a, b) => a.position - b.position).map(img => img.image_url)
          : [],
        image: null // Mantenemos compatibilidad con código anterior
      }));

      setProducts(transformedProducts);

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ===== CATEGORY MANAGEMENT =====
  const addCategory = async (categoryName) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: categoryName })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, categoryName]);
      setTypes({ ...types, [categoryName]: [] });
      return { success: true };
    } catch (error) {
      console.error('Error añadiendo categoría:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (categoryName) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryName);

      if (error) throw error;

      setCategories(categories.filter(c => c !== categoryName));
      const newTypes = { ...types };
      delete newTypes[categoryName];
      setTypes(newTypes);

      // Recargar productos para reflejar cambios
      await loadInitialData();

      return { success: true };
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== TYPE MANAGEMENT =====
  const addType = async (category, typeName) => {
    try {
      // Obtener ID de la categoría
      const { data: categoryData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();

      if (catError) throw catError;

      const { data, error } = await supabase
        .from('types')
        .insert({
          category_id: categoryData.id,
          name: typeName
        })
        .select()
        .single();

      if (error) throw error;

      setTypes({
        ...types,
        [category]: [...(types[category] || []), typeName]
      });

      return { success: true };
    } catch (error) {
      console.error('Error añadiendo tipo:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteType = async (category, typeName) => {
    try {
      // Obtener ID de la categoría
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();

      const { error } = await supabase
        .from('types')
        .delete()
        .eq('category_id', categoryData.id)
        .eq('name', typeName);

      if (error) throw error;

      setTypes({
        ...types,
        [category]: types[category].filter(t => t !== typeName)
      });

      // Recargar productos para reflejar cambios
      await loadInitialData();

      return { success: true };
    } catch (error) {
      console.error('Error eliminando tipo:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== PRODUCT MANAGEMENT =====
  const addProduct = async (productData) => {
    try {
      // Obtener IDs de categoría y subcategoría
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productData.category)
        .single();

      let subcategoryId = null;
      if (productData.subcategory) {
        const { data: typeData } = await supabase
          .from('types')
          .select('id')
          .eq('category_id', categoryData.id)
          .eq('name', productData.subcategory)
          .single();
        subcategoryId = typeData?.id;
      }

      // Insertar producto
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          cost: productData.cost,
          stock: productData.stock,
          tax: productData.tax,
          discount: productData.discount,
          category_id: categoryData.id,
          subcategory_id: subcategoryId
        })
        .select()
        .single();

      if (productError) throw productError;

      // Subir imágenes si existen
      if (productData.images && productData.images.length > 0) {
        await uploadProductImages(product.id, productData.images);
      }

      // Recargar productos
      await loadInitialData();

      return { success: true };
    } catch (error) {
      console.error('Error añadiendo producto:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      // Obtener IDs de categoría y subcategoría
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productData.category)
        .single();

      let subcategoryId = null;
      if (productData.subcategory) {
        const { data: typeData } = await supabase
          .from('types')
          .select('id')
          .eq('category_id', categoryData.id)
          .eq('name', productData.subcategory)
          .single();
        subcategoryId = typeData?.id;
      }

      // Actualizar producto
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          cost: productData.cost,
          stock: productData.stock,
          tax: productData.tax,
          discount: productData.discount,
          category_id: categoryData.id,
          subcategory_id: subcategoryId
        })
        .eq('id', productId);

      if (productError) throw productError;

      // Si hay nuevas imágenes, eliminar las antiguas y subir las nuevas
      if (productData.images && productData.images.length > 0) {
        // Eliminar imágenes anteriores de la BD
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId);

        // Subir nuevas imágenes
        await uploadProductImages(productId, productData.images);
      }

      // Recargar productos
      await loadInitialData();

      return { success: true };
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      // Recargar productos
      await loadInitialData();

      return { success: true };
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== IMAGE MANAGEMENT =====
  const uploadProductImages = async (productId, images) => {
    try {
      console.log(`📸 Iniciando upload de ${images.length} imágenes para producto ${productId}`);

      for (let i = 0; i < images.length; i++) {
        const imageBase64 = images[i];
        console.log(`  ⬆️  Procesando imagen ${i + 1}/${images.length}...`);

        // Convertir base64 a blob
        const response = await fetch(imageBase64);
        const blob = await response.blob();
        console.log(`    ✅ Blob creado: ${blob.size} bytes`);

        // Generar nombre único para la imagen
        const fileName = `${productId}_${i}_${Date.now()}.jpg`;
        const filePath = `${productId}/${fileName}`;
        console.log(`    📂 Ruta: ${filePath}`);

        // Subir a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`    ❌ Error subiendo a Storage:`, uploadError);
          throw uploadError;
        }
        console.log(`    ✅ Subido a Storage:`, uploadData);

        // Obtener URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        console.log(`    🔗 URL pública:`, publicUrlData.publicUrl);

        // Guardar referencia en la tabla product_images
        const { data: insertData, error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            position: i + 1
          })
          .select();

        if (insertError) {
          console.error(`    ❌ Error insertando en BD:`, insertError);
          throw insertError;
        }
        console.log(`    ✅ Registrado en BD:`, insertData);
      }

      console.log(`✅ ${images.length} imágenes subidas exitosamente`);
    } catch (error) {
      console.error('💥 Error subiendo imágenes:', error);
      throw error;
    }
  };

  // ===== CART MANAGEMENT =====
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    // Validar que no se exceda el stock
    if (currentQuantity >= product.stock) {
      alert(`⚠️ No hay más stock disponible de "${product.name}". Stock actual: ${product.stock}`);
      return;
    }

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      alert(`⚠️ No puedes agregar más. Solo hay ${product.stock} unidades disponibles.`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCategory = async (oldName, newName) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('name', oldName);

      if (error) throw error;

      await loadInitialData();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      return { success: false, error: error.message };
    }
  };

  const updateType = async (category, oldName, newName) => {
    try {
      // Obtener ID de la categoría
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();

      const { error } = await supabase
        .from('types')
        .update({ name: newName })
        .eq('category_id', categoryData.id)
        .eq('name', oldName);

      if (error) throw error;

      await loadInitialData();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando tipo:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== ORDER MANAGEMENT =====
  const createOrder = async (customerName, customerPhone = null) => {
    try {
      const total = cart.reduce((sum, item) => {
        const itemPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + (itemPrice * item.quantity);
      }, 0);

      // Crear orden
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          total: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear items de la orden
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.images && item.images.length > 0 ? item.images[0] : (item.image || null),
        quantity: item.quantity,
        unit_price: item.price * (1 - (item.discount || 0) / 100),
        subtotal: (item.price * (1 - (item.discount || 0) / 100)) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log(`✅ Pedido #${order.id} creado exitosamente`);
      return { success: true, orderId: order.id };
    } catch (error) {
      console.error('Error creando pedido:', error);
      return { success: false, error: error.message };
    }
  };

  const getOrders = async (status = null) => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, images:product_images(image_url))
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, orders: data };
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      return { success: false, error: error.message, orders: [] };
    }
  };

  const updateOrderStatus = async (orderId, newStatus, reduceStock = false) => {
    try {
      // Actualizar status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Si se confirma el pedido, reducir stock
      if (reduceStock && newStatus === 'confirmed') {
        // Obtener items del pedido
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        // Reducir stock de cada producto
        for (const item of orderItems) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.product_id);
          }
        }

        // Recargar productos
        await loadInitialData();
      }

      return { success: true };
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    products,
    categories,
    types,
    cart,
    isCartOpen,
    loading,
    setIsCartOpen,
    addCategory,
    updateCategory,
    deleteCategory,
    addType,
    updateType,
    deleteType,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    getOrders,
    updateOrderStatus,
    refreshData: loadInitialData
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
