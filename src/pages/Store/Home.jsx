import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter } from 'lucide-react';
import '../../styles/Store.css';

export default function Home() {
    const { products, addToCart } = useStore();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'new'
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    // Leer parámetros de la URL al cargar
    useEffect(() => {
        const categoria = searchParams.get('categoria');
        const filter = searchParams.get('filter');

        if (categoria) {
            setSelectedCategory(categoria);
        }

        if (filter === 'new') {
            setFilterType('new');
        } else {
            setFilterType('all');
        }
    }, [searchParams]);

    // Obtener categorías únicas con seguridad
    const categories = Array.isArray(products)
        ? ['Todos', ...new Set(products.map(p => p?.category).filter(Boolean))]
        : ['Todos'];

    let filteredProducts = [];
    let newProductsThreshold = 0;

    try {
        if (Array.isArray(products) && products.length > 0) {
            // Lógica para identificar productos nuevos (los últimos 20 IDs)
            // Convertimos a Number para asegurar comparación numérica correcta
            const ids = products.map(p => Number(p?.id)).filter(n => !isNaN(n));
            const maxId = ids.length > 0 ? Math.max(...ids) : 0;
            newProductsThreshold = maxId - 20;

            // Filtrar productos
            filteredProducts = products.filter(product => {
                if (!product) return false;

                const name = product.name || '';
                const description = product.description || '';
                const category = product.category || 'Otros';

                const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    description.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesCategory = selectedCategory === 'Todos' || category === selectedCategory;

                // Filtro de "Nuevos"
                const productId = Number(product.id);
                const matchesFilter = filterType === 'new' ? productId > newProductsThreshold : true;

                return matchesSearch && matchesCategory && matchesFilter;
            });
        }
    } catch (error) {
        console.error("Error filtrando productos:", error);
        // Fallback de emergencia: mostrar todo si falla el filtro
        filteredProducts = Array.isArray(products) ? products : [];
    }

    return (
        <div className="store-page">
            {/* Header */}
            <div className="store-header">
                <div className="container">
                    <h1 className="store-title">
                        {filterType === 'new' ? '✨ Nuevas Colecciones ✨' : 'Tienda MayBelen 🎀'}
                    </h1>
                    <p className="store-subtitle">
                        {filterType === 'new'
                            ? 'Lo último en llegar, ¡corre que se acaban!'
                            : 'Descubre nuestra adorable colección de productos Hello Kitty'}
                    </p>

                    {filterType === 'new' && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                onClick={() => {
                                    setFilterType('all');
                                    setSearchTerm('');
                                    setSelectedCategory('Todos');
                                    // Limpiar URL sin recargar
                                    window.history.pushState({}, '', '/tienda');
                                }}
                                className="btn"
                                style={{
                                    background: 'white',
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    padding: '0.8rem 2rem',
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    fontSize: '1.1rem'
                                }}
                            >
                                🎀 Ver Todo el Catálogo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="store-filters">
                <div className="container">
                    <div className="filters-wrapper">
                        {/* Search */}
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container">
                <div className="products-count">
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </div>

                <div className="products-grid">
                    {filteredProducts.map(product => {
                        if (!product) return null;

                        // Determinar qué imagen mostrar: primera del array o la única antigua
                        const displayImage = (product.images && product.images.length > 0)
                            ? product.images[0]
                            : product.image;

                        const isNew = Number(product.id) > newProductsThreshold;

                        return (
                            <div key={product.id} className="product-card">
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div className="product-image-wrapper">
                                        <div className="product-image">
                                            {displayImage ? (
                                                <img src={displayImage} alt={product.name} />
                                            ) : (
                                                <div className="product-placeholder">
                                                    <span className="placeholder-emoji">🎀</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Badges Container */}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {isNew && (
                                                <span className="badge" style={{ background: 'linear-gradient(45deg, #ff00cc, #333399)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                                    NUEVO
                                                </span>
                                            )}
                                            {product.discount > 0 && (
                                                <span className="discount-badge" style={{ position: 'static' }}>
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>

                                        {product.stock < 5 && product.stock > 0 && (
                                            <span className="stock-badge">
                                                ¡Últimas {product.stock} unidades!
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <span className="out-of-stock-badge">
                                                Agotado
                                            </span>
                                        )}
                                    </div>

                                    <div className="product-info">
                                        <div className="product-category">{product.category}</div>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                    </div>
                                </Link>

                                <div className="product-footer" style={{ padding: '0 1.25rem 1.25rem' }}>
                                    <div className="product-pricing">
                                        <div className="product-price">
                                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                        </div>
                                        {product.discount > 0 && (
                                            <div className="product-price-old">
                                                ${product.price.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={(e) => {
                                            e.preventDefault(); // Evitar navegar al detalle al hacer clic en agregar
                                            addToCart(product);
                                        }}
                                        disabled={product.stock === 0}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="no-products">
                        <div className="no-products-icon">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otra búsqueda o categoría</p>
                    </div>
                )}
            </div>
        </div>
    );
}
