

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer"; 


const PaymentSimulator = ({ cartTotal, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { store, dispatch } = useGlobalReducer(); 


    

    const simulatePaymentProcess = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("Simulando procesamiento de pago...");
            
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            console.log("Procesamiento de pago simulado completado.");

            
            const simulatedOrder = {
                id: Date.now(), 
                status: "completed", 
                total_amount: cartTotal,
                
                created_at: new Date().toISOString(),
                shipping_address: "Dirección simulada en checkout", 
                user_email: store.user?.email || "usuario_anonimo@ejemplo.com" 
            };

            
            const existingOrders = JSON.parse(localStorage.getItem('simulatedOrders')) || []; 
            localStorage.setItem('simulatedOrders', JSON.stringify(existingOrders)); 
            
            const clearCartAction = { type: 'CLEAR_CART' }; 
            dispatch(clearCartAction); 

            
            localStorage.removeItem('localCart');
           
            
            window.dispatchEvent(new Event('cartUpdated'));

            console.log("Carrito vaciado y evento 'cartUpdated' disparado.");

            
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(simulatedOrder); 
            } else {
                
                navigate("/orders");
            }

        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado durante la simulación del pago.");
            console.error("Error en PaymentSimulator:", err);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        simulatePaymentProcess();
    }, []); 

    
    return (
        <div className="payment-simulator p-4 border rounded bg-light">
            <h3>Simulación de Pago</h3>
            {error && (
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Simulando procesamiento de pago...</p>
                </div>
            ) : (
                <div className="text-center">
                    <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                    <p className="lead">Pago simulado exitosamente.</p>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            if (onSuccess && typeof onSuccess === 'function') {
                                onSuccess(); 
                            } else {
                                navigate("/orders"); 
                            }
                        }}
                    >
                        Ir a Mis Órdenes
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel} 
                    >
                        Volver al Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSimulator;