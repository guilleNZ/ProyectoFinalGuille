import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch, config } from "../config";

export const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        shippingAddress: "",
        email: "",
        phone: ""
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchCart();
        const userData = localStorage.getItem(config.storageKeys.user);
        if (userData) {
            const userObj = JSON.parse(userData);
            setUser(userObj);
            setFormData(prev => ({
                ...prev,
                email: userObj.email || "",
                phone: userObj.phone || "",
                shippingAddress: userObj.address || ""
            }));
        }
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem(config.storageKeys.token);

        if (!token) {
            // Intentar cargar carrito offline
            const offlineCart = JSON.parse(localStorage.getItem(config.storageKeys.cart)) || [];
            if (offlineCart.length > 0) {
                setCart({
                    items: offlineCart,
                    total: offlineCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                });
                return;
            }
            navigate("/cart");
            return;
        }

        try {
            const response = await authenticatedFetch('/cart');

            if (!response.ok) {
                navigate("/cart");
                return;
            }

            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            // Fallback a localStorage
            const offlineCart = JSON.parse(localStorage.getItem(config.storageKeys.cart)) || [];
            setCart({
                items: offlineCart,
                total: offlineCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "cardNumber") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 16);
            const groups = formattedValue.match(/.{1,4}/g);
            setFormData({
                ...formData,
                [name]: groups ? groups.join(" ") : formattedValue
            });
            return;
        }

        if (name === "expiryDate") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 4);
            if (formattedValue.length >= 2) {
                setFormData({
                    ...formData,
                    [name]: `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: formattedValue
                });
            }
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem(config.storageKeys.token);

        // Validaciones
        if (!formData.shippingAddress.trim()) {
            alert("Por favor, ingresa una dirección de envío");
            setLoading(false);
            return;
        }

        if (paymentMethod === "card") {
            if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
                alert("Por favor, completa todos los datos de la tarjeta");
                setLoading(false);
                return;
            }
        }

        try {
            // Simular procesamiento de pago (2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!token) {
                // Modo offline: simular orden
                const offlineCart = JSON.parse(localStorage.getItem(config.storageKeys.cart)) || [];
                const order = {
                    id: Date.now(),
                    items: offlineCart,
                    total: cart.total,
                    status: "paid",
                    shipping_address: formData.shippingAddress,
                    created_at: new Date().toISOString()
                };

                // Guardar orden en localStorage
                const orders = JSON.parse(localStorage.getItem('offline_orders')) || [];
                orders.push(order);
                localStorage.setItem('offline_orders', JSON.stringify(orders));

                // Limpiar carrito
                localStorage.removeItem(config.storageKeys.cart);

                alert("¡Orden creada exitosamente en modo offline!");
                navigate("/orders");
                return;
            }

            // Crear orden en el backend
            const response = await authenticatedFetch('/orders', {
                method: "POST",
                body: JSON.stringify({
                    shipping_address: formData.shippingAddress
                })
            });

            if (response.ok) {
                const orderData = await response.json();
                alert(`¡Pago procesado exitosamente! Orden #${orderData.order.id} creada.`);
                navigate("/orders");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Error al crear la orden");
            }
        } catch (error) {
            alert(`Error al procesar el pago: ${error.message}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!cart) {
        return (
            <div className="container py-5 text-center">
                <p>Cargando información de pago...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4" style={{ color: '#1a1a1a' }}>Finalizar Compra</h1>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="mb-4">Información de Pago</h2>

                            {/* Información del usuario */}
                            {user && (
                                <div className="alert alert-info mb-4">
                                    <i className="fas fa-user me-2"></i>
                                    <strong>Comprador:</strong> {user.first_name} {user.last_name} ({user.email})
                                </div>
                            )}

                            {/* Método de pago */}
                            <div className="mb-4">
                                <h5 className="mb-3">Método de Pago</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div
                                            className={`card border ${paymentMethod === "card" ? "border-dark" : ""}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setPaymentMethod("card")}
                                        >
                                            <div className="card-body text-center">
                                                <i className="far fa-credit-card fa-2x mb-2"></i>
                                                <p className="mb-0">Tarjeta de Crédito/Débito</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className={`card border ${paymentMethod === "paypal" ? "border-dark" : ""}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setPaymentMethod("paypal")}
                                        >
                                            <div className="card-body text-center">
                                                <i className="fab fa-paypal fa-2x mb-2" style={{ color: '#003087' }}></i>
                                                <p className="mb-0">PayPal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit}>
                                {/* Dirección de envío */}
                                <div className="mb-4">
                                    <label htmlFor="shippingAddress" className="form-label fw-bold">
                                        <i className="fas fa-home me-2"></i>
                                        Dirección de Envío *
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="shippingAddress"
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Calle, número, ciudad, código postal, país"
                                        required
                                    ></textarea>
                                </div>

                                {/* Información de contacto */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">Teléfono *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Formulario de tarjeta (si se selecciona) */}
                                {paymentMethod === "card" && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="cardNumber" className="form-label">Número de Tarjeta *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="cardName" className="form-label">Nombre en la Tarjeta *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cardName"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                                placeholder="JUAN PEREZ"
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="expiryDate" className="form-label">Fecha de Expiración *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="cvv" className="form-label">CVV *</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    maxLength="3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-dark btn-lg w-100 py-3"
                                    disabled={loading || cart.items.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Procesando Pago...
                                        </>
                                    ) : (
                                        `Confirmar Pago - $${((cart.total || 0) * 1.21).toLocaleString()}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h5 className="mb-4">Resumen del Pedido</h5>

                            <div className="mb-3">
                                <h6>Productos ({cart.items?.length || 0})</h6>
                                {cart.items?.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2 border-bottom pb-2">
                                        <div>
                                            <span className="small">
                                                {item.product?.name || item.name} x {item.quantity}
                                            </span>
                                            <br />
                                            <small className="text-muted">
                                                {item.product?.brand || item.brand}
                                            </small>
                                        </div>
                                        <span className="small">
                                            ${((item.product?.price || item.price) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr />

                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Subtotal</span>
                                    <span>${cart.total?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Envío</span>
                                    <span className="text-success">Gratis</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>IVA (21%)</span>
                                    <span>${(cart.total * 0.21).toLocaleString()}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold fs-5">
                                    ${((cart.total || 0) * 1.21).toLocaleString()}
                                </span>
                            </div>

                            {/* Información de seguridad */}
                            <div className="border-top pt-3">
                                <p className="small text-muted mb-2">
                                    <i className="fas fa-lock me-2"></i>
                                    Transacción segura SSL 256-bit
                                </p>
                                <p className="small text-muted mb-2">
                                    <i className="fas fa-shield-alt me-2"></i>
                                    Tus datos están protegidos
                                </p>
                                <p className="small text-muted mb-0">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Política de devolución de 30 días
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botón volver */}
                    <div className="mt-3">
                        <button
                            className="btn btn-outline-dark w-100"
                            onClick={() => navigate("/cart")}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Volver al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};