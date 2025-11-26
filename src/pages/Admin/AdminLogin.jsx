import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import '../../styles/AdminLogin.css';

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Credenciales por defecto (en producción esto debería ser en backend)
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'maybelen2025'
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simular delay de autenticación
        setTimeout(() => {
            if (
                formData.username === ADMIN_CREDENTIALS.username &&
                formData.password === ADMIN_CREDENTIALS.password
            ) {
                // Guardar sesión
                localStorage.setItem('adminAuthenticated', 'true');
                localStorage.setItem('adminUser', formData.username);

                // Redirigir al panel
                navigate('/admin/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <Shield size={40} />
                        </div>
                        <h1>Panel de Administración</h1>
                        <p>MayBelen Store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">
                                <User size={18} />
                                Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Ingresa tu usuario"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={18} />
                                Contraseña
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu contraseña"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span>⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn-login ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="login-hint">
                            💡 Credenciales por defecto:
                            <br />
                            <code>Usuario: admin</code>
                            <br />
                            <code>Contraseña: maybelen2025</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
