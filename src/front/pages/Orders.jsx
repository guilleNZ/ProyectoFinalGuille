// src/front/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch, config } from "../config";

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem(config.storageKeys.token);

        if (!token) {
            
            const offlineOrders = JSON.parse(localStorage.getItem('offline_orders')) || [];
            setOrders(offlineOrders);
            setLoading(false);
            return;
        }

        try {
            const response = await authenticatedFetch('/orders');

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                    return;
                }
                throw new Error("Error al cargar las órdenes");
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error.message);
            
            const offlineOrders = JSON.parse(localStorage.getItem('offline_orders')) || [];
            setOrders(offlineOrders);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando tus órdenes...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4" style={{ color: '#1a1a1a' }}>Mis Pedidos</h1>

            {error && (
                <div className="alert alert-warning mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-shopping-bag fa-4x text-muted mb-4"></i>
                    <h3>No tienes pedidos aún</h3>
                    <p className="text-muted mb-4">
                        Cuando realices tu primera compra, aparecerá aquí.
                    </p>
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/catalog")}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Comenzar a Comprar
                    </button>
                </div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="card-title mb-1">Orden #{order.id}</h5>
                                            <p className="text-muted small mb-0">
                                                {new Date(order.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`badge ${order.status === 'paid' ? 'bg-success' :
                                            order.status === 'pending' ? 'bg-warning' :
                                                order.status === 'shipped' ? 'bg-info' :
                                                    'bg-secondary'
                                            }`}>
                                            {order.status === 'paid' ? 'Pagado' :
                                                order.status === 'pending' ? 'Pendiente' :
                                                    order.status === 'shipped' ? 'Enviado' :
                                                        order.status}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <h6>Productos:</h6>
                                        <ul className="list-unstyled">
                                            {order.items?.map((item, index) => (
                                                <li key={index} className="d-flex justify-content-between mb-1">
                                                    <span>
                                                        {item.product?.name || item.name} x {item.quantity}
                                                    </span>
                                                    <span>${item.price?.toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-top pt-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>Total:</strong>
                                            <strong className="fs-5">${order.total_amount?.toLocaleString()}</strong>
                                        </div>

                                        {order.shipping_address && (
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    <i className="fas fa-truck me-1"></i>
                                                    {order.shipping_address}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};