import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, Save, X, Package, Check } from 'lucide-react';
import '../../styles/CategoriesManager.css';

export default function CategoriesManager() {
    const navigate = useNavigate();
    const { categories, types, products, addCategory, updateCategory, deleteCategory, addType, updateType, deleteType } = useStore();
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingCategoryValue, setEditingCategoryValue] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingType, setEditingType] = useState(null);
    const [editingTypeValue, setEditingTypeValue] = useState('');
    const [newTypeName, setNewTypeName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Contar productos por tipo
    const countProductsByType = (category, type) => {
        return products.filter(p => p.category === category && p.subcategory === type).length;
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const handleUpdateCategory = () => {
        if (editingCategoryValue.trim() && editingCategoryValue !== editingCategory) {
            updateCategory(editingCategory, editingCategoryValue.trim());
        }
        setEditingCategory(null);
        setEditingCategoryValue('');
    };

    const handleStartEditCategory = (category) => {
        setEditingCategory(category);
        setEditingCategoryValue(category);
    };

    const handleAddType = () => {
        if (selectedCategory && newTypeName.trim()) {
            addType(selectedCategory, newTypeName.trim());
            setNewTypeName('');
        }
    };

    const handleUpdateType = () => {
        if (editingTypeValue.trim() && editingTypeValue !== editingType) {
            updateType(selectedCategory, editingType, editingTypeValue.trim());
        }
        setEditingType(null);
        setEditingTypeValue('');
    };

    const handleStartEditType = (type) => {
        setEditingType(type);
        setEditingTypeValue(type);
    };

    return (
        <div className="categories-manager">
            <div className="manager-header">
                <div>
                    <h2>Gestión de Clasificaciones y Tipos</h2>
                    <p>Administra las categorías y subcategorías de tus productos</p>
                </div>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Package size={20} />
                    Gestionar Productos
                </button>
            </div>

            <div className="manager-grid">
                {/* Classifications (Categories) */}
                <div className="manager-section">
                    <div className="section-header">
                        <h3>📦 Clasificaciones</h3>
                        <div className="add-item">
                            <input
                                type="text"
                                placeholder="Nueva clasificación..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                className="input-add"
                            />
                            <button onClick={handleAddCategory} className="btn-add" title="Agregar">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="items-list">
                        {categories.map(category => (
                            <div
                                key={category}
                                className={`item-card ${selectedCategory === category ? 'selected' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {editingCategory === category ? (
                                    <div className="editing-mode">
                                        <input
                                            type="text"
                                            value={editingCategoryValue}
                                            onChange={(e) => setEditingCategoryValue(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateCategory();
                                                }
                                            }}
                                            autoFocus
                                            className="input-edit"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateCategory();
                                            }}
                                            className="btn-edit"
                                            title="Guardar"
                                            style={{ background: '#10b981' }}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCategory(null);
                                                setEditingCategoryValue('');
                                            }}
                                            className="btn-cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="item-name">{category}</span>
                                        <div className="item-actions">
                                            <span className="item-count">
                                                {types[category]?.length || 0} tipos
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/dashboard?category=${encodeURIComponent(category)}`);
                                                }}
                                                className="btn-edit"
                                                title="Ver Productos"
                                                style={{ background: '#10b981' }}
                                            >
                                                <Package size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartEditCategory(category);
                                                }}
                                                className="btn-edit"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`¿Eliminar clasificación "${category}"? Esto actualizará todos los productos asociados.`)) {
                                                        deleteCategory(category);
                                                        if (selectedCategory === category) {
                                                            setSelectedCategory(null);
                                                        }
                                                    }
                                                }}
                                                className="btn-delete"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Types (Subcategories) */}
                <div className="manager-section">
                    <div className="section-header">
                        <h3>🏷️ Tipos {selectedCategory && `de ${selectedCategory}`}</h3>
                        {selectedCategory && (
                            <div className="add-item">
                                <input
                                    type="text"
                                    placeholder="Nuevo tipo..."
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
                                    className="input-add"
                                />
                                <button onClick={handleAddType} className="btn-add" title="Agregar">
                                    <Plus size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {!selectedCategory ? (
                        <div className="empty-state">
                            <div className="empty-icon">👈</div>
                            <p>Selecciona una clasificación para ver sus tipos</p>
                        </div>
                    ) : (
                        <div className="items-list">
                            {types[selectedCategory]?.length > 0 ? (
                                types[selectedCategory].map(type => (
                                    <div key={type} className="item-card">
                                        {editingType === type ? (
                                            <div className="editing-mode">
                                                <input
                                                    type="text"
                                                    value={editingTypeValue}
                                                    onChange={(e) => setEditingTypeValue(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateType();
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="input-edit"
                                                />
                                                <button
                                                    onClick={() => handleUpdateType()}
                                                    className="btn-edit"
                                                    title="Guardar"
                                                    style={{ background: '#10b981' }}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingType(null);
                                                        setEditingTypeValue('');
                                                    }}
                                                    className="btn-cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="item-name">{type}</span>
                                                <div className="item-actions">
                                                    <span className="item-count">
                                                        {countProductsByType(selectedCategory, type)} productos
                                                    </span>
                                                    <button
                                                        onClick={() => navigate(`/admin/dashboard?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(type)}`)}
                                                        className="btn-edit"
                                                        title="Ver Productos"
                                                        style={{ background: '#10b981' }}
                                                    >
                                                        <Package size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStartEditType(type)}
                                                        className="btn-edit"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`¿Eliminar tipo "${type}"? Esto actualizará todos los productos asociados.`)) {
                                                                deleteType(selectedCategory, type);
                                                            }
                                                        }}
                                                        className="btn-delete"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">📝</div>
                                    <p>No hay tipos en esta clasificación</p>
                                    <small>Agrega uno usando el formulario arriba</small>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="info-box">
                <strong>💡 Información:</strong> Cuando edites una clasificación o tipo, se actualizarán automáticamente todos los productos que lo usen.
            </div>
        </div>
    );
}
