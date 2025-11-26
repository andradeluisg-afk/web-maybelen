import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, type, title, details }) {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const Icon = isSuccess ? CheckCircle : XCircle;
    const iconColor = isSuccess ? '#10b981' : '#ef4444';
    const bgColor = isSuccess ? '#d1fae5' : '#fee2e2';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-in-out'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'slideUp 0.3s ease-out',
                position: 'relative'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#6b7280';
                    }}
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1rem',
                        borderRadius: '50%',
                        backgroundColor: bgColor
                    }}>
                        <Icon size={48} color={iconColor} />
                    </div>
                </div>

                {/* Title */}
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-heading)'
                }}>
                    {title}
                </h2>

                {/* Details */}
                {details && details.length > 0 && (
                    <div style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0
                        }}>
                            {details.map((detail, index) => (
                                <li key={index} style={{
                                    padding: '0.5rem 0',
                                    borderBottom: index < details.length - 1 ? '1px solid #e5e7eb' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.95rem',
                                    color: '#374151'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: iconColor,
                                        flexShrink: 0
                                    }}></span>
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* OK Button */}
                <button
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: '12px'
                    }}
                >
                    Entendido
                </button>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
