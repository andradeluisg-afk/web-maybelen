import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/Store.css';

export default function Home() {
    const { products, addToCart } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'new'
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'name', 'price-asc', 'price-desc', 'stock'
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Scroll to top cuando cambia la ruta o la página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname, location.search, currentPage]);

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

        // Reset pagination al cambiar filtros
        setCurrentPage(1);
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

            // Ordenar productos
            filteredProducts.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'stock':
                        return b.stock - a.stock;
                    case 'newest':
                    default:
                        return b.id - a.id; // Asumiendo que IDs mayores = más nuevos
                }
            });
        }
    } catch (error) {
        console.error("Error filtrando productos:", error);
        filteredProducts = Array.isArray(products) ? products : [];
    }

    // Paginación
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset pagination al buscar
                                }}
                                className="search-input"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input"
                            style={{ maxWidth: '200px', padding: '0.5rem' }}
                        >
                            <option value="newest">Más Recientes</option>
                            <option value="name">Nombre (A-Z)</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="stock">Mayor Stock</option>
                        </select>

                        {/* Category Filter */}
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setCurrentPage(1);
                                    }}
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
                    Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                </div>

                <div className="products-grid">
                    {paginatedProducts.map(product => {
                        if (!product) return null;

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
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(255,255,255,0.6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 10,
                                                backdropFilter: 'blur(2px)'
                                            }}>
                                                <div style={{
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    padding: '0.5rem 1.5rem',
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase',
                                                    transform: 'rotate(-15deg)',
                                                    border: '3px solid white',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                                    fontSize: '1.2rem',
                                                    letterSpacing: '1px'
                                                }}>
                                                    AGOTADO
                                                </div>
                                            </div>
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
                                            e.preventDefault();
                                            addToCart(product);
                                        }}
                                        disabled={product.stock === 0}
                                        style={product.stock === 0 ? { background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', transform: 'none', boxShadow: 'none', width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' } : {}}
                                    >
                                        {product.stock === 0 ? 'Agotado' : <Plus size={20} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '3rem',
                        marginBottom: '2rem'
                    }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-secondary"
                            style={{
                                opacity: currentPage === 1 ? 0.5 : 1,
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ChevronLeft size={20} /> Anterior
                        </button>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        minWidth: '40px',
                                        padding: '0.5rem'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn btn-secondary"
                            style={{
                                opacity: currentPage === totalPages ? 0.5 : 1,
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Siguiente <ChevronRight size={20} />
                        </button>
                    </div>
                )}

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
