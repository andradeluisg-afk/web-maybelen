import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Filter, CheckCircle, XCircle, Clock, Package, ChevronDown, ChevronUp, User, Phone, Calendar } from 'lucide-react';

export default function OrdersManager() {
    const { getOrders, updateOrderStatus } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    const loadOrders = async () => {
        setLoading(true);
        const status = filterStatus === 'all' ? null : filterStatus;
        const { success, orders: data } = await getOrders(status);
        if (success) {
            setOrders(data);
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;

        const reduceStock = newStatus === 'confirmed';
        const { success, error } = await updateOrderStatus(orderId, newStatus, reduceStock);

        if (success) {
            loadOrders();
            if (newStatus === 'confirmed') {
                alert('Pedido confirmado y stock actualizado exitosamente.');
            }
        } else {
            alert('Error actualizando el pedido: ' + error);
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
                        <div key={order.id} className="card" style={{ overflow: 'hidden' }}>
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
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
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
                                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {/* Order Details (Expanded) */}
                            {expandedOrder === order.id && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: '#f8fafc' }}>
                                    <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>Productos del Pedido:</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                        {order.order_items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                {item.product_image && (
                                                    <img src={item.product_image} alt={item.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        ${item.unit_price.toFixed(2)} x {item.quantity}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: '700' }}>
                                                    ${item.subtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    {order.status === 'pending' && (
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
