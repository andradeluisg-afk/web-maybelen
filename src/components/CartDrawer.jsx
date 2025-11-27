import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Minus, Plus, Send, ShoppingBag, CheckCircle } from 'lucide-react';
import { WHATSAPP_CONFIG } from '../config/whatsapp';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, clearCart, createOrder } = useStore();
    const [showCheckout, setShowCheckout] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para confirmación
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [lastOrderId, setLastOrderId] = useState(null);
    const [whatsappLink, setWhatsappLink] = useState('');

    if (!isCartOpen) return null;

    const cartTotal = cart.reduce((sum, item) => {
        const itemPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + (itemPrice * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            alert('Por favor ingresa tu nombre');
            return;
        }

        setIsSubmitting(true);

        // 1. Guardar pedido en base de datos
        const { success, orderId, error } = await createOrder(customerName);

        if (!success) {
            alert('Hubo un error guardando tu pedido. Por favor intenta de nuevo.');
            console.error(error);
            setIsSubmitting(false);
            return;
        }

        // 2. Generar mensaje para WhatsApp con ID de pedido
        let message = `🛍️ *NUEVO PEDIDO #${orderId}*\n\n`;
        message += `👤 *Cliente:* ${customerName}\n\n`;
        message += `📦 *Productos:*\n`;

        cart.forEach((item, index) => {
            const itemPrice = item.price * (1 - (item.discount || 0) / 100);
            const subtotal = itemPrice * item.quantity;

            message += `\n${index + 1}. *${item.name}*\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio unit.: $${itemPrice.toFixed(2)}\n`;
            message += `   Subtotal: $${subtotal.toFixed(2)}\n`;
        });

        message += `\n💰 *TOTAL: $${cartTotal.toFixed(2)}*\n\n`;
        message += `¡Hola! Acabo de generar el pedido #${orderId} en la web. ¿Podrías confirmarme?`;

        // 3. Preparar link y mostrar éxito
        const encodedMessage = encodeURIComponent(message);
        const link = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodedMessage}`;

        setWhatsappLink(link);
        setLastOrderId(orderId);
        setOrderSuccess(true);

        // Abrir WhatsApp automáticamente también
        window.open(link, '_blank');

        // Limpiar carrito pero mantener el drawer abierto en la vista de éxito
        clearCart();
        setIsSubmitting(false);
    };

    const handleClose = () => {
        setIsCartOpen(false);
        setShowCheckout(false);
        setOrderSuccess(false);
        setCustomerName('');
        setLastOrderId(null);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                onClick={handleClose}
            />
            <div className="animate-fade-in" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '450px',
                background: 'var(--surface)',
                height: '100%',
                boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                animationDuration: '0.3s'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #fff 0%, #fef3f9 100%)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                            {orderSuccess ? '🎉 ¡Pedido Exitoso!' : '🛒 Tu Carrito'}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {orderSuccess ? `Orden #${lastOrderId}` : (cart.length === 0 ? 'Vacío' : `${cart.length} producto${cart.length > 1 ? 's' : ''}`)}
                        </p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem', borderRadius: '50%', width: '40px', height: '40px' }}
                        onClick={handleClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {orderSuccess ? (
                        /* Success View */
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: '#dcfce7',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#16a34a'
                            }}>
                                <CheckCircle size={60} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>
                                ¡Gracias por tu pedido!
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Hemos generado tu orden <strong>#{lastOrderId}</strong> exitosamente.<br />
                                Se abrirá WhatsApp para que nos envíes los detalles y confirmemos el stock.
                            </p>

                            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px dashed #0ea5e9' }}>
                                <p style={{ fontSize: '0.9rem', color: '#0369a1' }}>
                                    ¿No se abrió WhatsApp automáticamente?
                                </p>
                            </div>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    background: '#25D366',
                                    color: 'white'
                                }}
                            >
                                <Send size={20} /> Abrir WhatsApp Ahora
                            </a>

                            <button
                                className="btn btn-secondary"
                                style={{ width: '100%', padding: '1rem' }}
                                onClick={handleClose}
                            >
                                Cerrar y Seguir Comprando
                            </button>
                        </div>
                    ) : cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                            <div style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                                <ShoppingBag size={80} style={{ margin: '0 auto' }} />
                            </div>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tu carrito está vacío</p>
                            <p style={{ fontSize: '0.9rem' }}>¡Agrega productos kawaii para empezar!</p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '2rem' }}
                                onClick={() => setIsCartOpen(false)}
                            >
                                Explorar Productos
                            </button>
                        </div>
                    ) : showCheckout ? (
                        /* Checkout Form */
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
                                ✨ Casi listo para tu pedido
                            </h3>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    ¿Cómo te llamas?
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Ej: María"
                                    className="input"
                                    autoFocus
                                    onKeyPress={(e) => e.key === 'Enter' && handleCheckout()}
                                    style={{ fontSize: '1rem' }}
                                />
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    📱 Al hacer clic en "Enviar Pedido", abriremos WhatsApp con tu lista de productos lista para enviar.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Volver
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 2 }}
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Procesando...' : <><Send size={18} /> Enviar Pedido</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Cart Items */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => {
                                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                                const subtotal = itemPrice * item.quantity;
                                // Usar la primera imagen si existe
                                const imageUrl = item.images && item.images.length > 0
                                    ? item.images[0]
                                    : (item.image || '/placeholder.png');

                                return (
                                    <div key={item.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            style={{
                                                width: '90px',
                                                height: '90px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                background: '#f1f5f9',
                                                flexShrink: 0
                                            }}
                                        />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.3 }}>
                                                {item.name}
                                            </div>
                                            <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>
                                                ${subtotal.toFixed(2)}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border)', borderRadius: '8px', background: 'white' }}>
                                                    <button
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.6rem', border: 'none' }}
                                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.6rem', border: 'none' }}
                                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.5rem', borderRadius: '8px' }}
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && !showCheckout && !orderSuccess && (
                    <div style={{ padding: '1.5rem', borderTop: '2px solid var(--border)', background: 'linear-gradient(135deg, #fff 0%, #fef3f9 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
                                boxShadow: '0 8px 16px rgba(255, 20, 147, 0.3)'
                            }}
                            onClick={() => setShowCheckout(true)}
                        >
                            Hacer Pedido 🚀
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Continuarás por WhatsApp
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
