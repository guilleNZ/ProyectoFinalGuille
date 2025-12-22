import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import { ReviewsSection } from '../components/ReviewsSection';

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);

    useEffect(() => {
        
        const productId = parseInt(id);
        const foundProduct = getProductById(productId);

        if (foundProduct) {
            setProduct(foundProduct);

            
            const allProducts = [
                { id: (productId % 18) + 1, name: "Reloj relacionado 1", price: 5000, brand: foundProduct.brand, image_url: foundProduct.image_url },
                { id: ((productId + 1) % 18) + 1, name: "Reloj relacionado 2", price: 7500, brand: foundProduct.brand, image_url: foundProduct.image_url },
                { id: ((productId + 2) % 18) + 1, name: "Reloj relacionado 3", price: 10000, brand: foundProduct.brand, image_url: foundProduct.image_url }
            ];
            setRelatedProducts(allProducts);

            
            checkIfFavorite(productId);

            
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const count = favorites.filter(favId => favId === productId).length;
            setFavoriteCount(count);
        }

        setLoading(false);
    }, [id]);

    const checkIfFavorite = (productId) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.includes(productId));
    };

    const handleToggleFavorite = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para usar favoritos");
            navigate("/login");
            return;
        }

        setFavoriteLoading(true);

        // Obtener favoritos actuales
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        let newIsFavorite;
        let newFavoriteCount;

        if (isFavorite) {
            // Eliminar de favoritos
            const updatedFavorites = favorites.filter(favId => favId !== product.id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            newIsFavorite = false;
            newFavoriteCount = Math.max(0, favoriteCount - 1);

            // Mostrar notificación
            showNotification("❌ Producto eliminado de favoritos", "danger");
        } else {
            // Agregar a favoritos
            favorites.push(product.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            newIsFavorite = true;
            newFavoriteCount = favoriteCount + 1;

            // Mostrar notificación
            showNotification("❤️ Producto agregado a favoritos", "success");
        }

        // Actualizar estado
        setIsFavorite(newIsFavorite);
        setFavoriteCount(newFavoriteCount);

        
        window.dispatchEvent(new Event('favoritesUpdated'));

        setFavoriteLoading(false);
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

        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    };

    const handleAddToCart = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Por favor, inicia sesión para agregar productos al carrito");
            navigate("/login");
            return;
        }

        if (quantity > product.stock) {
            alert(`No hay suficiente stock disponible. Stock actual: ${product.stock}`);
            return;
        }

        // Obtener carrito actual
        let cart = JSON.parse(localStorage.getItem('localCart')) || [];

        // Buscar si el producto ya existe en el carrito
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            // Verificar si la cantidad total excede el stock
            const totalQuantity = cart[existingItemIndex].quantity + quantity;
            if (totalQuantity > product.stock) {
                alert(`No hay suficiente stock disponible. Stock actual: ${product.stock}. Ya tienes ${cart[existingItemIndex].quantity} en el carrito.`);
                return;
            }
            // Actualizar cantidad existente
            cart[existingItemIndex].quantity = totalQuantity;
        } else {
            // Agregar nuevo producto al carrito
            cart.push({
                ...product,
                quantity: quantity
            });
        }

        // Guardar carrito actualizado
        localStorage.setItem('localCart', JSON.stringify(cart));

        // Mostrar notificación
        showNotification(`✅ ${quantity} x ${product.name} agregado al carrito`, "success");

        
        window.dispatchEvent(new Event('cartUpdated'));

        
        setTimeout(() => {
            navigate("/cart");
        }, 1500);
    };

    const handleShare = () => {
        const shareUrl = window.location.href;
        const shareText = `¡Mira este increíble ${product.name} por $${product.price.toLocaleString()}!`;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: shareText,
                url: shareUrl,
            })
                .catch(error => console.log('Error sharing:', error));
        } else {
            
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
                .then(() => {
                    showNotification("✅ Enlace copiado al portapapeles", "success");
                })
                .catch(err => {
                    console.error('Error copying:', err);
                });
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando detalles del producto...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Producto no encontrado</h4>
                    <p>El producto que buscas no existe o ha sido eliminado.</p>
                    <hr />
                    <button className="btn btn-dark" onClick={() => navigate("/catalog")}>
                        <i className="fas fa-arrow-left me-2"></i>
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    
    const productImages = [
        product.image_url,
        product.image_url,
        product.image_url
    ];

    return (
        <div className="container py-4">
            
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <button className="btn btn-link text-decoration-none p-0" onClick={() => navigate("/")}>
                            Inicio
                        </button>
                    </li>
                    <li className="breadcrumb-item">
                        <button className="btn btn-link text-decoration-none p-0" onClick={() => navigate("/catalog")}>
                            Catálogo
                        </button>
                    </li>
                    <li className="breadcrumb-item">
                        <button className="btn btn-link text-decoration-none p-0" onClick={() => navigate(`/catalog?brand=${product.brand}`)}>
                            {product.brand}
                        </button>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row">
                {/* Columna izquierda: Imágenes */}
                <div className="col-lg-6 mb-4">
                    
                    <div>
                        {/* Imagen principal */}
                        <div className="position-relative mb-3">
                            <img
                                src={productImages[activeImage]}
                                alt={`${product.name} - Vista ${activeImage + 1}`}
                                className="img-fluid rounded shadow-lg w-100"
                                style={{ maxHeight: '500px', objectFit: 'cover' }}
                            />

                            {/* Badges */}
                            <div className="position-absolute top-0 start-0 m-3">
                                <span className="badge bg-dark fs-6">{product.brand}</span>
                            </div>
                            <div className="position-absolute top-0 end-0 m-3">
                                {product.stock <= 3 && product.stock > 0 ? (
                                    <span className="badge bg-warning fs-6">
                                        <i className="fas fa-exclamation-circle me-1"></i>
                                        Últimas {product.stock}
                                    </span>
                                ) : product.stock === 0 ? (
                                    <span className="badge bg-danger fs-6">
                                        <i className="fas fa-times-circle me-1"></i>
                                        Agotado
                                    </span>
                                ) : (
                                    <span className="badge bg-success fs-6">
                                        <i className="fas fa-check-circle me-1"></i>
                                        Disponible
                                    </span>
                                )}
                            </div>

                            {/* Contador de favoritos */}
                            <div className="position-absolute bottom-0 start-0 m-3">
                                <div className="bg-dark text-white rounded-pill px-3 py-1">
                                    <i className="fas fa-heart me-1"></i>
                                    <span className="fw-bold">{favoriteCount}</span> favoritos
                                </div>
                            </div>
                        </div>

                        {/* Miniaturas */}
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`border rounded p-1 ${activeImage === index ? 'border-dark border-2' : 'border-secondary'}`}
                                    style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <img
                                        src={img}
                                        alt={`Miniatura ${index + 1}`}
                                        className="img-fluid h-100 w-100 object-fit-cover rounded"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Botones de acción rápidos */}
                        <div className="d-flex gap-2 mb-4">
                            <button
                                className="btn btn-outline-dark flex-grow-1"
                                onClick={handleToggleFavorite}
                                disabled={favoriteLoading}
                            >
                                {favoriteLoading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : isFavorite ? (
                                    <>
                                        <i className="fas fa-heart text-danger me-2"></i>
                                        Quitar de Favoritos
                                    </>
                                ) : (
                                    <>
                                        <i className="far fa-heart me-2"></i>
                                        Agregar a Favoritos
                                    </>
                                )}
                            </button>

                            <button
                                className="btn btn-outline-dark"
                                onClick={handleShare}
                                title="Compartir producto"
                            >
                                <i className="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Información */}
                <div className="col-lg-6">
                    {/* Encabezado */}
                    <div className="mb-4">
                        <h1 className="display-5 fw-bold mb-2" style={{ color: '#1a1a1a' }}>
                            {product.name}
                        </h1>
                        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                            <span className="badge bg-secondary fs-6">{product.category}</span>
                            <span className="badge bg-light text-dark border fs-6">{product.model || product.brand}</span>
                            <span className="badge bg-info fs-6">
                                <i className="fas fa-star me-1"></i>
                                4.8
                            </span>
                        </div>
                    </div>

                    {/* Precio y disponibilidad */}
                    <div className="card border-0 bg-light mb-4">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <div className="display-4 fw-bold text-dark">
                                        ${product.price.toLocaleString()}
                                    </div>
                                    <p className="text-muted mb-0">IVA incluido • Envío gratuito</p>
                                    <div className="mt-2">
                                        <small className="text-success">
                                            <i className="fas fa-check-circle me-1"></i>
                                            Pago seguro garantizado
                                        </small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className={`rounded-circle me-3 ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}
                                            style={{ width: '12px', height: '12px' }}></div>
                                        <div>
                                            <strong className="d-block">
                                                {product.stock > 0 ? '✅ En stock' : '❌ Agotado'}
                                            </strong>
                                            <small className="text-muted">
                                                {product.stock > 0
                                                    ? `${product.stock} unidades disponibles`
                                                    : 'Producto temporalmente no disponible'}
                                            </small>
                                        </div>
                                    </div>
                                    {product.stock > 0 && product.stock <= 5 && (
                                        <div className="mt-2 alert alert-warning py-2 mb-0">
                                            <i className="fas fa-bolt me-1"></i>
                                            ¡Solo quedan {product.stock} unidades!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-5">
                        <h3 className="mb-3">
                            <i className="fas fa-info-circle me-2 text-primary"></i>
                            Descripción
                        </h3>
                        <p className="lead">{product.description}</p>
                    </div>

                    {/* Selector de cantidad y botones principales */}
                    {product.stock > 0 && (
                        <div className="card border-0 shadow-lg mb-5">
                            <div className="card-body p-4">
                                <div className="row align-items-center">
                                    <div className="col-md-4 mb-4 mb-md-0">
                                        <label className="form-label fw-bold fs-5">Cantidad</label>
                                        <div className="input-group input-group-lg" style={{ maxWidth: '180px' }}>
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 1;
                                                    setQuantity(Math.min(Math.max(1, value), product.stock));
                                                }}
                                                min="1"
                                                max={product.stock}
                                                style={{ fontSize: '1.2rem' }}
                                            />
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <small className="text-muted d-block mt-2">
                                            Máximo: {product.stock} unidades
                                        </small>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-dark btn-lg py-3"
                                                onClick={handleAddToCart}
                                            >
                                                <i className="fas fa-shopping-cart me-2"></i>
                                                Agregar al Carrito - ${(product.price * quantity).toLocaleString()}
                                            </button>
                                            <button
                                                className="btn btn-outline-dark btn-lg py-3"
                                                onClick={() => navigate("/checkout")}
                                            >
                                                <i className="fas fa-bolt me-2"></i>
                                                Comprar Ahora
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Especificaciones */}
                    <div className="mb-5">
                        <h3 className="mb-4">
                            <i className="fas fa-list-alt me-2 text-primary"></i>
                            Especificaciones Técnicas
                        </h3>
                        <div className="row">
                            {[
                                { label: "Marca", value: product.brand, icon: "fas fa-tag" },
                                { label: "Categoría", value: product.category, icon: "fas fa-layer-group" },
                                { label: "Material", value: product.material || "Acero inoxidable", icon: "fas fa-gem" },
                                { label: "Movimiento", value: product.movement || "Automático", icon: "fas fa-cogs" },
                                { label: "Diámetro", value: product.case_diameter || "40mm", icon: "fas fa-ruler" },
                                { label: "Resistencia agua", value: product.water_resistance || "100m", icon: "fas fa-tint" },
                                { label: "Stock disponible", value: `${product.stock} unidades`, icon: "fas fa-box" },
                                { label: "Condición", value: product.condition || "Nuevo", icon: "fas fa-certificate" }
                            ].map((spec, index) => (
                                <div key={index} className="col-md-6 mb-3">
                                    <div className="card border h-100">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className={`${spec.icon} text-primary me-2`}></i>
                                                <h6 className="card-subtitle mb-0 text-muted">{spec.label}</h6>
                                            </div>
                                            <p className="card-text fw-bold">{spec.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Información de garantía */}
                    <div className="mb-5">
                        <h3 className="mb-4">
                            <i className="fas fa-shield-alt me-2 text-primary"></i>
                            Garantía y Servicios
                        </h3>
                        <div className="row text-center">
                            <div className="col-4">
                                <div className="p-3 border rounded h-100">
                                    <i className="fas fa-shipping-fast fa-2x mb-3 text-dark"></i>
                                    <h6 className="fw-bold">Envío Gratuito</h6>
                                    <p className="small text-muted mb-0">3-5 días hábiles</p>
                                    <p className="small text-muted mb-0">Rastreo incluido</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 border rounded h-100">
                                    <i className="fas fa-certificate fa-2x mb-3 text-dark"></i>
                                    <h6 className="fw-bold">2 Años Garantía</h6>
                                    <p className="small text-muted mb-0">Internacional</p>
                                    <p className="small text-muted mb-0">Certificado oficial</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="p-3 border rounded h-100">
                                    <i className="fas fa-undo fa-2x mb-3 text-dark"></i>
                                    <h6 className="fw-bold">30 Días</h6>
                                    <p className="small text-muted mb-0">Devolución gratuita</p>
                                    <p className="small text-muted mb-0">Sin preguntas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos relacionados */}
                    {relatedProducts.length > 0 && (
                        <div className="mb-5">
                            <h3 className="mb-4">
                                <i className="fas fa-random me-2 text-primary"></i>
                                Productos Relacionados
                            </h3>
                            <div className="row">
                                {relatedProducts.map((related, index) => (
                                    <div key={index} className="col-md-4 mb-3">
                                        <div className="card border h-100">
                                            <img
                                                src={related.image_url}
                                                className="card-img-top"
                                                alt={related.name}
                                                style={{ height: '150px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h6 className="card-title">{related.name}</h6>
                                                <p className="card-text text-muted small">{related.brand}</p>
                                                <p className="fw-bold">${related.price.toLocaleString()}</p>
                                                <button
                                                    className="btn btn-sm btn-outline-dark w-100"
                                                    onClick={() => navigate(`/product/${related.id}`)}
                                                >
                                                    Ver Producto
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sección de Reseñas */}
                    <div className="mb-5">
                        <ReviewsSection productId={product?.id} />
                    </div>

                    {/* Botones de navegación */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-dark"
                            onClick={() => navigate("/catalog")}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Volver al Catálogo
                        </button>
                        <button
                            className="btn btn-outline-dark"
                            onClick={() => navigate("/favorites")}
                        >
                            <i className="fas fa-heart me-2"></i>
                            Ver Mis Favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};