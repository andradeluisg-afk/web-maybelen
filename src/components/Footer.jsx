import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import '../styles/Footer.css';

export default function Footer() {
    const { categories } = useStore();
    const currentYear = new Date().getFullYear();

    const handleWhatsApp = () => {
        window.open('https://wa.me/593984413528', '_blank');
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="container">
                    <div className="footer-grid">
                        {/* About Section */}
                        <div className="footer-section">
                            <h3 className="footer-title">MayBelen Store 🎀</h3>
                            <p className="footer-description">
                                Tu tienda de confianza para productos Hello Kitty y artículos kawaii.
                                Calidad, originalidad y amor en cada producto.
                            </p>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <button onClick={handleWhatsApp} className="social-link whatsapp" aria-label="WhatsApp">
                                    <MessageCircle size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h4 className="footer-subtitle">Navegación</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Inicio</Link></li>
                                <li><Link to="/tienda">Tienda</Link></li>
                                <li><Link to="/tienda?categoria=Todos">Todos los Productos</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="footer-section">
                            <h4 className="footer-subtitle">Categorías</h4>
                            <ul className="footer-links">
                                {categories.length > 0 ? (
                                    categories.map(category => (
                                        <li key={category}>
                                            <Link to={`/tienda?categoria=${category}`}>{category}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted">Cargando categorías...</li>
                                )}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h4 className="footer-subtitle">Contacto</h4>
                            <ul className="contact-info">
                                <li>
                                    <Phone size={16} />
                                    <a href="tel:+593984413528">+593 984 413 528</a>
                                </li>
                                <li>
                                    <Mail size={16} />
                                    <a href="mailto:contacto@maybelen.com">contacto@maybelen.com</a>
                                </li>
                                <li>
                                    <MapPin size={16} />
                                    <span>Ecuador</span>
                                </li>
                            </ul>
                            <button onClick={handleWhatsApp} className="whatsapp-contact-btn">
                                <MessageCircle size={18} />
                                Chatea con nosotros
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">© {currentYear} MayBelen Store. Todos los derechos reservados.</p>
                        <p className="made-with-love">
                            Hecho con <Heart size={16} className="heart-icon" /> por MayBelen
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
