// Configuración para desarrollo/producción
export const config = {
  // URL del backend - priorizar variable de entorno, sino usar localhost
  backendUrl:
    import.meta.env.VITE_BACKEND_URL ||
    "https://effective-chainsaw-pj6r45q5q7gghr47q-3001.app.github.dev/api", // <-- CORREGIDO: Quité los espacios al final

  // Configuración de la aplicación
  appName: "Luxury Watches",
  version: "1.0.0",

  // Configuración de pagos (modo sandbox para desarrollo)
  stripePublicKey:
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_key_here",

  // Configuración de localStorage
  storageKeys: {
    token: "luxury_watches_token",
    user: "luxury_watches_user",
    cart: "luxury_watches_cart",
    wishlist: "luxury_watches_wishlist",
    // Añadir esta línea
    simulatedOrders: "luxury_watches_simulated_orders",
    // ... otras claves ...
  },

  // Tiempos de expiración
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 horas en milisegundos

  // URLs de imágenes por defecto
  defaultImages: {
    product:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80", // <-- Quité espacios aquí también si los había
    user: "https://ui-avatars.com/api/?name=Usuario&background=1a1a1a&color=fff", // <-- Quité espacios aquí también si los había
  },
};

// Helper para hacer fetch con autenticación
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem(config.storageKeys.token);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${config.backendUrl}${url}`, {
      // <-- Esta línea usa config.backendUrl
      ...options,
      headers,
    });

    // Si el token expiró o no es válido
    if (response.status === 401) {
      localStorage.removeItem(config.storageKeys.token);
      localStorage.removeItem(config.storageKeys.user);
      window.location.href = "/login";
      return null;
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Helper para manejo offline
export const offlineStorage = {
  // Guardar datos localmente como fallback
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },

  // Cargar datos localmente
  load: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  },

  // Limpiar datos
  clear: (key) => {
    localStorage.removeItem(key);
  },

  // Sincronizar carrito offline con backend
  syncCart: async () => {
    const offlineCart = offlineStorage.load(config.storageKeys.cart);
    const token = localStorage.getItem(config.storageKeys.token);

    if (!offlineCart || !token || offlineCart.length === 0) {
      return;
    }

    try {
      for (const item of offlineCart) {
        await authenticatedFetch("/cart/items", {
          method: "POST",
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.quantity,
          }),
        });
      }

      // Limpiar carrito offline después de sincronizar
      offlineStorage.clear(config.storageKeys.cart);
    } catch (error) {
      console.log("Cart sync failed, keeping offline data");
    }
  },
};
