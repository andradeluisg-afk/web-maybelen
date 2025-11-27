import React from 'react';
import { MessageCircle, Gift, HeartHandshake, Phone } from 'lucide-react';

export default function CustomService() {
    const handleWhatsApp = () => {
        const message = 'Hola! Me interesa conocer más sobre tus productos. ¿Podrías ayudarme con más información?';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/593984413528?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Atención que Enamora 💖
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                        En MayBelen no eres un cliente más, eres parte de nuestra familia kawaii.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Bloque 1: Asesoría */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: 'row' }}>
                        <div style={{ background: '#fce7f3', padding: '1.5rem', borderRadius: '50%', flexShrink: 0 }}>
                            <MessageCircle size={40} color="#db2777" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Asesoría Personalizada</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                ¿No sabes qué regalar? ¿Tienes dudas sobre un material? Escríbenos y te ayudaremos a elegir el detalle perfecto. Nos tomamos el tiempo de enviarte fotos y videos reales si lo necesitas.
                            </p>
                        </div>
                    </div>

                    {/* Bloque 2: Pedidos Especiales */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: 'row' }}>
                        <div style={{ background: '#e0e7ff', padding: '1.5rem', borderRadius: '50%', flexShrink: 0 }}>
                            <Gift size={40} color="#4f46e5" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pedidos Bajo Pedido y Personalización</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Si buscas algo específico de Sanrio o Disney que no ves en catálogo, ¡lo traemos para ti! También ofrecemos opciones de personalización para que tu regalo sea único en el mundo.
                            </p>
                        </div>
                    </div>

                    {/* Bloque 3: Post-Venta */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: 'row' }}>
                        <div style={{ background: '#dcfce7', padding: '1.5rem', borderRadius: '50%', flexShrink: 0 }}>
                            <HeartHandshake size={40} color="#16a34a" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Garantía de Felicidad</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Nuestro trabajo no termina cuando compras. Hacemos seguimiento hasta que tienes el producto en tus manos y estás 100% feliz. Si algo sale mal, lo solucionamos de inmediato.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', background: 'var(--surface)', padding: '3rem', borderRadius: '24px', border: '2px dashed var(--primary)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>¿Listo para chatear?</h3>
                    <button
                        onClick={handleWhatsApp}
                        className="btn btn-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem 2rem', borderRadius: '50px' }}
                    >
                        <Phone size={24} /> Contáctanos por WhatsApp
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Respondemos de Lunes a Sábado de 9:00 AM a 7:00 PM
                    </p>
                </div>
            </div>
        </div>
    );
}
