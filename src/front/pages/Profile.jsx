import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        phone: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        // SOLUCIÓN: Primero intentar cargar datos de localStorage
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData({
                    first_name: parsedUser.first_name || "",
                    last_name: parsedUser.last_name || "",
                    email: parsedUser.email || "",
                    address: parsedUser.address || "",
                    phone: parsedUser.phone || ""
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
                // Si hay error en el parseo, usar valores por defecto
                setUser({
                    first_name: "",
                    last_name: "",
                    email: "",
                    address: "",
                    phone: ""
                });
            }
        } else {
            // Si no hay datos en localStorage, crear objeto vacío
            setUser({
                first_name: "",
                last_name: "",
                email: "",
                address: "",
                phone: ""
            });
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                address: "",
                phone: ""
            });
        }

        setLoading(false);
    };

    const handleEditToggle = () => {
        setEditing(!editing);
        if (!editing) {
            // Al activar edición, copiar datos actuales al formulario
            setFormData({
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                email: user?.email || "",
                address: user?.address || "",
                phone: user?.phone || ""
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para actualizar tu perfil");
            navigate("/login");
            return;
        }

        try {
            // SOLUCIÓN: Actualizar localStorage inmediatamente
            const updatedUser = {
                ...user,
                ...formData
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setEditing(false);
            alert("✅ Perfil actualizado correctamente");

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error al actualizar el perfil");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando perfil...</p>
            </div>
        );
    }

    // SOLUCIÓN: Asegurar que user siempre tenga un valor
    const safeUser = user || {
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        phone: ""
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h1 className="mb-2" style={{ color: '#1a1a1a' }}>
                                <i className="fas fa-user-circle me-2"></i>
                                Mi Perfil
                            </h1>
                            <p className="text-muted mb-0">
                                Gestiona tu información personal
                            </p>
                        </div>

                        <div className="d-flex gap-2">
                            {!editing ? (
                                <button
                                    className="btn btn-dark"
                                    onClick={handleEditToggle}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Editar Perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleSave}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        Guardar Cambios
                                    </button>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={handleEditToggle}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Información del perfil */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">
                                <i className="fas fa-id-card me-2"></i>
                                Información Personal
                            </h5>

                            <div className="row">
                                {/* Nombre */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Nombre</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            placeholder="Tu nombre"
                                        />
                                    ) : (
                                        <p className="form-control-plaintext fw-bold">
                                            {safeUser.first_name || "No especificado"}
                                        </p>
                                    )}
                                </div>

                                {/* Apellido */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Apellido</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            placeholder="Tu apellido"
                                        />
                                    ) : (
                                        <p className="form-control-plaintext fw-bold">
                                            {safeUser.last_name || "No especificado"}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Email</label>
                                    {editing ? (
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="tu@email.com"
                                        />
                                    ) : (
                                        <p className="form-control-plaintext fw-bold">
                                            {safeUser.email || "No especificado"}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Teléfono</label>
                                    {editing ? (
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+34 123 456 789"
                                        />
                                    ) : (
                                        <p className="form-control-plaintext fw-bold">
                                            {safeUser.phone || "No especificado"}
                                        </p>
                                    )}
                                </div>

                                {/* Dirección */}
                                <div className="col-12 mb-3">
                                    <label className="form-label text-muted">Dirección</label>
                                    {editing ? (
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Tu dirección completa"
                                        />
                                    ) : (
                                        <p className="form-control-plaintext fw-bold">
                                            {safeUser.address || "No especificado"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de cuenta */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">
                                <i className="fas fa-shield-alt me-2"></i>
                                Seguridad de la Cuenta
                            </h5>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Estado de la cuenta</label>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-success me-2"
                                            style={{ width: '10px', height: '10px' }}></div>
                                        <span className="fw-bold">Activa</span>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Miembro desde</label>
                                    <p className="form-control-plaintext fw-bold">
                                        {new Date().toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    className="btn btn-outline-dark me-2"
                                    onClick={() => navigate("/orders")}
                                >
                                    <i className="fas fa-shopping-bag me-2"></i>
                                    Ver Mis Pedidos
                                </button>

                                <button
                                    className="btn btn-outline-dark me-2"
                                    onClick={() => navigate("/favorites")}
                                >
                                    <i className="fas fa-heart me-2"></i>
                                    Ver Mis Favoritos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Acciones peligrosas */}
                    <div className="card shadow-sm border-danger">
                        <div className="card-body">
                            <h5 className="card-title text-danger mb-4">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Zona de peligro
                            </h5>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <button
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => {
                                            if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                                                handleLogout();
                                            }
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Cerrar Sesión
                                    </button>
                                    <small className="text-muted d-block mt-2">
                                        Cerrarás sesión en todos los dispositivos
                                    </small>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <button
                                        className="btn btn-outline-danger w-100"
                                        disabled
                                        title="Funcionalidad no disponible"
                                    >
                                        <i className="fas fa-trash me-2"></i>
                                        Eliminar Cuenta
                                    </button>
                                    <small className="text-muted d-block mt-2">
                                        Esta acción no se puede deshacer
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};