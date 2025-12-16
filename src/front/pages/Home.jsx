import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div className="home-page">
			{/* Hero Section */}
			<section className="hero-section py-5" style={{
				background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
			}}>
				<div className="container py-5">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<h1 className="display-4 fw-bold mb-4" style={{ color: '#1a1a1a' }}>
								Relojes de Lujo que Definen el Tiempo
							</h1>
							<p className="lead mb-4">
								Descubre nuestra exclusiva colección de relojes de las marcas más prestigiosas.
								Piezas únicas que combinan artesanía tradicional con innovación contemporánea.
							</p>
							<div className="d-flex flex-wrap gap-3">
								<Link to="/catalog" className="btn btn-dark btn-lg px-4 py-3">
									Explorar Colección
								</Link>
								<Link to="/register" className="btn btn-outline-dark btn-lg px-4 py-3">
									Crear Cuenta
								</Link>
							</div>
						</div>
						<div className="col-lg-6">
							<img
								src="https://i.pinimg.com/736x/16/f9/51/16f9512e801dcfab5c974e65d683bc48.jpg"
								alt="Reloj de lujo"
								className="img-fluid rounded shadow-lg"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Marcas Destacadas */}
			<section className="py-5">
				<div className="container">
					<h2 className="text-center mb-5" style={{ color: '#1a1a1a' }}>Marcas Prestigiosas</h2>
					<div className="row text-center">
						{['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Tag Heuer', 'Breitling'].map((brand, index) => (
							<div key={index} className="col-md-4 col-lg-2 mb-4">
								<div className="brand-card p-4 rounded shadow-sm">
									<h5 className="mb-0">{brand}</h5>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Características */}
			<section className="py-5 bg-light">
				<div className="container">
					<div className="row">
						<div className="col-lg-4 mb-4">
							<div className="text-center p-4">
								<div className="icon-circle mb-3 mx-auto" style={{
									width: '80px',
									height: '80px',
									backgroundColor: '#1a1a1a',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<i className="fas fa-certificate fa-2x text-white"></i>
								</div>
								<h5 className="mb-3">Autenticidad Garantizada</h5>
								<p className="text-muted">
									Todos nuestros relojes incluyen certificado de autenticidad y garantía internacional.
								</p>
							</div>
						</div>
						<div className="col-lg-4 mb-4">
							<div className="text-center p-4">
								<div className="icon-circle mb-3 mx-auto" style={{
									width: '80px',
									height: '80px',
									backgroundColor: '#1a1a1a',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<i className="fas fa-shipping-fast fa-2x text-white"></i>
								</div>
								<h5 className="mb-3">Envío Seguro</h5>
								<p className="text-muted">
									Envío gratuito y asegurado a todo el mundo. Rastreo en tiempo real.
								</p>
							</div>
						</div>
						<div className="col-lg-4 mb-4">
							<div className="text-center p-4">
								<div className="icon-circle mb-3 mx-auto" style={{
									width: '80px',
									height: '80px',
									backgroundColor: '#1a1a1a',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<i className="fas fa-headset fa-2x text-white"></i>
								</div>
								<h5 className="mb-3">Soporte Premium</h5>
								<p className="text-muted">
									Asesoramiento personalizado y servicio postventa exclusivo disponible 24/7.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-5" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
				<div className="container text-center py-5">
					<h2 className="mb-4">¿Listo para Adquirir tu Reloj de Lujo?</h2>
					<p className="lead mb-4">
						Únete a miles de clientes satisfechos que han confiado en nosotros.
					</p>
					<Link to="/catalog" className="btn btn-light btn-lg px-5 py-3">
						Comprar Ahora
					</Link>
				</div>
			</section>
		</div>
	);
};