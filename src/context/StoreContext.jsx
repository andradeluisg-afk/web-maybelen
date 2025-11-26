import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_TYPES, INITIAL_PRODUCTS } from './initialData';

const StoreContext = createContext();

// Incrementa esto para forzar una actualización de datos en todos los clientes
const DATA_VERSION = 'v2-excel-import';

export const StoreProvider = ({ children }) => {
  // Helper para inicializar datos con control de versiones
  const initializeData = (key, initialValue) => {
    const savedVersion = localStorage.getItem('dataVersion');
    const savedData = localStorage.getItem(key);

    // Si la versión cambió, forzamos el uso de los nuevos datos (Excel)
    if (savedVersion !== DATA_VERSION) {
      return initialValue;
    }

    return savedData ? JSON.parse(savedData) : initialValue;
  };

  // Products
  const [products, setProducts] = useState(() => initializeData('products', INITIAL_PRODUCTS));

  // Categories
  const [categories, setCategories] = useState(() => initializeData('categories', INITIAL_CATEGORIES));

  // Types (subcategories)
  const [types, setTypes] = useState(() => initializeData('types', INITIAL_TYPES));

  // Cart (El carrito sí lo mantenemos aunque cambie la versión de datos)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar la versión actual
  useEffect(() => {
    localStorage.setItem('dataVersion', DATA_VERSION);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('types', JSON.stringify(types));
  }, [types]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ===== CATEGORY MANAGEMENT =====
  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
      setTypes({ ...types, [categoryName]: [] });
    }
  };

  const updateCategory = (oldName, newName) => {
    if (oldName === newName) return;

    // Update categories array
    setCategories(categories.map(cat => cat === oldName ? newName : cat));

    // Update types object
    const newTypes = { ...types };
    newTypes[newName] = newTypes[oldName];
    delete newTypes[oldName];
    setTypes(newTypes);

    // Update all products with this category
    setProducts(products.map(p =>
      p.category === oldName ? { ...p, category: newName } : p
    ));
  };

  const deleteCategory = (categoryName) => {
    setCategories(categories.filter(cat => cat !== categoryName));
    const newTypes = { ...types };
    delete newTypes[categoryName];
    setTypes(newTypes);

    // Update products - remove category or set to null
    setProducts(products.map(p =>
      p.category === categoryName ? { ...p, category: null, subcategory: null } : p
    ));
  };

  // ===== TYPE MANAGEMENT =====
  const addType = (category, typeName) => {
    if (types[category] && !types[category].includes(typeName)) {
      setTypes({
        ...types,
        [category]: [...types[category], typeName]
      });
    }
  };

  const updateType = (category, oldName, newName) => {
    if (oldName === newName) return;

    // Update types array
    setTypes({
      ...types,
      [category]: types[category].map(t => t === oldName ? newName : t)
    });

    // Update all products with this type
    setProducts(products.map(p =>
      p.category === category && p.subcategory === oldName
        ? { ...p, subcategory: newName }
        : p
    ));
  };

  const deleteType = (category, typeName) => {
    setTypes({
      ...types,
      [category]: types[category].filter(t => t !== typeName)
    });

    // Update products - remove subcategory
    setProducts(products.map(p =>
      p.category === category && p.subcategory === typeName
        ? { ...p, subcategory: null }
        : p
    ));
  };

  // ===== PRODUCT MANAGEMENT =====
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // ===== CART MANAGEMENT =====
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.price * (1 - item.discount / 100);
    return sum + (price * item.quantity);
  }, 0);

  return (
    <StoreContext.Provider value={{
      // Products
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      // Categories
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      // Types
      types,
      addType,
      updateType,
      deleteType,
      // Cart
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
