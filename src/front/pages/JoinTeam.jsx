import React, { useState } from "react";
import { Link } from "react-router-dom";

export const JoinTeam = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validación simple
        if (!formData.name || !formData.email || !formData.experience) {
            setError("Por favor, completa todos los campos obligatorios.");
            setLoading(false);
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Por favor, introduce un email válido.");
            setLoading(false);
            return;
        }

        try {
            // Simular envío de formulario
            await new Promise(resolve => setTimeout(resolve, 2000));

            // En una aplicación real, aquí harías la llamada a tu API
            // await fetch('/api/join-team', { method: 'POST', body: JSON.stringify(formData) });

            setSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                experience: "",
                message: ""
            });
        } catch (err) {
            setError("Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center py-5">
                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                style={{ width: '80px', height: '80px' }}>
                                <i className="fas fa-check fa-2x"></i>
                            </div>
                            <h1 className="display-4 mb-3 text-success">¡Solicitud Enviada!</h1>
                            <p className="lead mb-4">
                                Gracias por tu interés en unirte a nuestro equipo.
                                Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.
                            </p>
                            <Link to="/" className="btn btn-dark btn-lg">
                                <i className="fas fa-home me-2"></i>
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="row mb-5">
                <div className="col-12 text-center">
                    <h1 className="display-4 fw-bold mb-3" style={{ color: '#1a1a1a' }}>
                        Únete a Nuestro Equipo
                    </h1>
                    <p className="lead text-muted mb-0">
                        ¿Eres apasionado por la relojería de lujo? Únete a la familia LuxuryWatches
                    </p>
                </div>
            </div>

            <div className="row g-5">
                {/* Formulario */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-5">
                            <h3 className="mb-4">Envía tu Solicitud</h3>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre completo"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label fw-bold">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+34 123 456 789"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="experience" className="form-label fw-bold">Experiencia en Relojería *</label>
                                    <select
                                        className="form-select"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona tu nivel de experiencia</option>
                                        <option value="novato">Novato (0-1 años)</option>
                                        <option value="intermedio">Intermedio (2-5 años)</option>
                                        <option value="experto">Experto (6+ años)</option>
                                        <option value="profesional">Profesional (Relojero certificado)</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label fw-bold">Mensaje</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Cuéntanos por qué quieres unirte a nuestro equipo..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark btn-lg w-100 py-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Enviar Solicitud
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Información */}
                <div className="col-lg-6">
                    <div className="mb-5">
                        <h3 className="mb-4">¿Por qué Unirte a LuxuryWatches?</h3>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center">
                                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-gem fa-lg"></i>
                                        </div>
                                        <h5 className="card-title">Exclusividad</h5>
                                        <p className="card-text small text-muted">
                                            Trabaja con las marcas de relojería más exclusivas del mundo
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center">
                                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-chart-line fa-lg"></i>
                                        </div>
                                        <h5 className="card-title">Crecimiento</h5>
                                        <p className="card-text small text-muted">
                                            Oportunidades de desarrollo profesional en un mercado en constante crecimiento
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center">
                                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-users fa-lg"></i>
                                        </div>
                                        <h5 className="card-title">Equipo</h5>
                                        <p className="card-text small text-muted">
                                            Forma parte de un equipo apasionado y experto en relojería de lujo
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center">
                                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-graduation-cap fa-lg"></i>
                                        </div>
                                        <h5 className="card-title">Formación</h5>
                                        <p className="card-text small text-muted">
                                            Acceso a formación continua y certificaciones oficiales
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <h4 className="mb-3">¿Qué Buscamos?</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Apasionado por la relojería y la excelencia
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Experiencia previa en ventas o atención al cliente (deseable)
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Conocimientos técnicos en relojería (deseable)
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Excelente comunicación y habilidades interpersonales
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Compromiso con la calidad y el servicio al cliente
                            </li>
                        </ul>
                    </div>

                    <div className="bg-light p-4 rounded">
                        <h5 className="mb-3"><i className="fas fa-question-circle me-2 text-dark"></i>Preguntas Frecuentes</h5>
                        <div className="accordion" id="faqAccordion">
                            <div className="accordion-item border-0 bg-transparent">
                                <h6 className="accordion-header" id="faq1">
                                    <button className="accordion-button bg-transparent text-dark p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                                        ¿Qué tipo de trabajos ofreces?
                                    </button>
                                </h6>
                                <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body p-0 mt-2">
                                        Ofrecemos oportunidades en ventas, atención al cliente, relojería técnica y gestión de inventario.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item border-0 bg-transparent">
                                <h6 className="accordion-header" id="faq2">
                                    <button className="accordion-button bg-transparent text-dark p-0 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                                        ¿Necesito experiencia previa?
                                    </button>
                                </h6>
                                <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body p-0 mt-2">
                                        Valoramos la experiencia, pero también ofrecemos formación para candidatos apasionados y comprometidos.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item border-0 bg-transparent">
                                <h6 className="accordion-header" id="faq3">
                                    <button className="accordion-button bg-transparent text-dark p-0 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                                        ¿Cuál es el proceso de selección?
                                    </button>
                                </h6>
                                <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body p-0 mt-2">
                                        Revisamos tu solicitud, realizamos una entrevista inicial y una evaluación técnica si es necesario.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="row mt-5">
                <div className="col-12 text-center">
                    <div className="bg-dark text-white p-5 rounded">
                        <h3 className="mb-3">¿Listo para formar parte de nuestro equipo?</h3>
                        <p className="mb-4">
                            Únete a la familia LuxuryWatches y comparte tu pasión por la relojería de lujo
                        </p>
                        <Link to="/contact" className="btn btn-outline-light me-3">
                            <i className="fas fa-phone me-2"></i>
                            Contactar Directamente
                        </Link>
                        <Link to="/catalog" className="btn btn-warning">
                            <i className="fas fa-clock me-2"></i>
                            Explorar Colección
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};