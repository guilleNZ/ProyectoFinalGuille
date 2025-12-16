import React from "react";
import { Link } from "react-router-dom";

export const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="bg-dark text-white py-5 mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">
                                Sobre Luxury Watches
                            </h1>
                            <p className="lead mb-4">
                                Desde 2024, nos dedicamos a ofrecer las piezas más exclusivas
                                y codiciadas del mundo de la relojería de lujo.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-light text-dark">Autenticidad Garantizada</span>
                                <span className="badge bg-light text-dark">Expertos Certificados</span>
                                <span className="badge bg-light text-dark">Envío Mundial</span>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img
                                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80"
                                alt="Relojes de lujo"
                                className="img-fluid rounded shadow"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Nuestra Historia */}
                <div className="row mb-5">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                            Nuestra Historia
                        </h2>
                        <p className="lead text-center mb-4">
                            Fundada por apasionados coleccionistas, Luxury Watches nace de la necesidad
                            de crear un espacio donde los amantes de la relojería puedan encontrar piezas
                            auténticas, certificadas y con procedencia garantizada.
                        </p>
                    </div>
                </div>

                {/* Valores */}
                <div className="row mb-5">
                    <div className="col-md-4 mb-4">
                        <div className="text-center p-4 border rounded h-100">
                            <div className="icon-circle mb-3 mx-auto" style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#1a1a1a',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-award fa-2x text-white"></i>
                            </div>
                            <h4>Autenticidad</h4>
                            <p className="text-muted">
                                Cada reloj pasa por un riguroso proceso de verificación
                                realizado por expertos certificados.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center p-4 border rounded h-100">
                            <div className="icon-circle mb-3 mx-auto" style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#1a1a1a',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-shield-alt fa-2x text-white"></i>
                            </div>
                            <h4>Seguridad</h4>
                            <p className="text-muted">
                                Transacciones 100% seguras con encriptación SSL y
                                protección de datos garantizada.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="text-center p-4 border rounded h-100">
                            <div className="icon-circle mb-3 mx-auto" style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#1a1a1a',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-globe fa-2x text-white"></i>
                            </div>
                            <h4>Global</h4>
                            <p className="text-muted">
                                Envíos a todo el mundo con seguro incluido y
                                seguimiento en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Equipo */}
                <div className="mb-5">
                    <h2 className="text-center mb-5" style={{ color: '#1a1a1a' }}>
                        Nuestro Equipo de Expertos
                    </h2>
                    <div className="row">
                        {[
                            {
                                name: "Carlos Rodríguez",
                                role: "Especialista en Rolex",
                                experience: "15+ años",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                            },
                            {
                                name: "Ana Martínez",
                                role: "Especialista en Patek Philippe",
                                experience: "12+ años",
                                image: "https://imgs.search.brave.com/Ji7Pu6d8K31-B8Dr9VTPqKq8zsdvgn152QWcQ-k_dM0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aGVhZHNob3RwaG90/by5pby9fdmVyY2Vs/L2ltYWdlP3VybD0v/aW1hZ2VzL2Jsb2dz/L2xvdy1jaGlnbm9u/LWJ1bi5wbmcmdz0x/MDI0JnE9MTAw"
                            },
                            {
                                name: "David Chen",
                                role: "Especialista en Audemars Piguet",
                                experience: "10+ años",
                                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                            }
                        ].map((member, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img
                                        src={member.image}
                                        className="card-img-top"
                                        alt={member.name}
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{member.name}</h5>
                                        <p className="card-text text-muted">{member.role}</p>
                                        <p className="card-text">
                                            <small className="text-dark fw-bold">
                                                {member.experience} de experiencia
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proceso de Verificación */}
                <div className="bg-light p-5 rounded mb-5">
                    <h3 className="text-center mb-4" style={{ color: '#1a1a1a' }}>
                        Nuestro Proceso de Verificación
                    </h3>
                    <div className="row">
                        {[
                            { step: 1, title: "Inspección Física", desc: "Examen detallado de cada componente" },
                            { step: 2, title: "Verificación de Movimiento", desc: "Pruebas de precisión y funcionamiento" },
                            { step: 3, title: "Autenticación de Piezas", desc: "Confirmación de originalidad de todas las partes" },
                            { step: 4, title: "Certificación Final", desc: "Emisión de certificado de autenticidad" }
                        ].map((item, index) => (
                            <div key={index} className="col-md-3 mb-3">
                                <div className="text-center p-3">
                                    <div className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '60px', height: '60px' }}>
                                        <h4 className="mb-0">{item.step}</h4>
                                    </div>
                                    <h5>{item.title}</h5>
                                    <p className="text-muted small">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center py-5">
                    <h2 className="mb-4" style={{ color: '#1a1a1a' }}>
                        ¿Listo para encontrar tu reloj de lujo?
                    </h2>
                    <p className="lead mb-4">
                        Nuestros expertos están disponibles para asesorarte personalmente.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <Link to="/catalog" className="btn btn-dark btn-lg">
                            <i className="fas fa-search me-2"></i>
                            Explorar Catálogo
                        </Link>
                        <Link to="/contact" className="btn btn-outline-dark btn-lg">
                            <i className="fas fa-headset me-2"></i>
                            Contactar Expertos
                        </Link>
                    </div>
                </div>

                {/* Información de contacto */}
                <div className="border-top pt-5 mt-5">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="text-center">
                                <i className="fas fa-map-marker-alt fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Ubicación</h5>
                                <p className="text-muted">
                                    Calle Serrano 123<br />
                                    Madrid, España
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="text-center">
                                <i className="fas fa-phone fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Teléfono</h5>
                                <p className="text-muted">
                                    +34 910 123 456<br />
                                    Lunes a Viernes 9:00-19:00
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="text-center">
                                <i className="fas fa-envelope fa-2x mb-3" style={{ color: '#1a1a1a' }}></i>
                                <h5>Email</h5>
                                <p className="text-muted">
                                    info@luxurywatches.com<br />
                                    Respuesta en 24h
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};