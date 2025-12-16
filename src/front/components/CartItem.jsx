import React from "react";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    // En esta versión, item ES el producto directamente
    const product = item;
    const quantity = item.quantity || 1;

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            onUpdateQuantity(newQuantity);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value >= 1) {
            onUpdateQuantity(value);
        }
    };

    return (
        <tr>
            <td>
                <img
                    src={product.image_url || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80"}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
            </td>
            <td>
                <h6 className="mb-1">{product.name}</h6>
                <p className="text-muted small mb-0">{product.brand}</p>
                <p className="text-muted small mb-0">Ref: {product.model || "N/A"}</p>
                <p className="mb-0">${product.price.toLocaleString()} c/u</p>
            </td>
            <td className="text-center">
                <div className="input-group input-group-sm" style={{ maxWidth: '120px', margin: '0 auto' }}>
                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                    <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        onChange={handleInputChange}
                        min="1"
                        style={{ maxWidth: '50px' }}
                    />
                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => handleQuantityChange(1)}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                <small className="text-muted d-block mt-1">
                    Stock: {product.stock || "Disponible"}
                </small>
            </td>
            <td className="text-end align-middle">
                <strong>${(product.price * quantity).toLocaleString()}</strong>
            </td>
            <td className="text-center align-middle">
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={onRemove}
                    title="Eliminar del carrito"
                >
                    <i className="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
};

export default CartItem;