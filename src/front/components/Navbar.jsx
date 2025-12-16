import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [favoritesCount, setFavoritesCount] = useState(0);
	const [cartCount, setCartCount] = useState(0);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	useEffect(() => {
		checkAuthStatus();
		updateCartCount();
		updateFavoritesCount();

		// Escuchar cambios en localStorage
		const handleStorageChange = () => {
			checkAuthStatus();
			updateCartCount();
			updateFavoritesCount();
		};

		window.addEventListener('storage', handleStorageChange);

		// Actualizar cada 10 segundos (para cambios en otras pestañas)
		const interval = setInterval(() => {
			checkAuthStatus();
			updateCartCount();
			updateFavoritesCount();
		}, 10000);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			clearInterval(interval);
		};
	}, []);

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

	const updateCartCount = async () => {
		const token = localStorage.getItem("token");

		if (token) {
			try {
				// Intentar obtener carrito del backend
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				});

				if (response.ok) {
					const cart = await response.json();
					setCartCount(cart.items?.length || 0);
					return;
				}
			} catch (error) {
				// Fallback a localStorage
				console.log("Using localStorage for cart");
			}
		}

		// Usar localStorage como fallback
		const localCart = JSON.parse(localStorage.getItem('localCart')) || [];
		setCartCount(localCart.length);
	};

	const updateFavoritesCount = async () => {
		const token = localStorage.getItem("token");

		if (token) {
			try {
				// Intentar obtener favoritos del backend
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				});

				if (response.ok) {
					const favorites = await response.json();
					setFavoritesCount(favorites.length || 0);
					return;
				}
			} catch (error) {
				// Fallback a localStorage
				console.log("Using localStorage for favorites");
			}
		}

		// Usar localStorage como fallback
		const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
		setFavoritesCount(favorites.length);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUserEmail("");
		setCartCount(0);
		setFavoritesCount(0);
		navigate("/");

		// Mostrar notificación
		showNotification("✅ Sesión cerrada exitosamente", "success");
	};

	const showNotification = (message, type) => {
		const notification = document.createElement('div');
		notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
		notification.style.cssText = `
            top: 70px;
            right: 20px;
            z-index: 1050;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

		notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

		document.body.appendChild(notification);

		// Auto-remove after 3 seconds
		setTimeout(() => {
			if (notification.parentNode) {
				notification.remove();
			}
		}, 3000);
	};

	return (
		<>
			{/* Navbar Principal */}
			<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
				<div className="container">
					{/* Logo y marca */}
					<Link to="/" className="navbar-brand d-flex align-items-center">
						<div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-2"
							style={{ width: '40px', height: '40px' }}>
							<i className="fas fa-clock"></i>
						</div>
						<span className="fw-bold fs-4" style={{ color: '#1a1a1a' }}>
							LUXURY<span className="text-warning">WATCHES</span>
						</span>
					</Link>

					{/* Botón menú móvil */}
					<button
						className="navbar-toggler border-0"
						type="button"
						onClick={() => setShowMobileMenu(!showMobileMenu)}
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					{/* Contenido del navbar */}
					<div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="navbarNav">
						{/* Navegación principal */}
						<ul className="navbar-nav me-auto">
							<li className="nav-item">
								<Link to="/catalog" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-th-large me-1"></i>
									Catálogo
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/contact" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-envelope me-1"></i>
									Contacto
								</Link>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
									<i className="fas fa-crown me-1"></i>
									Marcas
								</a>
								<ul className="dropdown-menu">
									<li><Link to="/catalog?brand=Rolex" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>Rolex</Link></li>
									<li><Link to="/catalog?brand=Omega" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>Omega</Link></li>
									<li><Link to="/catalog?brand=Patek Philippe" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>Patek Philippe</Link></li>
									<li><Link to="/catalog?brand=Audemars Piguet" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>Audemars Piguet</Link></li>
									<li><hr className="dropdown-divider" /></li>
									<li><Link to="/catalog" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>Ver todas</Link></li>
								</ul>
							</li>
							<li className="nav-item">
								<Link to="/about" className="nav-link" onClick={() => setShowMobileMenu(false)}>
									<i className="fas fa-info-circle me-1"></i>
									Sobre Nosotros
								</Link>
							</li>
						</ul>

						{/* Iconos de acción */}
						<div className="d-flex align-items-center">
							{/* Buscador */}
							<div className="input-group d-none d-lg-flex me-3" style={{ width: '300px' }}>
								<input
									type="text"
									className="form-control form-control-sm"
									placeholder="Buscar relojes..."
								/>
								<button className="btn btn-dark btn-sm">
									<i className="fas fa-search"></i>
								</button>
							</div>

							{/* Iconos */}
							<div className="d-flex gap-3">
								{/* Favoritos */}
								<Link to="/favorites" className="nav-link position-relative" title="Favoritos">
									<i className="fas fa-heart fa-lg"></i>
									{favoritesCount > 0 && (
										<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
											{favoritesCount > 99 ? '99+' : favoritesCount}
										</span>
									)}
								</Link>

								{/* Carrito */}
								<Link to="/cart" className="nav-link position-relative" title="Carrito">
									<i className="fas fa-shopping-cart fa-lg"></i>
									{cartCount > 0 && (
										<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
											{cartCount > 99 ? '99+' : cartCount}
										</span>
									)}
								</Link>

								{/* Usuario */}
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
											<li>
												<Link to="/profile" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
													<i className="fas fa-user me-2"></i>
													Mi Perfil
												</Link>
											</li>
											<li>
												<Link to="/orders" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
													<i className="fas fa-shopping-bag me-2"></i>
													Mis Pedidos
												</Link>
											</li>
											<li>
												<Link to="/favorites" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>
													<i className="fas fa-heart me-2"></i>
													Mis Favoritos
													{favoritesCount > 0 && (
														<span className="badge bg-danger float-end">{favoritesCount}</span>
													)}
												</Link>
											</li>
											<li><hr className="dropdown-divider" /></li>
											<li>
												<button className="dropdown-item text-danger" onClick={handleLogout}>
													<i className="fas fa-sign-out-alt me-2"></i>
													Cerrar Sesión
												</button>
											</li>
										</ul>
									</div>
								) : (
									<div className="d-flex gap-2">
										<Link to="/login" className="btn btn-outline-dark btn-sm">
											<i className="fas fa-sign-in-alt me-1"></i>
											Ingresar
										</Link>
										<Link to="/register" className="btn btn-dark btn-sm">
											<i className="fas fa-user-plus me-1"></i>
											Registrarse
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Buscador móvil */}
			{showMobileMenu && (
				<div className="container-fluid bg-light py-2 border-top d-lg-none">
					<div className="container">
						<div className="input-group">
							<input
								type="text"
								className="form-control"
								placeholder="Buscar relojes..."
							/>
							<button className="btn btn-dark">
								<i className="fas fa-search"></i>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Breadcrumb navigation (opcional) */}
			<div className="container-fluid bg-light border-bottom py-2 d-none d-md-block">
				<div className="container">
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb mb-0">
							<li className="breadcrumb-item">
								<Link to="/" className="text-decoration-none text-muted">
									<i className="fas fa-home me-1"></i>
									Inicio
								</Link>
							</li>
							<li className="breadcrumb-item">
								<Link to="/catalog" className="text-decoration-none text-muted">
									Catálogo
								</Link>
							</li>
							<li className="breadcrumb-item active text-dark">
								{window.location.pathname === '/cart' && 'Carrito'}
								{window.location.pathname === '/favorites' && 'Favoritos'}
								{window.location.pathname === '/profile' && 'Mi Perfil'}
								{window.location.pathname.startsWith('/product/') && 'Detalles del Producto'}
							</li>
						</ol>
					</nav>
				</div>
			</div>

			{/* Notificación flotante container */}
			<div id="notification-container" style={{
				position: 'fixed',
				top: '80px',
				right: '20px',
				zIndex: 1055
			}}></div>
		</>
	);
};