import React from 'react';
import { Truck, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShippingInfo() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        background: '#e0f2fe',
                        borderRadius: '50%',
                        marginBottom: '1.5rem',
                        color: '#0284c7'
                    }}>
                        <Truck size={48} />
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Envíos Rápidos y Seguros
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                        Tu felicidad no puede esperar. Por eso nos aseguramos de que tu pedido llegue volando.
                    </p>
                </div>

                <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '3rem', marginBottom: '4rem' }}>
                    <div className="card" style={{ padding: '2.5rem', border: '2px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderBottomLeftRadius: '12px', fontWeight: 'bold' }}>
                            Partner Oficial
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Enviamos por <span style={{ color: '#009640', fontWeight: '900', fontStyle: 'italic' }}>SERVIENTREGA</span>
                        </h2>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <CheckCircle size={20} color="var(--success)" />
                                <span>Cobertura a todo el Ecuador</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <CheckCircle size={20} color="var(--success)" />
                                <span>Rastreo en tiempo real de tu paquete</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <CheckCircle size={20} color="var(--success)" />
                                <span>Entrega segura en la puerta de tu casa u oficina</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '50%' }}>
                                <Clock size={24} color="#d97706" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Tiempo Récord</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Procesamos tu pedido en menos de 24 horas. Recíbelo en 1-2 días hábiles en ciudades principales.</p>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: '#dcfce7', padding: '0.5rem', borderRadius: '50%' }}>
                                <MapPin size={24} color="#16a34a" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Desde Quito para ti</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nuestra bodega central está estratégicamente ubicada para despachar rápidamente a Costa, Sierra y Oriente.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonios */}
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Lo que dicen nuestros clientes felices ⭐⭐⭐⭐⭐</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { name: "María C.", text: "¡Increíble! Lo pedí ayer y me llegó hoy en la mañana. Súper bien empacado.", city: "Guayaquil" },
                            { name: "Andrea L.", text: "Tenía miedo de que se rompa pero llegó intacto. Gracias por el cuidado.", city: "Cuenca" },
                            { name: "Sofía R.", text: "La mejor experiencia de compra. Puntuales y serios.", city: "Quito" }
                        ].map((t, i) => (
                            <div key={i} className="card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
                                <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{t.text}"</p>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.city}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
