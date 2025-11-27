import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, LogOut, Home, Store as StoreIcon, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import logo from '../assets/logo.png';

export default function Navbar() {
    const { cart, setIsCartOpen, categories } = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = location.pathname.startsWith('/admin');
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const handleWhatsApp = () => {
        const message = 'Hola! Me interesa conocer más sobre tus productos. ¿Podrías ayudarme con más información?';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/593984413528?text=${encodedMessage}`, '_blank');
    };

    return (
        <nav style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: isScrolled ? '0.35rem 0' : '0.6rem 0',
            boxShadow: isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'var(--shadow-sm)',
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Left Section - Contact Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a
                        href="tel:+593984413528"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: '#FF1493',
                            fontSize: isScrolled ? '0.8rem' : '0.85rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                        }}
                    >
                        <Phone size={isScrolled ? 14 : 16} />
                        <span className="phone-number">+593 984 413 528</span>
                    </a>
                    <button
                        onClick={handleWhatsApp}
                        className="whatsapp-btn"
                        style={{
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            padding: isScrolled ? '0.4rem 0.9rem' : '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: isScrolled ? '0.8rem' : '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                        }}
                        title="Chatea con nosotros"
                    >
                        <MessageCircle size={isScrolled ? 14 : 16} />
                        <span className="whatsapp-text">WhatsApp</span>
                    </button>
                </div>

                {/* Center - Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: isScrolled ? '0.5rem' : '0.65rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                    <img src={logo} alt="MayBelén Logo" style={{ height: isScrolled ? '28px' : '38px', objectFit: 'contain', transition: 'height 0.3s ease' }} />
                    <span style={{ fontSize: isScrolled ? '1.1rem' : '1.35rem', fontWeight: '800', color: '#FF1493', transition: 'font-size 0.3s ease', fontFamily: 'var(--font-heading)' }}>MayBelen</span>
                </Link>

                {/* Right Section - Navigation */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {!isAdmin ? (
                        <>
                            <Link to="/" className="nav-link" style={{ fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                Inicio
                            </Link>
                            <Link to="/tienda" className="nav-link" style={{ fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                Tienda
                            </Link>

                            {/* Category Dropdown */}
                            <div className="category-dropdown">
                                <button className="nav-link dropdown-trigger" style={{ fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                    Categorías ▾
                                </button>
                                <div className="dropdown-menu">
                                    {categories.map(category => (
                                        <Link
                                            key={category}
                                            to={`/tienda?categoria=${category}`}
                                            className="dropdown-item"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="cart-btn"
                                style={{
                                    position: 'relative',
                                    borderRadius: '50%',
                                    width: isScrolled ? '40px' : '45px',
                                    height: isScrolled ? '40px' : '45px',
                                    padding: 0,
                                    transition: 'all 0.3s ease',
                                    background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(255, 20, 147, 0.3)'
                                }}
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart size={isScrolled ? 18 : 20} />
                                {cart.length > 0 && (
                                    <span className="cart-badge" style={{
                                        position: 'absolute',
                                        top: isScrolled ? -3 : -4,
                                        right: isScrolled ? -3 : -4,
                                        background: '#FF1493',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: isScrolled ? '19px' : '22px',
                                        height: isScrolled ? '19px' : '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(255, 20, 147, 0.4)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {cart.reduce((a, c) => a + c.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </>
                    ) : (
                        isAuthenticated && (
                            <>
                                <Link to="/admin/dashboard" className="btn btn-secondary" style={{ borderRadius: '50px', padding: isScrolled ? '0.4rem 0.9rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                    <LayoutDashboard size={isScrolled ? 16 : 18} /> Panel
                                </Link>
                                <Link to="/admin/orders" className="btn btn-secondary" style={{ borderRadius: '50px', padding: isScrolled ? '0.4rem 0.9rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                    <StoreIcon size={isScrolled ? 16 : 18} /> Pedidos
                                </Link>
                                <button onClick={handleLogout} className="btn btn-danger" style={{ borderRadius: '50px', padding: isScrolled ? '0.4rem 0.9rem' : '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: isScrolled ? '0.85rem' : '0.9rem', transition: 'all 0.3s ease' }}>
                                    <LogOut size={isScrolled ? 16 : 18} /> Salir
                                </button>
                            </>
                        )
                    )}
                </div>
            </div>

            <style>{`
                .nav-link {
                    color: #2D2D2D;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: var(--font-sans);
                }

                .nav-link:hover {
                    color: #FF1493;
                    background: #FFF0F5;
                }

                .category-dropdown {
                    position: relative;
                }

                .dropdown-trigger {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    left: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    padding: 0.5rem;
                    min-width: 180px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 100;
                    border: 2px solid #FFB6C1;
                }

                .category-dropdown:hover .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item {
                    display: block;
                    padding: 0.6rem 0.9rem;
                    color: #2D2D2D;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }

                .dropdown-item:hover {
                    background: linear-gradient(135deg, #FFE4E9 0%, #FFF0F5 100%);
                    color: #FF1493;
                    transform: translateX(4px);
                }

                .whatsapp-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
                }

                .cart-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 6px 16px rgba(255, 20, 147, 0.4);
                }

                @media (max-width: 768px) {
                    .phone-number,
                    .whatsapp-text {
                        display: none;
                    }
                    
                    .category-dropdown {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}
