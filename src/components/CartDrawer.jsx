import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Minus, Plus } from 'lucide-react';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, cartTotal } = useStore();

    if (!isCartOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                onClick={() => setIsCartOpen(false)}
            />
            <div className="animate-fade-in" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                background: 'var(--surface)',
                height: '100%',
                boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                animationDuration: '0.3s'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Tu Carrito ({cart.length})</h2>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={() => setIsCartOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                            <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                <Trash2 size={48} style={{ margin: '0 auto' }} />
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Tu carrito está vacío.</p>
                            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setIsCartOpen(false)}>
                                Explorar Productos
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', background: '#f1f5f9' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem', lineHeight: 1.2 }}>{item.name}</div>
                                        <div style={{ color: 'var(--primary)', fontWeight: '700' }}>
                                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                                <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateCartQuantity(item.id, -1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateCartQuantity(item.id, 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem', marginLeft: 'auto', borderRadius: '8px' }} onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                            Proceder al Pago
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
