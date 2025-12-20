import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [loadingFavorite, setLoadingFavorite] = useState(false);

    // Verificar si el producto está en favoritos al cargar
    useEffect(() => {
        checkIfFavorite();
    }, [product.id]);

    const checkIfFavorite = () => {
        // Usar SOLO localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            // Si no hay token, no verificar favoritos
            setIsFavorite(false);
            setFavoriteId(null);
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFav = favorites.includes(product.id);
        setIsFavorite(isFav);

        if (isFav) {
            setFavoriteId(product.id); // Usar el ID del producto como ID de favorito
        } else {
            setFavoriteId(null);
        }
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para usar favoritos");
            return;
        }

        setLoadingFavorite(true);

        // Obtener favoritos actuales
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        let newIsFavorite;
        let updatedFavorites;

        if (isFavorite) {
            // Eliminar de favoritos
            updatedFavorites = favorites.filter(favId => favId !== product.id);
            newIsFavorite = false;

            // Mostrar notificación
            showNotification("❌ Producto eliminado de favoritos", "danger");
        } else {
            // Agregar a favoritos
            updatedFavorites = [...favorites, product.id];
            newIsFavorite = true;

            // Mostrar notificación
            showNotification("❤️ Producto agregado a favoritos", "success");
        }

        // Guardar en localStorage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Actualizar estado
        setIsFavorite(newIsFavorite);
        setFavoriteId(newIsFavorite ? product.id : null);

        // Disparar evento para actualizar Navbar u otros componentes
        window.dispatchEvent(new Event('favoritesUpdated'));

        setLoadingFavorite(false);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para agregar productos al carrito");
            return;
        }

        // Obtener carrito actual
        let cart = JSON.parse(localStorage.getItem('localCart')) || [];

        // Buscar si el producto ya existe en el carrito
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            // Verificar si la cantidad total excede el stock
            const totalQuantity = cart[existingItemIndex].quantity + 1;
            if (totalQuantity > product.stock) {
                alert(`No hay suficiente stock disponible. Stock actual: ${product.stock}. Ya tienes ${cart[existingItemIndex].quantity} en el carrito.`);
                return;
            }
            // Actualizar cantidad existente
            cart[existingItemIndex].quantity = totalQuantity;
        } else {
            // Agregar nuevo producto al carrito con cantidad 1
            cart.push({
                ...product,
                quantity: 1
            });
        }

        // Guardar carrito actualizado
        localStorage.setItem('localCart', JSON.stringify(cart));

        // Mostrar notificación
        showNotification(`✅ ${product.name} agregado al carrito`, "success");

        // Disparar evento para actualizar navbar u otros componentes
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
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
        <div className="card h-100 product-card shadow-sm border-0">
            <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <img
                        src={product.image_url}
                        className="card-img-top h-100 object-fit-cover"
                        alt={product.name}
                        style={{ transition: 'transform 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>

                {/* Badges */}
                <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-dark">{product.brand}</span>
                </div>

                {/* Botón favorito */}
                <button
                    className="btn position-absolute top-0 end-0 m-2 p-2"
                    onClick={handleToggleFavorite}
                    disabled={loadingFavorite}
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px'
                    }}
                    title={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
                >
                    {loadingFavorite ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : isFavorite ? (
                        <i className="fas fa-heart text-danger"></i>
                    ) : (
                        <i className="far fa-heart text-dark"></i>
                    )}
                </button>

                {/* Stock badge */}
                <div className="position-absolute bottom-0 end-0 m-2">
                    {product.stock <= 3 && product.stock > 0 ? (
                        <span className="badge bg-warning">
                            ¡Últimas {product.stock}!
                        </span>
                    ) : product.stock === 0 ? (
                        <span className="badge bg-danger">
                            Agotado
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="card-body d-flex flex-column p-4">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <h5 className="card-title mb-2 text-dark" style={{ minHeight: '3rem' }}>
                        {product.name}
                    </h5>
                </Link>

                <p className="card-text text-muted small mb-2">
                    {product.description.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description}
                </p>

                <div className="mb-3">
                    <span className="badge bg-light text-dark border me-1">
                        <i className="fas fa-tag me-1"></i>
                        {product.category}
                    </span>
                    <span className="badge bg-light text-dark border">
                        <i className="fas fa-box me-1"></i>
                        Stock: {product.stock}
                    </span>
                </div>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0 text-dark">
                            ${product.price.toLocaleString()}
                        </h4>
                        {isFavorite && (
                            <small className="text-danger">
                                <i className="fas fa-heart me-1"></i>
                                En favoritos
                            </small>
                        )}
                    </div>

                    <div className="d-grid gap-2">
                        <Link
                            to={`/product/${product.id}`}
                            className="btn btn-outline-dark"
                        >
                            <i className="fas fa-eye me-2"></i>
                            Ver Detalles
                        </Link>

                        {product.stock > 0 ? (
                            <button
                                className="btn btn-dark"
                                onClick={handleAddToCart}
                            >
                                <i className="fas fa-shopping-cart me-2"></i>
                                Agregar al Carrito
                            </button>
                        ) : (
                            <button className="btn btn-secondary" disabled>
                                <i className="fas fa-times me-2"></i>
                                Producto Agotado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;