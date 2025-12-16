import React, { useState } from "react";

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simular envío
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        }, 1500);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                        <i className="fas fa-headset me-2"></i>
                        Contacta con Nuestros Expertos
                    </h1>
                    <p className="text-center text-muted mb-5">
                        Nuestro equipo de especialistas está listo para asesorarte en la
                        elección de tu reloj de lujo perfecto.
                    </p>

                    {submitted && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="fas fa-check-circle me-2"></i>
                            Mensaje enviado correctamente. Te contactaremos en 24 horas.
                            <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
                        </div>
                    )}

                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre completo *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Asunto *</label>
                                        <select
                                            className="form-select"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar asunto</option>
                                            <option value="consulta">Consulta general</option>
                                            <option value="autenticacion">Autenticación de reloj</option>
                                            <option value="compra">Proceso de compra</option>
                                            <option value="garantia">Garantía y servicio</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Mensaje *</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe tu consulta o interés específico..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 py-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Enviar Mensaje
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="row mt-5">
                        <div className="col-md-4 mb-4">
                            <div className="text-center p-4 border rounded h-100">
                                <i className="fas fa-clock fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Horario de Atención</h5>
                                <p className="text-muted mb-0">
                                    Lunes a Viernes: 9:00 - 19:00<br />
                                    Sábados: 10:00 - 14:00<br />
                                    Domingos: Cerrado
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="text-center p-4 border rounded h-100">
                                <i className="fas fa-phone fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Teléfonos</h5>
                                <p className="text-muted mb-0">
                                    <strong>Ventas:</strong> +34 910 123 456<br />
                                    <strong>Soporte:</strong> +34 910 123 457<br />
                                    <strong>WhatsApp:</strong> +34 612 345 678
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="text-center p-4 border rounded h-100">
                                <i className="fas fa-envelope fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Emails</h5>
                                <p className="text-muted mb-0">
                                    <strong>General:</strong> info@luxurywatches.com<br />
                                    <strong>Ventas:</strong> ventas@luxurywatches.com<br />
                                    <strong>Soporte:</strong> soporte@luxurywatches.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};