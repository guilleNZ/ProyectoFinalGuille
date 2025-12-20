import React from "react";
import { Link } from "react-router-dom";

export const Investment = () => {
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="row mb-5">
                <div className="col-12 text-center">
                    <h1 className="display-4 fw-bold mb-4" style={{ color: '#1a1a1a' }}>
                        Relojes de Lujo como Activos Financieros
                    </h1>
                    <p className="lead text-muted mb-0">
                        Más que un accesorio - Inversión con valor duradero
                    </p>
                </div>
            </div>

            {/* Introduction */}
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                    <div className="text-center mb-5">
                        <p className="lead">
                            En un mundo donde los mercados financieros son volátiles y las inversiones tradicionales enfrentan incertidumbre,
                            los relojes de lujo han emergido como una alternativa de inversión sólida y tangible.
                            Estos objetos de arte mecánico no solo representan elegancia y precisión, sino también una reserva de valor
                            que puede mantenerse o incluso apreciarse con el tiempo.
                        </p>
                    </div>

                    <div className="bg-light p-4 rounded">
                        <h3 className="text-center mb-4">¿Por qué invertir en relojes de lujo?</h3>
                        <p className="mb-0">
                            A diferencia de otros activos financieros, los relojes de lujo ofrecen la ventaja única de ser un activo tangible
                            que puedes disfrutar mientras se mantiene o incrementa su valor. Muchos modelos han demostrado ser más estables
                            que acciones o divisas, manteniendo su valor incluso en tiempos de crisis económica.
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Benefits */}
            <div className="row mb-5">
                <div className="col-12">
                    <h2 className="text-center mb-5">Características de un Activo Financiero</h2>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-gem fa-2x"></i>
                                    </div>
                                    <h5 className="card-title">Escasez y Exclusividad</h5>
                                    <p className="card-text small text-muted">
                                        Producción limitada por diseño que aumenta su valor con el tiempo
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-chart-line fa-2x"></i>
                                    </div>
                                    <h5 className="card-title">Apreciación Histórica</h5>
                                    <p className="card-text small text-muted">
                                        Muchos modelos han mostrado una tendencia de valorización constante
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-shield-alt fa-2x"></i>
                                    </div>
                                    <h5 className="card-title">Hedge contra Inflación</h5>
                                    <p className="card-text small text-muted">
                                        Protección contra la devaluación monetaria y la inflación
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-tint fa-2x"></i>
                                    </div>
                                    <h5 className="card-title">Tangibilidad</h5>
                                    <p className="card-text small text-muted">
                                        Activo físico que puedes poseer, disfrutar y exhibir
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Investment Brands */}
            <div className="row mb-5">
                <div className="col-12">
                    <h2 className="text-center mb-5">Marcas con Mayor Potencial de Inversión</h2>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-dark text-white text-center">
                                    <h5 className="mb-0">Rolex</h5>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">Modelos destacados:</h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Daytona</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Submariner</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> GMT-Master II</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Explorer</li>
                                    </ul>
                                    <p className="card-text small text-muted">
                                        Conocidos por su calidad, durabilidad y apreciación histórica constante.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-dark text-white text-center">
                                    <h5 className="mb-0">Patek Philippe</h5>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">Modelos destacados:</h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Nautilus</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Aquanaut</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Grand Complications</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Calatrava</li>
                                    </ul>
                                    <p className="card-text small text-muted">
                                        Representan la cima de la relojería suiza y suelen mantener o aumentar su valor.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-dark text-white text-center">
                                    <h5 className="mb-0">Audemars Piguet</h5>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">Modelos destacados:</h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Royal Oak</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Royal Oak Offshore</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Code 11.59</li>
                                        <li className="mb-2"><i className="fas fa-chevron-right text-dark me-2"></i> Millenary</li>
                                    </ul>
                                    <p className="card-text small text-muted">
                                        Conocidos por su diseño innovador y complejidad mecánica, muy buscados por coleccionistas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Tips */}
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-4">Consejos para Invertir en Relojes de Lujo</h3>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <h5><i className="fas fa-check-circle text-success me-2"></i>Investiga antes de comprar</h5>
                                    <p className="text-muted small">
                                        Conoce la historia del modelo, su producción y tendencia de valorización.
                                        Consulta índices de precios especializados como el Horological Price Index.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5><i className="fas fa-check-circle text-success me-2"></i>Estado es crucial</h5>
                                    <p className="text-muted small">
                                        El estado del reloj, caja, pulsera y documentos originales afectan significativamente su valor.
                                        Un reloj en excelente condición puede valer hasta un 50% más que uno usado.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5><i className="fas fa-check-circle text-success me-2"></i>Compra auténtico</h5>
                                    <p className="text-muted small">
                                        Asegúrate de comprar de fuentes confiables. La autenticidad es vital para la inversión.
                                        Verifica la garantía y certificación oficial.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5><i className="fas fa-check-circle text-success me-2"></i>Considera la liquidez</h5>
                                    <p className="text-muted small">
                                        Aunque los relojes pueden apreciarse, no son tan líquidos como acciones.
                                        Considera tu horizonte de inversión y necesidad de liquidez.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Performance */}
            <div className="row mb-5">
                <div className="col-12">
                    <h2 className="text-center mb-5">Rendimiento Histórico de Inversión</h2>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h4 className="card-title">Rolex Daytona "Paul Newman"</h4>
                                    <p className="card-text">
                                        <strong>Ejemplo real:</strong> Un Rolex Daytona "Paul Newman" Reference 6263
                                        que se vendió por $178,500 en 1999, se vendió por $17.8 millones en 2017,
                                        representando un crecimiento del 9,900% en 18 años.
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <div className="bg-light p-3 rounded">
                                            <h5 className="text-success mb-0">+9,900%</h5>
                                            <small className="text-muted">en 18 años</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h4 className="card-title">Patek Philippe Grandmaster Chime</h4>
                                    <p className="card-text">
                                        <strong>Ejemplo real:</strong> La pieza única Patek Philippe Grandmaster Chime
                                        Reference 6300A-010 se vendió por $31.2 millones en 2019, estableciendo
                                        un récord como el reloj de pulsera más caro jamás vendido en subasta.
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <div className="bg-light p-3 rounded">
                                            <h5 className="text-success mb-0">$31.2M</h5>
                                            <small className="text-muted">récord de subasta</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Guarantee */}
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                    <div className="bg-dark text-white p-5 rounded">
                        <h3 className="text-center mb-4">Nuestra Garantía de Inversión</h3>
                        <div className="row">
                            <div className="col-md-4 text-center mb-4">
                                <i className="fas fa-certificate fa-3x mb-3"></i>
                                <h5>Autenticidad Garantizada</h5>
                                <p className="small">
                                    Cada reloj es verificado por expertos certificados para garantizar su autenticidad.
                                </p>
                            </div>
                            <div className="col-md-4 text-center mb-4">
                                <i className="fas fa-file-contract fa-3x mb-3"></i>
                                <h5>Documentación Completa</h5>
                                <p className="small">
                                    Todos los relojes incluyen garantía original, caja y documentos necesarios para su valorización.
                                </p>
                            </div>
                            <div className="col-md-4 text-center mb-4">
                                <i className="fas fa-chart-line fa-3x mb-3"></i>
                                <h5>Seguimiento de Valor</h5>
                                <p className="small">
                                    Acceso a nuestro servicio de seguimiento de valorización para inversores.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="row">
                <div className="col-12 text-center">
                    <h3 className="mb-4">¿Listo para comenzar tu inversión en relojes de lujo?</h3>
                    <p className="lead mb-4">
                        Explora nuestra selección cuidadosamente curada de relojes con potencial de inversión
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/catalog" className="btn btn-dark btn-lg">
                            <i className="fas fa-th-large me-2"></i>
                            Explorar Catálogo
                        </Link>
                        <Link to="/contact" className="btn btn-outline-dark btn-lg">
                            <i className="fas fa-headset me-2"></i>
                            Asesoría Personalizada
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};