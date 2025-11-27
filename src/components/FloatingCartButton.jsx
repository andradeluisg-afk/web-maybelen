import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FloatingCartButton() {
    const { cart, setIsCartOpen } = useStore();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (itemCount === 0) return null;

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="floating-cart-button"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 20, 147, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 90,
                transition: 'all 0.3s ease',
                animation: 'bounce 2s infinite'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 20, 147, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 20, 147, 0.4)';
            }}
        >
            <div style={{ position: 'relative' }}>
                <ShoppingCart size={28} />
                <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#FFD700',
                    color: '#1a1a1a',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    animation: 'pulse 1.5s infinite'
                }}>
                    {itemCount}
                </span>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .floating-cart-button:active {
                    transform: scale(0.95) !important;
                }

                @media (max-width: 768px) {
                    .floating-cart-button {
                        bottom: 1rem !important;
                        right: 1rem !important;
                        width: 60px !important;
                        height: 60px !important;
                    }
                }
            `}</style>
        </button>
    );
}
