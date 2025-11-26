import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, Save, X, Search, Settings } from 'lucide-react';

export default function Inventory() {
    const { products, addProduct, updateProduct, deleteProduct, categories, types } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        image: null
    };

    const [formData, setFormData] = useState(initialFormState);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            cost: Number(formData.cost),
            price: Number(formData.price),
            stock: Number(formData.stock),
            tax: Number(formData.tax),
            discount: Number(formData.discount)
        };

        if (currentProduct) {
            updateProduct(currentProduct.id, dataToSave);
        } else {
            addProduct(dataToSave);
        }
        setIsEditing(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>
                        {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
                            <input
                                required
                                className="input"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Costo de Compra ($)</label>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>IVA (%)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.tax}
                                onChange={e => setFormData({ ...formData, tax: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descuento (%)</label>
                            <input
                                type="number"
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>URL de Imagen</label>
                            <input
                                className="input"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Gestión de Inventario</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Administra tus productos, precios y existencias.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/admin/categories" className="btn btn-secondary">
                        <Settings size={18} /> Gestionar Categorías
                    </Link>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Search size={20} />
                    <input
                        className="input"
                        style={{ border: 'none', boxShadow: 'none', padding: '0.5rem' }}
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Margen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{product.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
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
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(product)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => deleteProduct(product.id)}>
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
        </div>
    );
}
