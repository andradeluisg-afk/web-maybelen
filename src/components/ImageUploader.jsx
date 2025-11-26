import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ images = [], onImagesChange, maxImages = 4 }) {
    const [previews, setPreviews] = useState(images);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file =>
            file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
        );

        if (previews.length + validFiles.length > maxImages) {
            alert(`Solo puedes subir máximo ${maxImages} imágenes`);
            return;
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...previews, reader.result];
                setPreviews(newPreviews);
                onImagesChange(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemove = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        onImagesChange(newPreviews);
    };

    return (
        <div style={{ width: '100%' }}>
            <label style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginBottom: '0.5rem',
                display: 'block'
            }}>
                Imágenes del Producto ({previews.length}/{maxImages})
            </label>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                {previews.map((preview, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid var(--border)',
                        background: 'var(--surface)'
                    }}>
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <button
                            onClick={() => handleRemove(index)}
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                background: 'rgba(255, 77, 77, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.9)'}
                        >
                            <X size={16} />
                        </button>
                        {index === 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                background: 'linear-gradient(to top, rgba(255, 20, 147, 0.8), transparent)',
                                color: 'white',
                                padding: '0.25rem',
                                fontSize: '0.7rem',
                                textAlign: 'center',
                                fontWeight: '600'
                            }}>
                                Principal
                            </div>
                        )}
                    </div>
                ))}

                {previews.length < maxImages && (
                    <label style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        border: '2px dashed var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: 'var(--surface)',
                        color: 'var(--text-muted)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = '#FFF0F5';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.background = 'var(--surface)';
                        }}
                    >
                        <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>Agregar Foto</span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            multiple={previews.length + 1 < maxImages}
                        />
                    </label>
                )}
            </div>

            <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
            }}>
                <ImageIcon size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Formatos: PNG, JPG • Máximo {maxImages} imágenes • La primera será la principal
            </p>
        </div>
    );
}
