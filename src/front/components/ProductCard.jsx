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

    const checkIfFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Si no hay token, no verificar favoritos
            setIsFavorite(false);
            setFavoriteId(null);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/favorites/check/${product.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                // Token inválido o expirado
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsFavorite(false);
                setFavoriteId(null);
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setIsFavorite(data.is_favorite);
                setFavoriteId(data.favorite_id);
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        } catch (error) {
            console.error("Error checking favorite:", error);
            setIsFavorite(false);
            setFavoriteId(null);
        }
    };

    const handleToggleFavorite = async (e) => {       ////REVISAR!!!!!////REVISAR!!!!!////REVISAR!!!!!
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para usar favoritos");
            return;
        }

        setLoadingFavorite(true);

        try {
            if (isFavorite) {
                // Eliminar de favoritos
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/favorites/${product.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
                    window.location.href = "/login"; // Redirigir al login
                    return;
                }

                if (response.ok) {
                    setIsFavorite(false);
                    setFavoriteId(null);
                    // 👇 Disparar evento para actualizar Navbar
                    window.dispatchEvent(new Event('favoritesUpdated'));
                }
            } else {         ////REVISAR!!!!!////REVISAR!!!!!////REVISAR!!!!!
                // Agregar a favoritos
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/favorites`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },         ////REVISAR!!!!!////REVISAR!!!!!
                        body: JSON.stringify({
                            product_id: product.id
                        })
                    }
                );

                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
                    window.location.href = "/login"; // Redirigir al login
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setIsFavorite(true);
                    setFavoriteId(data.favorite?.id);
                    // 👇 Disparar evento para actualizar Navbar
                    window.dispatchEvent(new Event('favoritesUpdated'));
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("Error al actualizar favoritos");
        } finally {
            setLoadingFavorite(false);
        }
    };

    const handleAddToCart = async (e) => {      ////REVISAR!!!!!////REVISAR!!!!!
        e.preventDefault();  
        e.stopPropagation();   ////REVISAR!!!!!////REVISAR!!!!!

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para agregar productos al carrito");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/items`, {           
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1
                })
            });

            if (response.status === 401) {
                // Token inválido o expirado
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
                window.location.href = "/login"; // Redirigir al login
                return;
            }

            if (response.ok) {
                alert("✅ Producto agregado al carrito");
                // 👇 Disparar evento para actualizar Navbar
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const data = await response.json();
                alert(data.msg || "Error al agregar al carrito");
            }
        } catch (error) {
            alert("Error de conexión");
        }
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
////REVISAR!!!!!////REVISAR!!!!!////REVISAR!!!!!////REVISAR!!!!!////REVISAR!!!!!
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
