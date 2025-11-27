import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Filter, CheckCircle, XCircle, Clock, Package, ChevronDown, ChevronUp, User, Phone, Calendar, Edit2, Save, X, Trash2, Plus } from 'lucide-react';

export default function OrdersManager() {
    const { getOrders, updateOrderStatus, updateOrderItems, products } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Estados para edición
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);

    // Estados para agregar productos
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    // ... (loadOrders y handleStatusChange se mantienen igual)

    const startEditing = (order) => {
        setEditingOrderId(order.id);
        setEditedItems(JSON.parse(JSON.stringify(order.order_items))); // Deep copy
        setIsEditing(true);
        setShowAddProduct(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingOrderId(null);
        setEditedItems([]);
        setShowAddProduct(false);
    };

    // ... (handleQuantityChange y handleRemoveItem se mantienen igual)

    // Lógica de búsqueda de productos
    useEffect(() => {
        if (searchTerm.trim().length > 1) {
            const results = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
            ).slice(0, 5); // Limitar a 5 resultados
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, products]);

    const handleAddItem = (product) => {
        // Verificar si ya existe en el pedido
        const existingIndex = editedItems.findIndex(item => item.product_id === product.id);

        if (existingIndex >= 0) {
            // Si existe, aumentar cantidad
            handleQuantityChange(existingIndex, editedItems[existingIndex].quantity + 1);
        } else {
            // Si no existe, agregar nuevo item
            const newItem = {
                product_id: product.id,
                product_name: product.name,
                product_image: product.images && product.images.length > 0 ? product.images[0] : (product.image || null),
                quantity: 1,
                unit_price: product.price * (1 - (product.discount || 0) / 100),
                subtotal: product.price * (1 - (product.discount || 0) / 100)
            };
            setEditedItems([...editedItems, newItem]);
        }
        // Limpiar búsqueda
        setSearchTerm('');
        setSearchResults([]);
        setShowAddProduct(false);
    };

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        const newItems = [...editedItems];
        newItems[index].quantity = newQuantity;
        newItems[index].subtotal = newItems[index].unit_price * newQuantity;
        setEditedItems(newItems);
    };

    const handleRemoveItem = (index) => {
        if (window.confirm('¿Eliminar este producto del pedido?')) {
            const newItems = editedItems.filter((_, i) => i !== index);
            setEditedItems(newItems);
        }
    };

    const saveChanges = async () => {
        if (editedItems.length === 0) {
            alert('El pedido no puede estar vacío. Recházalo si es necesario.');
            return;
        }

        const { success, error } = await updateOrderItems(editingOrderId, editedItems);

        if (success) {
            alert('Cambios guardados exitosamente');
            setIsEditing(false);
            setEditingOrderId(null);
            loadOrders();
        } else {
            alert('Error guardando cambios: ' + error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Pendiente</span>;
            case 'confirmed':
                return <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Confirmado</span>;
            case 'rejected':
                return <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Rechazado</span>;
            case 'cancelled':
                return <span className="badge" style={{ background: '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Cancelado</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-EC', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                    Gestión de Pedidos
                </h1>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'pending', 'confirmed', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendientes' : status === 'confirmed' ? 'Confirmados' : 'Rechazados'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando pedidos...</div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: '16px' }}>
                    <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <h3>No hay pedidos encontrados</h3>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card" style={{ overflow: 'hidden', border: isEditing && editingOrderId === order.id ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                            {/* Order Header */}
                            <div
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: expandedOrder === order.id ? '#f8fafc' : 'white',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}
                                onClick={() => !isEditing && setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                        #{order.id}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                            <User size={16} /> {order.customer_name}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            <Calendar size={14} /> {formatDate(order.created_at)}
                                        </div>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                                        ${order.total.toFixed(2)}
                                    </div>
                                    {!isEditing && (expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
                                </div>
                            </div>

                            {/* Order Details (Expanded) */}
                            {(expandedOrder === order.id || (isEditing && editingOrderId === order.id)) && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: '#f8fafc' }}>

                                    {/* Header de Edición */}
                                    {isEditing && editingOrderId === order.id ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#fff0f5', padding: '1rem', borderRadius: '8px' }}>
                                            <h4 style={{ margin: 0, color: 'var(--primary)' }}>✏️ Editando Pedido</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary" onClick={cancelEditing}><X size={16} /> Cancelar</button>
                                                <button className="btn btn-primary" onClick={saveChanges}><Save size={16} /> Guardar Cambios</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 style={{ fontWeight: '700', margin: 0 }}>Productos del Pedido:</h4>
                                            {order.status === 'pending' && (
                                                <button className="btn btn-secondary" onClick={() => startEditing(order)}>
                                                    <Edit2 size={16} /> Editar Pedido
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Buscador para agregar productos */}
                                    {isEditing && editingOrderId === order.id && (
                                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                            {!showAddProduct ? (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ width: '100%', border: '2px dashed var(--border)', justifyContent: 'center' }}
                                                    onClick={() => setShowAddProduct(true)}
                                                >
                                                    <Plus size={16} /> Agregar Producto al Pedido
                                                </button>
                                            ) : (
                                                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <h5 style={{ margin: 0 }}>Buscar Producto</h5>
                                                        <button onClick={() => setShowAddProduct(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                                    </div>
                                                    <div style={{ position: 'relative' }}>
                                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                        <input
                                                            type="text"
                                                            placeholder="Escribe nombre o categoría..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="input"
                                                            style={{ paddingLeft: '2.5rem', width: '100%' }}
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {/* Resultados de búsqueda */}
                                                    {searchResults.length > 0 && (
                                                        <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
                                                            {searchResults.map(product => (
                                                                <div
                                                                    key={product.id}
                                                                    onClick={() => handleAddItem(product)}
                                                                    style={{
                                                                        padding: '0.5rem',
                                                                        borderBottom: '1px solid var(--border)',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem',
                                                                        transition: 'background 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                                >
                                                                    <div style={{ width: '30px', height: '30px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                                        {(product.images && product.images.length > 0) ? (
                                                                            <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                        ) : product.image ? (
                                                                            <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                        ) : null}
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{product.name}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {product.stock} | ${product.price}</div>
                                                                    </div>
                                                                    <Plus size={16} color="var(--primary)" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Lista de Productos */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                        {(isEditing && editingOrderId === order.id ? editedItems : order.order_items).map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                {item.product_image && (
                                                    <img src={item.product_image} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                                )}

                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        ${item.unit_price.toFixed(2)} c/u
                                                    </div>
                                                </div>

                                                {/* Controles de Edición */}
                                                {isEditing && editingOrderId === order.id ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px' }}>
                                                            <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleQuantityChange(idx, item.quantity - 1)}>-</button>
                                                            <span style={{ padding: '0 0.5rem', fontWeight: '600' }}>{item.quantity}</span>
                                                            <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleQuantityChange(idx, item.quantity + 1)}>+</button>
                                                        </div>
                                                        <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleRemoveItem(idx)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                                        x {item.quantity}
                                                    </div>
                                                )}

                                                <div style={{ fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>
                                                    ${item.subtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Total Editado */}
                                        {isEditing && editingOrderId === order.id && (
                                            <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: '800', marginTop: '1rem', color: 'var(--primary)' }}>
                                                Total Nuevo: ${editedItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions (Solo si no se está editando) */}
                                    {!isEditing && order.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn btn-danger"
                                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'rejected'); }}
                                            >
                                                <XCircle size={18} /> Rechazar Pedido
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                style={{ background: '#10b981', color: 'white', border: 'none' }}
                                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'confirmed'); }}
                                            >
                                                <CheckCircle size={18} /> Confirmar Venta y Descontar Stock
                                            </button>
                                        </div>
                                    )}

                                    {order.status === 'confirmed' && (
                                        <div style={{ textAlign: 'right', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <CheckCircle size={20} /> Venta completada y stock actualizado
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
