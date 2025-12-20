// src/front/components/PaymentSimulator.jsx (o src/front/pages/Checkout.jsx)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// --- CORRECCIÓN: Importa el hook con 'default' porque se exporta como default ---
import useGlobalReducer from "../hooks/useGlobalReducer"; // Importación 'default'
// --- FIN CORRECCIÓN ---
// ... (otros imports) ...

const PaymentSimulator = ({ cartTotal, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // --- CORRECCIÓN: Usa el hook correcto ---
    const { store, dispatch } = useGlobalReducer(); // Accede al store global y a la función dispatch
    // --- FIN CORRECCIÓN ---

    // ... (resto del código del componente) ...

    const simulatePaymentProcess = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("Simulando procesamiento de pago...");
            // Simular el "procesamiento del pago" (ej: espera, llamada a API externa simulada)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos simulando el proceso
            console.log("Procesamiento de pago simulado completado.");

            // --- SIMULACIÓN DE CREACIÓN DE ORDEN Y VACIADO DE CARRITO EN FRONTEND ---
            // 1. Simular la creación de una orden (guardar en localStorage como ejemplo)
            const simulatedOrder = {
                id: Date.now(), // ID único basado en timestamp
                status: "completed", // Simula estado completado
                total_amount: cartTotal,
                // Para esta simulación simple, no guardamos los items aquí, solo el total.
                // En un caso real, los items vendrían del carrito que se vacía.
                created_at: new Date().toISOString(),
                shipping_address: "Dirección simulada en checkout", // Puedes pasar la dirección real si está disponible
                user_email: store.user?.email || "usuario_anonimo@ejemplo.com" // O usar email del store si está logueado
            };

            // 2. Guardar la orden simulada en localStorage (como ejemplo de persistencia del lado del cliente)
            // Opcional: Combina con órdenes existentes
            // --- CAMBIADO: Usar clave directa en lugar de config.storageKeys.orders ---
            const existingOrders = JSON.parse(localStorage.getItem('simulatedOrders')) || []; // Asume una clave para órdenes
            existingOrders.push(simulatedOrder);
            localStorage.setItem('simulatedOrders', JSON.stringify(existingOrders)); // Asume una clave para órdenes
            // --- FIN CAMBIADO ---

            // 3. Vaciar el carrito en el estado global (usa dispatch para llamar a la acción del reducer)
            // Asumiendo que en tu storeReducer (en src/store.js) tienes una acción como 'CLEAR_CART'
            const clearCartAction = { type: 'CLEAR_CART' }; // Define el tipo de acción
            dispatch(clearCartAction); // Usa dispatch para cambiar el estado global

            // 4. Vaciar el carrito en localStorage (por si acaso o para modo offline)
            // --- CAMBIADO: Usar clave directa en lugar de config.storageKeys.cart ---
            localStorage.removeItem('localCart');
            // --- FIN CAMBIADO ---

            // 5. Disparar un evento para notificar a otros componentes (como la Navbar) que el carrito cambió
            window.dispatchEvent(new Event('cartUpdated'));

            console.log("Carrito vaciado y evento 'cartUpdated' disparado.");

            // 6. Llamar a la función onSuccess pasada como prop para manejar la redirección o actualización en el componente padre (Checkout)
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(simulatedOrder); // Puedes pasar la orden simulada como argumento si es útil
            } else {
                // Si no se proporciona onSuccess, redirigir a la página de órdenes por defecto
                navigate("/orders");
            }

        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado durante la simulación del pago.");
            console.error("Error en PaymentSimulator:", err);
        } finally {
            setLoading(false); // Deja de mostrar el estado de carga
        }
    };

    // Ejecutar la simulación cuando el componente se monte
    useEffect(() => {
        simulatePaymentProcess();
    }, []); // No depende de props para ejecutarse inmediatamente al montar

    // ... (renderizado del componente) ...
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
                                onSuccess(); // Llama a onSuccess para continuar el flujo en Checkout.jsx
                            } else {
                                navigate("/orders"); // Redirige si no hay onSuccess
                            }
                        }}
                    >
                        Ir a Mis Órdenes
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel} // Llama a la función onCancel pasada como prop
                    >
                        Volver al Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSimulator;