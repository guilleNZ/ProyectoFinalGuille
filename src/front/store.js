// src/front/store.js

// Estado inicial
export const initialStore = () => {
  return {
    message: null,
    // Añadir estado para el carrito
    cart: {
      items: [],
      total: 0,
    },
    // Añadir estado para el usuario (opcional, pero común)
    user: null,
    // Añadir estado para órdenes (opcional)
    orders: [],
    // ... otros estados ...
  };
};

// Reducer
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    // --- AÑADIDO: Caso para limpiar el carrito ---
    case "CLEAR_CART":
      return {
        ...store,
        cart: {
          // Reinicia el estado del carrito
          items: [],
          total: 0,
        },
      };
    // --- FIN AÑADIDO ---

    // --- AÑADIDO: Caso para actualizar el carrito (ejemplo si lo manejas aquí) ---
    case "SET_CART":
      return {
        ...store,
        cart: action.payload, // Asume que action.payload es el nuevo estado del carrito {items: [...], total: ...}
      };
    // --- FIN AÑADIDO ---

    // --- AÑADIDO: Caso para actualizar el usuario ---
    case "SET_USER":
      return {
        ...store,
        user: action.payload, // Asume que action.payload es el objeto de usuario
      };
    // --- FIN AÑADIDO ---

    // --- AÑADIDO: Caso para añadir/actualizar una orden ---
    case "ADD_ORDER":
      return {
        ...store,
        orders: [...store.orders, action.payload], // Asume que action.payload es la nueva orden
      };
    // --- FIN AÑADIDO ---

    // ... (otros casos) ...

    default:
      throw Error("Unknown action.");
  }
}
