// Utilidad para manejar reviews en localStorage
export const reviewUtils = {
  // Obtener reviews de un producto
  getReviews: (productId) => {
    try {
      const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};
      return reviews[productId] || [];
    } catch (error) {
      console.error("Error getting reviews:", error);
      return [];
    }
  },

  // Agregar review a un producto
  addReview: (productId, review) => {
    try {
      const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};
      if (!reviews[productId]) {
        reviews[productId] = [];
      }

      const newReview = {
        id: Date.now(),
        // Cambiar 'name' por 'user' para que coincida con el componente
        user: review.name || "Usuario Anónimo",
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split("T")[0],
        verified: false,
      };

      reviews[productId].unshift(newReview);
      localStorage.setItem("productReviews", JSON.stringify(reviews));

      return newReview;
    } catch (error) {
      console.error("Error adding review:", error);
      return null;
    }
  },

  // Eliminar review de un producto
  deleteReview: (productId, reviewId) => {
    try {
      const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};

      if (reviews[productId]) {
        reviews[productId] = reviews[productId].filter(
          (review) => review.id !== reviewId
        );
        localStorage.setItem("productReviews", JSON.stringify(reviews));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  },

  // Modificar review de un producto
  updateReview: (productId, reviewId, updatedReview) => {
    try {
      const reviews = JSON.parse(localStorage.getItem("productReviews")) || {};

      if (reviews[productId]) {
        const reviewIndex = reviews[productId].findIndex(
          (review) => review.id === reviewId
        );

        if (reviewIndex !== -1) {
          reviews[productId][reviewIndex] = {
            ...reviews[productId][reviewIndex],
            ...updatedReview,
            id: reviewId, // Mantener el ID original
            date: reviews[productId][reviewIndex].date, // Mantener la fecha original
          };

          localStorage.setItem("productReviews", JSON.stringify(reviews));
          return reviews[productId][reviewIndex];
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating review:", error);
      return null;
    }
  },

  // Calcular rating promedio
  getAverageRating: (productId) => {
    const reviews = reviewUtils.getReviews(productId);
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  // Obtener distribución de ratings
  getRatingDistribution: (productId) => {
    const reviews = reviewUtils.getReviews(productId);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    return distribution;
  },
};
