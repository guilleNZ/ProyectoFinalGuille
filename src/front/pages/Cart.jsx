import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

export const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        // Usar SOLO localStorage
        const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
        const total = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setCart({
            items: localCart,
            total: total
        });
        setLoading(false);
    };

    const handleRemoveItem = (productId) => {
        // Eliminar del estado local
        const currentCart = { ...cart };
        currentCart.items = currentCart.items.filter(item => item.id !== productId);
        currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setCart(currentCart);

        // Actualizar localStorage
        let localCart = JSON.parse(localStorage.getItem('localCart')) || [];
        localCart = localCart.filter(item => item.id !== productId);
        localStorage.setItem('localCart', JSON.stringify(localCart));

        // 👇 Disparar evento para actualizar Navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(productId);
            return;
        }

        // Actualizar estado local
        const currentCart = { ...cart };
        currentCart.items = currentCart.items.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setCart(currentCart);

        // Actualizar localStorage
        let localCart = JSON.parse(localStorage.getItem('localCart')) || [];
        localCart = localCart.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        localStorage.setItem('localCart', JSON.stringify(localCart));

        // 👇 Disparar evento para actualizar Navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleClearCart = () => {
        setCart({ items: [], total: 0 });
        localStorage.removeItem('localCart');

        // 👇 Disparar evento para actualizar Navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCheckout = () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para proceder al pago");
            navigate("/login");
            return;
        }

        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando carrito...</p>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">
                    <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                    <h2 className="mb-3">Tu carrito está vacío</h2>
                    <p className="text-muted mb-4">
                        Agrega algunos relojes de lujo a tu carrito para continuar
                    </p>
                    <Link to="/catalog" className="btn btn-dark btn-lg">
                        <i className="fas fa-arrow-left me-2"></i>
                        Explorar Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0" style={{ color: '#1a1a1a' }}>Tu Carrito</h1>
                <button
                    className="btn btn-danger"
                    onClick={handleClearCart}
                >
                    <i className="fas fa-trash me-2"></i>
                    Vaciar Carrito
                </button>
            </div>

            <div className="row">
                {/* Lista de productos */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: '100px' }}>Producto</th>
                                            <th scope="col">Detalles</th>
                                            <th scope="col" className="text-center">Cantidad</th>
                                            <th scope="col" className="text-end">Precio</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.items.map((item) => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                onRemove={() => handleRemoveItem(item.id)}
                                                onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.id, newQuantity)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                        <Link to="/catalog" className="btn btn-outline-dark">
                            <i className="fas fa-arrow-left me-2"></i>
                            Continuar Comprando
                        </Link>
                        {/* REMOVIDO: Botón de vaciar todo de la parte inferior */}
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Resumen del Pedido</h5>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>${cart.total.toLocaleString()}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Envío</span>
                                <span className="text-success">Gratis</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">IVA (21%)</span>
                                <span>${(cart.total * 0.21).toLocaleString()}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold fs-5">
                                    ${(cart.total * 1.21).toLocaleString()}
                                </span>
                            </div>

                            <button
                                className="btn btn-dark btn-lg w-100 py-3 mb-3"
                                onClick={handleCheckout}
                                disabled={cart.items.length === 0}
                            >
                                <i className="fas fa-lock me-2"></i>
                                Proceder al Pago
                            </button>

                            <div className="text-center">
                                <p className="small text-muted mb-2">
                                    <i className="fas fa-shield-alt me-2"></i>
                                    Compra 100% segura
                                </p>
                                <div className="d-flex justify-content-center gap-3">
                                    <i className="fab fa-cc-visa fa-2x text-muted"></i>
                                    <i className="fab fa-cc-mastercard fa-2x text-muted"></i>
                                    <i className="fab fa-cc-amex fa-2x text-muted"></i>
                                    <i className="fab fa-cc-paypal fa-2x text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-body">
                            <h6 className="mb-3">
                                <i className="fas fa-gift me-2"></i>
                                Beneficios de tu compra
                            </h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Envío gratuito y asegurado
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Garantía internacional de 2 años
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Certificado de autenticidad
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Devolución gratuita en 30 días
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Asesoramiento personalizado
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};