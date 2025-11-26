import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter } from 'lucide-react';
import '../../styles/Store.css';

export default function Home() {
    const { products, addToCart } = useStore();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    // Leer categoría de la URL al cargar
    useEffect(() => {
        const categoria = searchParams.get('categoria');
        if (categoria) {
            setSelectedCategory(categoria);
        }
    }, [searchParams]);

    // Obtener categorías únicas
    const categories = ['Todos', ...new Set(products.map(p => p.category))];

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="store-page">
            {/* Header */}
            <div className="store-header">
                <div className="container">
                    <h1 className="store-title">Tienda MayBelen 🎀</h1>
                    <p className="store-subtitle">Descubre nuestra adorable colección de productos Hello Kitty</p>
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
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <div className="product-image">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} />
                                    ) : (
                                        <div className="product-placeholder">
                                            <span className="placeholder-emoji">🎀</span>
                                        </div>
                                    )}
                                </div>
                                {product.discount > 0 && (
                                    <span className="discount-badge">
                                        -{product.discount}%
                                    </span>
                                )}
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

                                <div className="product-footer">
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
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
