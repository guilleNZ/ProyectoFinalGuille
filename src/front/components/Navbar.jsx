import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [favoritesCount, setFavoritesCount] = useState(0);
	const [cartCount, setCartCount] = useState(0);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	
	const showNotification = (message, type) => {
		const notification = document.createElement('div');
		notification.className = `alert alert-${type} position-fixed`;
		notification.style.cssText = `
            top: 60px;
            right: 20px;
            z-index: 1055;
            min-width: 250px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s;
            padding: 12px 20px;
        `;
		notification.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>${message}</span>
                <button type="button" class="btn-close ms-3" style="font-size:14px;"></button>
            </div>
        `;

		document.body.appendChild(notification);

		const closeBtn = notification.querySelector('.btn-close');
		closeBtn.onclick = () => closeNotification(notification);

		setTimeout(() => closeNotification(notification), 3000);
	};

	const closeNotification = (el) => {
		el.style.opacity = '0';
		setTimeout(() => el.remove(), 300);
	};

	const checkAuthStatus = () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (token) {
			setIsLoggedIn(true);
			if (user) {
				try {
					const userData = JSON.parse(user);
					setUserEmail(userData.email || "Usuario");
				} catch (e) {
					setUserEmail("Usuario");
				}
			}
		} else {
			setIsLoggedIn(false);
			setUserEmail("");
		}
	};

	const updateCartCount = () => {
		const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
		const count = localCart.reduce((sum, item) => sum + (item.quantity || 1), 0); 
		setCartCount(count);
	};

	const updateFavoritesCount = () => {
		const favs = JSON.parse(localStorage.getItem('favorites')) || [];
		setFavoritesCount(favs.length);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUserEmail("");
		setCartCount(0);
		setFavoritesCount(0);
		navigate("/");
		showNotification("✅ Sesión cerrada exitosamente", "success");
	};

	
	useEffect(() => {
		const syncCounts = () => {
			checkAuthStatus();
			updateCartCount();
			updateFavoritesCount();
		};

		syncCounts();

		
		const handleCartUpdated = () => syncCounts();
		const handleFavoritesUpdated = () => syncCounts();
		
		const handleStorage = () => syncCounts();

		window.addEventListener('cartUpdated', handleCartUpdated);
		window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
		window.addEventListener('storage', handleStorage);

		
		return () => {
			window.removeEventListener('cartUpdated', handleCartUpdated);
			window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
			window.removeEventListener('storage', handleStorage);
		};
	}, []);

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
				<div className="container">
					<Link to="/" className="navbar-brand d-flex align-items-center">
						<div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-2"
							style={{ width: '40px', height: '40px' }}>
							<i className="fas fa-clock"></i>
						</div>
						<span className="fw-bold fs-4" style={{ color: '#1a1a1a' }}>
							LUXURY<span className="text-warning">WATCHES</span>
						</span>
					</Link>

					<button
						className="navbar-toggler border-0"
						type="button"
						onClick={() => setShowMobileMenu(!showMobileMenu)}
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
						<ul className="navbar-nav me-auto">
							<li className="nav-item">
								<Link to="/catalog" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-th-large me-1"></i> Catálogo
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/investment" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-chart-line me-1"></i> Inversión
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/contact" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-envelope me-1"></i> Contacto
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/about" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-info-circle me-1"></i> Sobre Nosotros
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/join-team" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-handshake me-1"></i> Únete a nuestro equipo
								</Link>
							</li>
						</ul>

						<div className="d-flex align-items-center">
							<div className="d-flex gap-3">
								<Link to="/favorites" className="nav-link position-relative" title="Favoritos">
									<i className="fas fa-heart fa-lg"></i>
									{favoritesCount > 0 && (
										<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
											{favoritesCount > 99 ? '99+' : favoritesCount}
										</span>
									)}
								</Link>

								<Link to="/cart" className="nav-link position-relative" title="Carrito">
									<i className="fas fa-shopping-cart fa-lg"></i>
									{cartCount > 0 && (
										<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
											{cartCount > 99 ? '99+' : cartCount}
										</span>
									)}
								</Link>

								{isLoggedIn ? (
									<div className="nav-item dropdown">
										<a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
											<div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-2"
												style={{ width: '32px', height: '32px' }}>
												<i className="fas fa-user"></i>
											</div>
											<span className="d-none d-lg-inline">{userEmail.split('@')[0]}</span>
										</a>
										<ul className="dropdown-menu dropdown-menu-end">
											<li><Link to="/profile" className="dropdown-item" onClick={() => setShowMobileMenu(false)}><i className="fas fa-user me-2"></i>Mi Perfil</Link></li>
											<li><Link to="/orders" className="dropdown-item" onClick={() => setShowMobileMenu(false)}><i className="fas fa-shopping-bag me-2"></i>Mis Pedidos</Link></li>
											<li><Link to="/favorites" className="dropdown-item" onClick={() => setShowMobileMenu(false)}><i className="fas fa-heart me-2"></i>Mis Favoritos {favoritesCount > 0 && <span className="badge bg-danger float-end">{favoritesCount}</span>}</Link></li>
											<li><hr className="dropdown-divider" /></li>
											<li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</button></li>
										</ul>
									</div>
								) : (
									<div className="d-flex gap-2">
										<Link to="/login" className="btn btn-outline-dark btn-sm"><i className="fas fa-sign-in-alt me-1"></i>Ingresar</Link>
										<Link to="/register" className="btn btn-dark btn-sm"><i className="fas fa-user-plus me-2"></i>Registrarse</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>

			{showMobileMenu && (
				<div className="container-fluid bg-light py-2 border-top d-lg-none">
					<div className="container">
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Buscar relojes..." />
							<button className="btn btn-dark"><i className="fas fa-search"></i></button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};