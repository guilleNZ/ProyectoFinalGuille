import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products"; 

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = () => {
        
        const localFavoritesIds = JSON.parse(localStorage.getItem('favorites')) || [];

        if (localFavoritesIds.length === 0) {
            // Si no hay favoritos, redirigir al catálogo
            setFavorites([]);
        } else {
           
            const fullProducts = localFavoritesIds
                .map(id => getProductById(id))
                .filter(product => product !== null); 

            setFavorites(fullProducts);
        }

        setLoading(false);
    };

    const handleRemoveFavorite = (productId) => {
        if (!confirm("¿Eliminar de favoritos?")) return;

        
        const updatedFavorites = favorites.filter(fav => fav.id !== productId);
        setFavorites(updatedFavorites);

        
        const updatedFavoriteIds = updatedFavorites.map(fav => fav.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavoriteIds));

        
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    const handleClearAll = () => {
        if (!confirm("¿Eliminar todos los favoritos?")) return;

        // Limpiar todo
        setFavorites([]);
        localStorage.removeItem('favorites');

        
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    const handleAddToCart = (product) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para agregar productos al carrito");
            navigate("/login");
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
        alert(`✅ ${product.name} agregado al carrito`);

        
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando favoritos...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-2" style={{ color: '#1a1a1a' }}>
                        <i className="fas fa-heart text-danger me-2"></i>
                        Mis Favoritos
                    </h1>
                    <p className="text-muted mb-0">
                        {favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {favorites.length > 0 && (
                    <button
                        className="btn btn-outline-danger"
                        onClick={handleClearAll}
                    >
                        <i className="fas fa-trash me-2"></i>
                        Eliminar Todos
                    </button>
                )}
            </div>

            {/* Lista de favoritos */}
            {favorites.length === 0 ? (
                <div className="text-center py-5">
                    <i className="far fa-heart fa-4x text-muted mb-4"></i>
                    <h3 className="mb-3">No tienes favoritos</h3>
                    <p className="text-muted mb-4">
                        Guarda los relojes que más te gusten para verlos después
                    </p>
                    <Link to="/catalog" className="btn btn-dark btn-lg">
                        <i className="fas fa-search me-2"></i>
                        Explorar Catálogo
                    </Link>
                </div>
            ) : (
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {favorites.map((product) => {
                            const productId = product.id;
                            const productName = product.name;
                            const productPrice = product.price;
                            const productBrand = product.brand;
                            const productCategory = product.category;
                            const productImage = product.image_url;
                            const productDescription = product.description; // Añadido para mostrar descripción si se necesita

                            return (
                                <div key={productId} className="col">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="position-relative">
                                            <Link to={`/product/${productId}`}>
                                                <img
                                                    src={productImage}
                                                    className="card-img-top"
                                                    alt={productName}
                                                    style={{ height: '250px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80";
                                                    }}
                                                />
                                            </Link>

                                            {/* Botón eliminar favorito */}
                                            <button
                                                className="btn btn-danger position-absolute top-0 end-0 m-3 rounded-circle"
                                                style={{ width: '40px', height: '40px' }}
                                                onClick={() => handleRemoveFavorite(productId)}
                                                title="Eliminar de favoritos"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>

                                            {/* Badge favorito */}
                                            <div className="position-absolute top-0 start-0 m-3">
                                                <span className="badge bg-danger">
                                                    <i className="fas fa-heart me-1"></i>
                                                    Favorito
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <Link to={`/product/${productId}`} className="text-decoration-none">
                                                <h5 className="card-title text-dark mb-2">
                                                    {productName}
                                                </h5>
                                            </Link>

                                            <p className="card-text text-muted small mb-3">
                                                {productBrand}
                                            </p>

                                            <div className="mt-auto">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="mb-0 text-dark">
                                                        ${productPrice.toLocaleString()}
                                                    </h4>
                                                    <span className="badge bg-secondary">
                                                        {productCategory}
                                                    </span>
                                                </div>

                                                <div className="d-grid gap-2">
                                                    <Link
                                                        to={`/product/${productId}`}
                                                        className="btn btn-outline-dark"
                                                    >
                                                        <i className="fas fa-eye me-2"></i>
                                                        Ver Detalles
                                                    </Link>

                                                    <button
                                                        className="btn btn-dark"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <i className="fas fa-shopping-cart me-2"></i>
                                                        Agregar al Carrito
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resumen */}
                    <div className="mt-5 pt-4 border-top">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card border-0 bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title">Resumen de Favoritos</h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Total productos:</span>
                                            <span className="fw-bold">{favorites.length}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Precio total:</span>
                                            <span className="fw-bold">
                                                ${favorites.reduce((sum, product) => sum + (product.price || 0), 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Marcas únicas:</span>
                                            <span className="fw-bold">
                                                {[...new Set(favorites.map(product => product.brand || "Sin marca"))].length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card border-0 bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title">Acciones</h5>
                                        <div className="d-grid gap-2">
                                            <Link to="/catalog" className="btn btn-outline-dark">
                                                <i className="fas fa-plus me-2"></i>
                                                Agregar Más Favoritos
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={handleClearAll}
                                            >
                                                <i className="fas fa-trash me-2"></i>
                                                Eliminar Todos los Favoritos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};