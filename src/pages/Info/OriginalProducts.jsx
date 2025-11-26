import React from 'react';
import { Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OriginalProducts() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Sparkles size={64} color="var(--primary)" />
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(45deg, var(--primary), #ff9a9e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    100% Originalidad y Estilo
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '3rem' }}>
                    En MayBelen, no vendemos simples productos; entregamos pedacitos de magia. Nos enorgullece traer para ti artículos <strong>directamente importados</strong> y licenciados de tus marcas favoritas como <strong>Sanrio (Hello Kitty & Friends)</strong>, Disney y más.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'left' }}>
                        <ShieldCheck size={40} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Garantía de Autenticidad</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Olvídate de las imitaciones. Cada producto pasa por un riguroso control de calidad para asegurar que recibes lo mejor.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem', textAlign: 'left' }}>
                        <Star size={40} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tendencias Exclusivas</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Traemos lo último de la moda asiática y global antes que nadie. ¡Tendrás lo que aún no sale en el mercado local!</p>
                    </div>
                </div>

                <div style={{ background: 'var(--secondary)', padding: '3rem', borderRadius: '24px', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Buscas algo único?</h2>
                    <p style={{ marginBottom: '2rem' }}>Nuestro stock se renueva constantemente con colecciones limitadas que vuelan.</p>
                    <Link to="/tienda" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Explorar Colección Ahora
                    </Link>
                </div>
            </div>
        </div>
    );
}
