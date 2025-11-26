import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import ImageCarousel from '../../components/ImageCarousel';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Buscar el producto por ID (asegurando que los tipos coincidan)
        const found = products.find(p => p.id.toString() === id);
        if (found) {
            setProduct(found);
        }
    }, [id, products]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Producto no encontrado 😢</h2>
                <button
                    onClick={() => navigate('/tienda')}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    // Preparar array de imágenes: si tiene 'images' (array) usa ese, si tiene 'image' (string) usa ese, si no vacío
    const productImages = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []);

    const handleAddToCart = () => {
        // Añadir la cantidad seleccionada
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const finalPrice = product.price * (1 - product.discount / 100);

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
            <button
                onClick={() => navigate('/tienda')}
                style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    fontSize: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Volver a la tienda
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                {/* Columna Izquierda: Imágenes */}
                <div>
                    <ImageCarousel images={productImages} productName={product.name} />
                </div>

                {/* Columna Derecha: Información */}
                <div>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        {product.category} {product.subcategory ? `> ${product.subcategory}` : ''}
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            ${finalPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                            <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                        {product.discount > 0 && (
                            <span className="badge badge-warning">
                                -{product.discount}% OFF
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        {product.description}
                    </div>

                    {/* Selector de Cantidad y Botón */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600' }}>Disponibilidad:</span>
                            <span className={product.stock > 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: '600' }}>
                                {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                            </span>
                        </div>

                        {product.stock > 0 ? (
                            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontWeight: '600' }}>Cantidad:</span>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        background: 'white'
                                    }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart size={24} /> Agregar al Carrito
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-secondary" disabled style={{ width: '100%', justifyContent: 'center' }}>
                                No disponible
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
