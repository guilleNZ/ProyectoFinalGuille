import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    address: formData.address
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al registrar usuario");
            }

            
            const userData = data.user || {};

            
            const completeUserData = {
                id: userData.id || Date.now(),
                email: userData.email || formData.email,
                first_name: userData.first_name || formData.first_name || "",
                last_name: userData.last_name || formData.last_name || "",
                address: userData.address || formData.address || "",
                phone: userData.phone || formData.phone || "",
                created_at: userData.created_at || new Date().toISOString(),
                is_active: userData.is_active !== undefined ? userData.is_active : true
            };

            // Guardar token y usuario completo
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(completeUserData));

            // Mostrar mensaje de éxito
            alert("✅ ¡Cuenta creada exitosamente!");

            // Redirigir al catálogo
            navigate("/catalog");

        } catch (error) {
            setError(error.message);
            console.error("Register error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                                Crear Cuenta
                            </h2>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="first_name" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Juan"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="last_name" className="form-label">Apellido</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="nombre@ejemplo.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+34 600 000 000"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Dirección</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Calle Principal, 123"
                                        rows="2"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        minLength="6"
                                    />
                                    <div className="form-text">Mínimo 6 caracteres</div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Creando cuenta...
                                        </>
                                    ) : "Registrarse"}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <p className="mb-2">
                                    ¿Ya tienes una cuenta?{" "}
                                    <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#1a1a1a' }}>
                                        Inicia sesión aquí
                                    </Link>
                                </p>
                                <Link to="/" className="text-decoration-none">
                                    ← Volver al inicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};