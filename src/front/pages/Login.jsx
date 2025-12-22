import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al iniciar sesión");
            }

            
            const userData = data.user || {};

            // Crear objeto de usuario completo con valores por defecto
            const completeUserData = {
                id: userData.id || Date.now(),
                email: userData.email || email,
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                address: userData.address || "",
                phone: userData.phone || "",
                created_at: userData.created_at || new Date().toISOString(),
                is_active: userData.is_active !== undefined ? userData.is_active : true
            };

            // Guardar token y usuario completo
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(completeUserData));

            // Mostrar mensaje de éxito
            alert("✅ ¡Inicio de sesión exitoso!");

            // Redirigir al catálogo
            navigate("/catalog");

        } catch (error) {
            setError(error.message);
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                                Iniciar Sesión
                            </h2>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nombre@ejemplo.com"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength="6"
                                    />
                                    <div className="form-text">
                                        Mínimo 6 caracteres
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Cargando...
                                        </>
                                    ) : "Iniciar Sesión"}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <p className="mb-2">
                                    ¿No tienes una cuenta?{" "}
                                    <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#1a1a1a' }}>
                                        Regístrate aquí
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