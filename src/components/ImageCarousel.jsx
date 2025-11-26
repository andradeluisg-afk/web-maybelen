import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images = [], productName }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Si no hay imágenes, mostrar placeholder
    if (!images || images.length === 0) {
        return (
            <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                fontSize: '4rem'
            }}>
                🎀
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Imagen Principal */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                    src={images[currentIndex]}
                    alt={`${productName} - Vista ${currentIndex + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Flechas de navegación (solo si hay más de 1 imagen) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'white'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'white'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Miniaturas (Thumbnails) */}
            {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: currentIndex === index ? '2px solid var(--primary)' : '2px solid transparent',
                                padding: 0,
                                cursor: 'pointer',
                                flexShrink: 0,
                                opacity: currentIndex === index ? 1 : 0.6,
                                transition: 'all 0.2s'
                            }}
                        >
                            <img
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
