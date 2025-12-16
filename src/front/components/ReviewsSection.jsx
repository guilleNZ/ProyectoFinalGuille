import React, { useState, useEffect } from "react";
import { reviewUtils } from "../utils/reviews";

export const ReviewsSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: "",
        name: ""
    });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = () => {
        const productReviews = reviewUtils.getReviews(productId);

        // Si no hay reviews, mostrar algunas de muestra
        if (productReviews.length === 0) {
            setReviews([
                {
                    id: 1,
                    user: "Carlos Rodríguez",
                    rating: 5,
                    date: "2024-01-15",
                    comment: "Excelente producto, llegó en perfectas condiciones. La atención al cliente es excepcional.",
                    verified: true
                },
                {
                    id: 2,
                    user: "Ana Martínez",
                    rating: 4,
                    date: "2024-01-10",
                    comment: "Muy buen reloj, solo que la correa es un poco ajustada para mi muñeca.",
                    verified: true
                },
                {
                    id: 3,
                    user: "David Chen",
                    rating: 5,
                    date: "2024-01-05",
                    comment: "Increíble calidad. Superó todas mis expectativas. ¡Totalmente recomendado!",
                    verified: false
                }
            ]);
        } else {
            setReviews(productReviews);
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const review = reviewUtils.addReview(productId, {
                rating: newReview.rating,
                comment: newReview.comment,
                name: newReview.name || "Usuario Anónimo"
            });

            if (review) {
                setReviews([review, ...reviews]);
                setNewReview({ rating: 5, comment: "", name: "" });
                setShowForm(false);

                // Mostrar notificación
                showNotification("¡Gracias por tu reseña!", "success");
            }

            setLoading(false);
        }, 1000);
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
            <i class="fas fa-check-circle me-2"></i>
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

    const averageRating = reviewUtils.getAverageRating(productId);
    const ratingDistribution = reviewUtils.getRatingDistribution(productId);
    const totalReviews = reviews.length;

    return (
        <div className="reviews-section mt-5 pt-5 border-top">
            <h3 className="mb-4">
                <i className="fas fa-star me-2 text-warning"></i>
                Reseñas de Clientes
            </h3>

            {/* Rating promedio y distribución */}
            <div className="row mb-5">
                <div className="col-md-4 mb-4">
                    <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center">
                            <div className="display-4 fw-bold text-dark">{averageRating}</div>
                            <div className="mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fas fa-star fa-lg ${i < Math.floor(averageRating) ? 'text-warning' : 'text-muted'}`}
                                    ></i>
                                ))}
                            </div>
                            <p className="text-muted mb-0">
                                Basado en {totalReviews} reseña{totalReviews !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card border-0 bg-light h-100">
                        <div className="card-body">
                            <h5 className="mb-3">Distribución de calificaciones</h5>
                            {[5, 4, 3, 2, 1].map(rating => {
                                const count = ratingDistribution[rating] || 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                                return (
                                    <div key={rating} className="d-flex align-items-center mb-2">
                                        <div className="me-2" style={{ width: '60px' }}>
                                            <span className="text-muted">{rating}</span>
                                            <i className="fas fa-star text-warning ms-1"></i>
                                        </div>
                                        <div className="progress flex-grow-1" style={{ height: '10px' }}>
                                            <div
                                                className="progress-bar bg-warning"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="ms-2" style={{ width: '40px', textAlign: 'right' }}>
                                            <small className="text-muted">{count}</small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón para agregar reseña */}
            {!showForm && (
                <button
                    className="btn btn-dark mb-4"
                    onClick={() => setShowForm(true)}
                >
                    <i className="fas fa-pen me-2"></i>
                    Escribir una Reseña
                </button>
            )}

            {/* Formulario de reseña */}
            {showForm && (
                <div className="card mb-5 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-title mb-0">Escribe tu reseña</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowForm(false)}
                            ></button>
                        </div>

                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Tu calificación</label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`btn btn-link p-0 me-2 ${star <= newReview.rating ? 'text-warning' : 'text-muted'}`}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            style={{ fontSize: '2rem' }}
                                        >
                                            <i className="fas fa-star"></i>
                                        </button>
                                    ))}
                                    <span className="ms-2 fw-bold">
                                        {newReview.rating} estrella{newReview.rating !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Tu nombre (opcional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    placeholder="Cómo te gustaría que aparezca tu nombre"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Tu reseña *</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Comparte tu experiencia con este producto..."
                                    required
                                ></textarea>
                                <div className="form-text">
                                    Mínimo 10 caracteres
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                    disabled={loading || newReview.comment.length < 10}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Enviar Reseña
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowForm(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de reseñas */}
            <div className="reviews-list">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                        Reseñas recientes ({totalReviews})
                    </h5>
                    <div className="dropdown">
                        <button className="btn btn-outline-dark btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Ordenar por
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item">Más recientes</button></li>
                            <li><button className="dropdown-item">Mejor calificadas</button></li>
                            <li><button className="dropdown-item">Peor calificadas</button></li>
                        </ul>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-4">
                        <i className="fas fa-comment fa-3x text-muted mb-3"></i>
                        <h5>No hay reseñas todavía</h5>
                        <p className="text-muted">
                            Sé el primero en compartir tu experiencia con este producto.
                        </p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="card mb-3 border">
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-3">
                                    <div>
                                        <h6 className="mb-1 fw-bold">{review.user}</h6>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                                                    ></i>
                                                ))}
                                            </div>
                                            <span className="text-muted">{review.date}</span>
                                            {review.verified && (
                                                <span className="badge bg-success ms-2">
                                                    <i className="fas fa-check me-1"></i>
                                                    Compra Verificada
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0">{review.comment}</p>

                                {/* Acciones */}
                                <div className="mt-3 pt-3 border-top d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-dark">
                                        <i className="fas fa-thumbs-up me-1"></i>
                                        Útil
                                    </button>
                                    <button className="btn btn-sm btn-outline-dark">
                                        <i className="fas fa-flag me-1"></i>
                                        Reportar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};