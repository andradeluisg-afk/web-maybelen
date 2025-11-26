import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Heart, Star } from 'lucide-react';
import '../styles/Landing.css';

function Landing() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={20} />
                        <span>Bienvenida al mundo de la ternura</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="gradient-text">MayBelen</span>
                        <br />
                        Tu tienda de ensueño
                    </h1>
                    <p className="hero-subtitle">
                        Descubre la colección más adorable de productos Hello Kitty,
                        accesorios kawaii y artículos que harán brillar tu día ✨
                    </p>
                    <div className="hero-buttons">
                        <Link to="/tienda" className="btn btn-primary btn-large">
                            <ShoppingBag size={20} />
                            Explorar Tienda
                        </Link>
                        <a href="#colecciones" className="btn btn-secondary btn-large">
                            Ver Colecciones
                        </a>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="floating-element element-1">💗</div>
                    <div className="floating-element element-2">🎀</div>
                    <div className="floating-element element-3">⭐</div>
                    <div className="floating-element element-4">🌸</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Heart />
                            </div>
                            <h3>Productos Originales</h3>
                            <p>Todos nuestros productos son 100% auténticos y de alta calidad</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Star />
                            </div>
                            <h3>Nuevas Colecciones</h3>
                            <p>Actualizamos constantemente con los diseños más recientes</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <ShoppingBag />
                            </div>
                            <h3>Envíos Rápidos</h3>
                            <p>Entrega rápida y segura a todo el país</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Sparkles />
                            </div>
                            <h3>Atención Personalizada</h3>
                            <p>Te ayudamos a encontrar el producto perfecto para ti</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collections Preview */}
            <section id="colecciones" className="collections-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nuestras Colecciones</h2>
                        <p className="section-subtitle">Encuentra lo que tu corazón desea</p>
                    </div>
                    <div className="collections-grid">
                        <Link to="/tienda?categoria=Accesorios" className="collection-card">
                            <div className="collection-image">
                                <div className="collection-overlay"></div>
                                <span className="collection-emoji">👜</span>
                            </div>
                            <div className="collection-info">
                                <h3>Accesorios</h3>
                                <p>Bolsos, mochilas y más</p>
                            </div>
                        </Link>
                        <Link to="/tienda?categoria=Bisuteria" className="collection-card">
                            <div className="collection-image">
                                <div className="collection-overlay"></div>
                                <span className="collection-emoji">💍</span>
                            </div>
                            <div className="collection-info">
                                <h3>Bisutería</h3>
                                <p>Anillos, collares y aretes</p>
                            </div>
                        </Link>
                        <Link to="/tienda?categoria=Papeleria" className="collection-card">
                            <div className="collection-image">
                                <div className="collection-overlay"></div>
                                <span className="collection-emoji">📚</span>
                            </div>
                            <div className="collection-info">
                                <h3>Papelería</h3>
                                <p>Libreta, stickers y más</p>
                            </div>
                        </Link>
                        <Link to="/tienda?categoria=Peluches" className="collection-card">
                            <div className="collection-image">
                                <div className="collection-overlay"></div>
                                <span className="collection-emoji">🧸</span>
                            </div>
                            <div className="collection-info">
                                <h3>Peluches</h3>
                                <p>Suaves y adorables</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿Lista para comenzar tu colección? 🎀</h2>
                        <p>Descubre todos nuestros productos exclusivos de Hello Kitty</p>
                        <Link to="/tienda" className="btn btn-white btn-large">
                            Ir a la Tienda
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;
