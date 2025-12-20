// src/front/pages/Checkout.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// --- CORRECCIÓN: Importa useGlobalReducer desde el archivo correcto ---
import useGlobalReducer from "../hooks/useGlobalReducer";
// --- FIN CORRECCIÓN ---
// --- AÑADIDO: Importar el componente PaymentSimulator ---
import PaymentSimulator from "../components/PaymentSimulator";
// --- FIN AÑADIDO ---

export const Checkout = () => {
    // --- CORRECCIÓN: Usa el hook correcto ---
    const { store, dispatch } = useGlobalReducer(); // Accede al store global y a la función dispatch
    // --- FIN CORRECCIÓN ---
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        shippingAddress: "",
        email: "",
        phone: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' o 'paypal'
    // --- AÑADIDO: Estado para mostrar el simulador ---
    const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
    // --- FIN AÑADIDO ---
    // --- AÑADIDO: Estado para el carrito (obtenerlo del store o localStorage) ---
    const [cart, setCart] = useState(null);

    useEffect(() => {
        // Cargar carrito del store global o localStorage al montar
        const loadCart = () => {
            // Opción 1: Intentar usar el carrito del store global (si estás usando Flux con carrito ahí)
            // Asumiendo que tu store.js (usando useGlobalReducer) mantiene el carrito en store.cart
            // y que tu componente Cart o Navbar lo actualiza allí.
            // Si store.cart es una estructura como { items: [...], total: ... }
            if (store && store.cart && store.cart.items && store.cart.items.length > 0) {
                setCart(store.cart); // Asigna directamente el carrito del store global
                console.log("Carrito cargado del store global:", store.cart);
                return; // Sale si lo encontró en el store
            }

            // Opción 2: Cargar carrito de localStorage (más común para carritos no persistentes en DB o modo offline)
            const storedCart = JSON.parse(localStorage.getItem('localCart')) || []; // CAMBIADO: Usar 'localCart'
            if (storedCart.length > 0) {
                const total = storedCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
                const cartData = {
                    items: storedCart,
                    total: total
                };
                setCart(cartData);
                console.log("Carrito cargado de localStorage:", cartData);
                return; // Sale si lo encontró en localStorage
            }

            // Si no hay carrito en ningún lado, redirigir al carrito vacío
            console.warn("Carrito vacío o no encontrado en store ni localStorage, redirigiendo a /cart");
            navigate("/cart");
        };

        loadCart();
    }, [store.cart, navigate]); // Agrega store.cart como dependencia si se usa para cargar el carrito

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Formatear número de tarjeta (opcional)
        if (name === "cardNumber") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 16);
            const groups = formattedValue.match(/.{1,4}/g);
            setFormData({
                ...formData,
                [name]: groups ? groups.join(" ") : formattedValue
            });
            return;
        }

        // Formatear fecha de expiración (opcional)
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

    // Manejar el envío del formulario de checkout
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Limpiar errores previos

        // Validaciones
        if (!formData.shippingAddress.trim()) {
            setError("Por favor, ingresa una dirección de envío.");
            setLoading(false);
            return;
        }

        // Validación de stock antes de proceder al pago
        const invalidItems = cart.items.filter(item => item.quantity > item.stock);
        if (invalidItems.length > 0) {
            setError("Algunos productos en tu carrito exceden el stock disponible. Por favor, vuelve al carrito y ajusta las cantidades.");
            setLoading(false);
            return;
        }

        if (paymentMethod === "card") {
            if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
                setError("Por favor, completa todos los datos de la tarjeta.");
                setLoading(false);
                return;
            }
        }

        try {
            // Simular procesamiento de pago (2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // --- MOSTRAR EL COMPONENTE DE SIMULACIÓN DE PAGO ---
            setShowPaymentSimulator(true);
            // Deja de mostrar el estado de carga del formulario principal aquí
            setLoading(false);
            // El resto de la lógica (éxito/cancelación) se manejará dentro del componente PaymentSimulator

        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado durante la simulación del checkout.");
            console.error("Error en handleSubmit:", err);
        }
        // setLoading(false); // Ya no es necesario aquí porque setLoading(false) se hizo antes de mostrar el simulador
    };

    // --- AÑADIDO: Función para manejar el éxito del simulador ---
    const handlePaymentSuccess = (simulatedOrderData) => {
        console.log("Pago simulado exitoso. Datos de la orden:", simulatedOrderData);

        // --- ACCIONES POST-PAGO EXITOSO (SIMULADO) ---
        // 1. Vaciar el carrito en el estado global (usa dispatch para llamar a la acción del reducer)
        // Asumiendo que en tu storeReducer (en src/store.js) tienes una acción como 'CLEAR_CART'
        const clearCartAction = { type: 'CLEAR_CART' }; // Define el tipo de acción
        dispatch(clearCartAction); // Usa dispatch para cambiar el estado global

        // 2. Vaciar el carrito en localStorage (por si acaso o para modo offline)
        localStorage.removeItem('localCart'); // CAMBIADO: Usar 'localCart'

        // 3. Opcional: Guardar la orden simulada en localStorage (si quieres tener un historial local de órdenes simuladas)
        if (simulatedOrderData) {
            const existingSimulatedOrders = JSON.parse(localStorage.getItem('simulatedOrders')) || []; // Asume una clave para órdenes simuladas
            existingSimulatedOrders.push(simulatedOrderData);
            localStorage.setItem('simulatedOrders', JSON.stringify(existingSimulatedOrders));
        }

        // 4. Disparar un evento para notificar a otros componentes (como la Navbar) que el carrito cambió
        window.dispatchEvent(new Event('cartUpdated'));

        // 5. Opcional: Mostrar mensaje de éxito al usuario
        alert("✅ ¡Compra realizada exitosamente! Tu orden ha sido creada.");

        // 6. Ocultar el simulador (si estás controlando su visibilidad desde Checkout.jsx)
        // setShowPaymentSimulator(false); // Descomenta si tienes este estado en Checkout.jsx

        // 7. Redirigir a la página de órdenes
        navigate("/orders");
    };
    // --- FIN AÑADIDO ---

    // --- AÑADIDO: Función para manejar la cancelación del simulador ---
    const handlePaymentCancel = () => {
        console.log("Pago simulado cancelado por el usuario.");
        // Ocultar el componente de simulación
        setShowPaymentSimulator(false);
        // Opcional: Permitir volver a intentar el checkout desde el formulario principal
        // setLoading(false); // No es necesario aquí si setLoading se maneja internamente en PaymentSimulator si lo usa
        // setError(null); // Limpiar error si existía
    };
    // --- FIN AÑADIDO ---

    // --- RENDERIZADO ---
    // Mostrar mensaje de carga si no hay carrito aún
    if (!cart) {
        return (
            <div className="container py-5 text-center">
                <p>Cargando información del carrito...</p>
            </div>
        );
    }

    // Mostrar mensaje si el carrito está vacío
    if (cart.items.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-info text-center">
                    <h4>Tu carrito está vacío</h4>
                    <p>Antes de proceder al pago, agrega artículos a tu carrito.</p>
                    <a href="/products" className="btn btn-primary">Ir a Productos</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4">Finalizar Compra</h1>

            {/* Mensaje de error global */}
            {error && (
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* --- CONDICIONAL: Mostrar Checkout o PaymentSimulator --- */}
            {!showPaymentSimulator ? (
                // --- FORMULARIO DE CHECKOUT NORMAL ---
                <div className="row">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                            {/* Información de envío */}
                            <div className="mb-4">
                                <h3>Datos de Envío</h3>
                                <div className="mb-3">
                                    <label htmlFor="shippingAddress" className="form-label">Dirección de Envío *</label>
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
                                <div className="row">
                                    <div className="col-md-6 mb-3">
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
                                    <div className="col-md-6 mb-3">
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
                            </div>

                            {/* Método de pago */}
                            <div className="mb-4">
                                <h3>Método de Pago</h3>
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

                            {/* Formulario de tarjeta (si se selecciona) */}
                            {paymentMethod === "card" && (
                                <div className="mb-4">
                                    <h4>Detalles de la Tarjeta</h4>
                                    <div className="row">
                                        <div className="col-12 mb-3">
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
                                        <div className="col-12 mb-3">
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
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="expiryDate" className="form-label">Fecha de Expiración *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="expiryDate"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                placeholder="MM/AA"
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
                                </div>
                            )}

                            {/* Botón de confirmar pago */}
                            <button
                                type="submit"
                                className="btn btn-dark btn-lg w-100 py-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Procesando Pago...
                                    </>
                                ) : (
                                    `Confirmar Pago - $${(cart.total * 1.21).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="col-md-4">
                        <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                            <div className="card-body">
                                <h5 className="mb-4">Resumen del Pedido</h5>

                                <div className="mb-3">
                                    <h6>Productos ({cart.items.length})</h6>
                                    {cart.items.map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between mb-2 border-bottom pb-2">
                                            <div>
                                                <span className="small">
                                                    {item.name || item.product?.name} x {item.quantity}
                                                </span>
                                                <br />
                                                <small className="text-muted">
                                                    {item.brand || item.product?.brand}
                                                </small>
                                            </div>
                                            <span className="small">
                                                ${((item.price || item.product?.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <div className="mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal</span>
                                        <span>${cart.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Envío</span>
                                        <span className="text-success">Gratis</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>IVA (21%)</span>
                                        <span>${((cart.total || 0) * 0.21).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold fs-5">
                                        ${(cart.total * 1.21).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            ) : (
                // --- COMPONENTE DE SIMULACIÓN DE PAGO ---
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <PaymentSimulator
                            cartTotal={cart.total} // Pasa el total del carrito al simulador
                            onSuccess={handlePaymentSuccess} // Pasa la función para manejar éxito
                            onCancel={handlePaymentCancel}   // Pasa la función para manejar cancelación
                        />
                    </div>
                </div>
            )}
            {/* --- FIN CONDICIONAL --- */}

        </div>
    );
};