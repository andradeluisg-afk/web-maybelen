import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, Save, X, Search, Settings, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import NotificationModal from '../../components/NotificationModal';

export default function Inventory() {
    const { products, addProduct, updateProduct, deleteProduct, categories, types } = useStore();
    const [searchParams] = useSearchParams();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [filterSubcategory, setFilterSubcategory] = useState('Todas');
    const [sortBy, setSortBy] = useState('id'); // 'id', 'name', 'price', 'stock', 'date'
    const [notification, setNotification] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        details: []
    });

    const initialFormState = {
        name: '',
        category: '',
        subcategory: '',
        cost: 0,
        price: 0,
        stock: 0,
        tax: 0,
        discount: 0,
        description: '',
        images: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSaving, setIsSaving] = useState(false);

    // Leer filtros de la URL
    useEffect(() => {
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');

        if (category) {
            setFilterCategory(category);
        }
        if (subcategory) {
            setFilterSubcategory(subcategory);
        }
    }, [searchParams]);

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData(product);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentProduct(null);
        setFormData(initialFormState);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const dataToSave = {
                ...formData,
                cost: Number(formData.cost),
                price: Number(formData.price),
                stock: Number(formData.stock),
                tax: Number(formData.tax),
                discount: Number(formData.discount)
            };

            const isUpdate = !!currentProduct;
            const details = [];

            // Generar resumen de cambios
            if (isUpdate) {
                details.push(`Producto actualizado: "${formData.name}"`);

                if (currentProduct.price !== dataToSave.price) {
                    details.push(`Precio modificado: $${currentProduct.price} → $${dataToSave.price}`);
                }
                if (currentProduct.stock !== dataToSave.stock) {
                    details.push(`Stock actualizado: ${currentProduct.stock} → ${dataToSave.stock}`);
                }
                if (currentProduct.category !== dataToSave.category) {
                    details.push(`Categoría cambiada: ${currentProduct.category} → ${dataToSave.category}`);
                }
            } else {
                details.push(`Nuevo producto creado: "${formData.name}"`);
                details.push(`Precio: $${dataToSave.price}`);
                details.push(`Stock inicial: ${dataToSave.stock} unidades`);
                details.push(`Categoría: ${dataToSave.category}`);
            }

            const imageCount = formData.images?.length || 0;
            if (imageCount > 0) {
                details.push(`${imageCount} imagen${imageCount > 1 ? 'es' : ''} ${isUpdate ? 'actualizada' : 'subida'}${imageCount > 1 ? 's' : ''}`);
            }

            let result;
            if (isUpdate) {
                result = await updateProduct(currentProduct.id, dataToSave);
            } else {
                result = await addProduct(dataToSave);
            }

            if (result.success) {
                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: isUpdate ? '✅ Producto Actualizado' : '✅ Producto Creado',
                    details
                });
                setIsEditing(false);
                setFormData(initialFormState);
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: '❌ Error al Guardar',
                    details: [
                        result.error || 'No se pudo guardar el producto',
                        'Por favor, verifica los datos e intenta de nuevo'
                    ]
                });
            }
        } catch (error) {
            console.error('Error guardando producto:', error);
            setNotification({
                isOpen: true,
                type: 'error',
                title: '❌ Error Inesperado',
                details: [
                    'Ocurrió un error al guardar el producto',
                    error.message || 'Error desconocido',
                    'Revisa la consola para más detalles'
                ]
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Filtrar y ordenar productos
    let filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'Todas' || p.category === filterCategory;
        const matchesSubcategory = filterSubcategory === 'Todas' || p.subcategory === filterSubcategory;

        return matchesSearch && matchesCategory && matchesSubcategory;
    });

    // Ordenar
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return b.price - a.price;
            case 'stock':
                return b.stock - a.stock;
            case 'date':
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            case 'id':
            default:
                // Ordenar por ID numérico
                const idA = typeof a.id === 'string' ? parseInt(a.id.split('-').pop()) : a.id;
                const idB = typeof b.id === 'string' ? parseInt(b.id.split('-').pop()) : b.id;
                return idA - idB;
        }
    });

    // Formatear ID con ceros
    const formatID = (id) => {
        if (typeof id === 'string' && id.includes('-')) {
            // Es un UUID, mostrar solo los últimos dígitos
            return id.split('-').pop().substring(0, 6).toUpperCase();
        }
        // Es un número, formatear con ceros
        return String(id).padStart(4, '0');
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    // Obtener subcategorías de la categoría seleccionada
    const availableSubcategories = filterCategory === 'Todas'
        ? []
        : (types[filterCategory] || []);

    if (isEditing) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                        {currentProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                    </h2>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        <X size={18} /> Cancelar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre del Producto</label>
                            <input
                                required
                                className="input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoría</label>
                            <select
                                required
                                className="input"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subcategoría</label>
                            <select
                                className="input"
                                value={formData.subcategory}
                                onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                disabled={!formData.category}
                            >
                                <option value="">Ninguna</option>
                                {formData.category && types[formData.category]?.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock Actual</label>
                            <input
                                type="number"
                                required
                                className="input"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Costo Unitario ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="input"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio de Venta ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="input"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descuento (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                className="input"
                                value={formData.discount}
                                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <ImageUploader
                                images={formData.images || []}
                                onImagesChange={(images) => setFormData({ ...formData, images })}
                                maxImages={4}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.6 : 1 }}
                        >
                            <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Gestión de Productos</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                        {filterCategory !== 'Todas' && ` en ${filterCategory}`}
                        {filterSubcategory !== 'Todas' && ` / ${filterSubcategory}`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/admin/categories" className="btn btn-secondary">
                        <Settings size={18} /> Gestionar Categorías
                    </Link>
                    <button onClick={handleCreate} className="btn btn-primary">
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                            <Search size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Buscar
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Categoría</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setFilterSubcategory('Todas');
                            }}
                            className="input"
                        >
                            <option value="Todas">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Subcategoría</label>
                        <select
                            value={filterSubcategory}
                            onChange={(e) => setFilterSubcategory(e.target.value)}
                            className="input"
                            disabled={filterCategory === 'Todas' || availableSubcategories.length === 0}
                        >
                            <option value="Todas">Todas las subcategorías</option>
                            {availableSubcategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Ordenar por</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input"
                        >
                            <option value="id">ID</option>
                            <option value="name">Nombre (A-Z)</option>
                            <option value="price">Precio (Mayor a Menor)</option>
                            <option value="stock">Stock (Mayor a Menor)</option>
                            <option value="date">Fecha de Creación</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="table-container">
                <table style={{ fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ fontSize: '0.8rem' }}>
                            <th style={{ width: '70px' }}>ID</th>
                            <th style={{ width: '100px' }}>Imágenes</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Margen</th>
                            <th>Creado</th>
                            <th style={{ width: '130px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
                            const productImages = product.images || [];

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <code style={{
                                            background: '#f1f5f9',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem'
                                        }}>
                                            {formatID(product.id)}
                                        </code>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {productImages.length > 0 ? (
                                                productImages.slice(0, 4).map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`${product.name} ${idx + 1}`}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            border: '1px solid var(--border)'
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: '#f1f5f9',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#94a3b8'
                                                }}>
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{product.name}</div>
                                        {product.subcategory && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {product.subcategory}
                                            </div>
                                        )}
                                    </td>
                                    <td><span className="badge" style={{ background: '#f1f5f9' }}>{product.category}</span></td>
                                    <td>
                                        <span className={`badge ${product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td>${product.cost.toFixed(2)}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>
                                        <span style={{ color: margin > 30 ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                                            {margin}%
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(product.created_at)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`¿Eliminar "${product.name}"?`)) {
                                                        deleteProduct(product.id);
                                                    }
                                                }}
                                                className="btn btn-danger"
                                                style={{ padding: '0.4rem 0.8rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                title={notification.title}
                details={notification.details}
            />
        </div>
    );
}
