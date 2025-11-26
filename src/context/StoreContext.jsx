import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const INITIAL_CATEGORIES = ['Accesorios', 'Bisuteria', 'Papeleria'];

const INITIAL_TYPES = {
  'Accesorios': ['Bolso', 'Mochila', 'Gafas', 'Llavero', 'Delantal'],
  'Bisuteria': ['Anillo', 'Collar', 'Pulsera', 'Aretes'],
  'Papeleria': ['Resaltador', 'Libreta', 'Cuaderno']
};

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Bolso tela cubo rosa Hello Kitty',
    description: 'Adorable bolso de tela en forma de cubo con diseño Hello Kitty en color rosa',
    price: 8.00,
    cost: 3.89,
    stock: 5,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Bolso',
    image: null
  },
  {
    id: 2,
    name: 'Bolso tela bandolera Hello Kitty',
    description: 'Bolso bandolera de tela con estampado Hello Kitty, perfecto para el día a día',
    price: 10.00,
    cost: 5.60,
    stock: 3,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Bolso',
    image: null
  },
  {
    id: 3,
    name: 'Mochila Hello Kitty',
    description: 'Mochila espaciosa con diseño Hello Kitty',
    price: 12.00,
    cost: 8.03,
    stock: 3,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Mochila',
    image: null
  },
  {
    id: 4,
    name: 'Gafas Niña Hello Kitty',
    description: 'Gafas de sol para niña con motivo Hello Kitty',
    price: 4.00,
    cost: 1.78,
    stock: 10,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Gafas',
    image: null
  },
  {
    id: 5,
    name: 'Anillo resina',
    description: 'Precioso anillo de resina con diseño kawaii',
    price: 1.00,
    cost: 0.30,
    stock: 10,
    tax: 0,
    discount: 0,
    category: 'Bisuteria',
    subcategory: 'Anillo',
    image: null
  },
  {
    id: 6,
    name: 'Llavero tipo peluche Hello Kitty',
    description: 'Llavero en forma de peluche Hello Kitty, suave y adorable',
    price: 3.50,
    cost: 2.61,
    stock: 15,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Llavero',
    image: null
  },
  {
    id: 7,
    name: 'Resaltadores tipo crayon',
    description: 'Set de resaltadores en forma de crayón, colores vibrantes',
    price: 1.25,
    cost: 0.63,
    stock: 10,
    tax: 0,
    discount: 0,
    category: 'Papeleria',
    subcategory: 'Resaltador',
    image: null
  },
  {
    id: 8,
    name: 'Bolso cuerina Mensajería Hello Kitty',
    description: 'Bolso de cuerina estilo mensajero con diseño Hello Kitty',
    price: 10.00,
    cost: 4.80,
    stock: 4,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Bolso',
    image: null
  },
  {
    id: 9,
    name: 'Bolso impermeable bandolera Hello Kitty',
    description: 'Bolso bandolera impermeable con diseño Hello Kitty, ideal para todo clima',
    price: 12.00,
    cost: 7.88,
    stock: 2,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Bolso',
    image: null
  },
  {
    id: 10,
    name: 'Anillo Mounstro',
    description: 'Anillo con diseño de monstruito kawaii',
    price: 1.00,
    cost: 0.36,
    stock: 20,
    tax: 0,
    discount: 0,
    category: 'Bisuteria',
    subcategory: 'Anillo',
    image: null
  },
  {
    id: 11,
    name: 'Delantal Hello Kitty',
    description: 'Delantal práctico con diseño Hello Kitty',
    price: 7.00,
    cost: 3.57,
    stock: 8,
    tax: 0,
    discount: 0,
    category: 'Accesorios',
    subcategory: 'Delantal',
    image: null
  },
  {
    id: 12,
    name: 'Resaltadores tipo crayon',
    description: 'Set de resaltadores en forma de crayón, colores vibrantes',
    price: 1.25,
    cost: 0.63,
    stock: 10,
    tax: 0,
    discount: 0,
    category: 'Papeleria',
    subcategory: 'Resaltador',
    image: null
  }
];

export const StoreProvider = ({ children }) => {
  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Types (subcategories)
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem('types');
    return saved ? JSON.parse(saved) : INITIAL_TYPES;
  });

  // Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
