

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";

import PaymentSimulator from "../components/PaymentSimulator";


export const Checkout = () => {
  
    const { store, dispatch } = useGlobalReducer(); 
    
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
    
    const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
    
    const [cart, setCart] = useState(null);

    useEffect(() => {
        
        const loadCart = () => {
            
            if (store && store.cart && store.cart.items && store.cart.items.length > 0) {
                setCart(store.cart); 
                console.log("Carrito cargado del store global:", store.cart);
                return; 
            }

           
            const storedCart = JSON.parse(localStorage.getItem('localCart')) || []; 
            if (storedCart.length > 0) {
                const total = storedCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
                const cartData = {
                    items: storedCart,
                    total: total
                };
                setCart(cartData);
                console.log("Carrito cargado de localStorage:", cartData);
                return; 
            }

            
            console.warn("Carrito vacío o no encontrado en store ni localStorage, redirigiendo a /cart");
            navigate("/cart");
        };

        loadCart();
    }, [store.cart, navigate]); 

    
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
        setError(null); 

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

            
            setShowPaymentSimulator(true);
            
            setLoading(false);
            

        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado durante la simulación del checkout.");
            console.error("Error en handleSubmit:", err);
        }
        
    };

    
    const handlePaymentSuccess = (simulatedOrderData) => {
        console.log("Pago simulado exitoso. Datos de la orden:", simulatedOrderData);

        
        const clearCartAction = { type: 'CLEAR_CART' }; 
        dispatch(clearCartAction); 

        
        localStorage.removeItem('localCart'); 

        
        if (simulatedOrderData) {
            const existingSimulatedOrders = JSON.parse(localStorage.getItem('simulatedOrders')) || []; // Asume una clave para órdenes simuladas
            existingSimulatedOrders.push(simulatedOrderData);
            localStorage.setItem('simulatedOrders', JSON.stringify(existingSimulatedOrders));
        }

        
        window.dispatchEvent(new Event('cartUpdated'));

        
        alert("✅ ¡Compra realizada exitosamente! Tu orden ha sido creada.");

        
        navigate("/orders");
    };
    
    const handlePaymentCancel = () => {
        console.log("Pago simulado cancelado por el usuario.");
        
        setShowPaymentSimulator(false);
        
    };
   
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
                
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <PaymentSimulator
                            cartTotal={cart.total} 
                            onSuccess={handlePaymentSuccess} 
                            onCancel={handlePaymentCancel}   
                        />
                    </div>
                </div>
            )}
            

        </div>
    );
};