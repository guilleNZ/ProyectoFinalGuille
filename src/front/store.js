
export const initialStore = () => {
  return {
    message: null,
    
    cart: {
      items: [],
      total: 0,
    },
    
    user: null,
    
    orders: [],
    
  };
};


export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    
    case "CLEAR_CART":
      return {
        ...store,
        cart: {
          
          items: [],
          total: 0,
        },
      };
    
    case "SET_CART":
      return {
        ...store,
        cart: action.payload, 
      };
    
    case "SET_USER":
      return {
        ...store,
        user: action.payload, 
      };
    

    
    case "ADD_ORDER":
      return {
        ...store,
        orders: [...store.orders, action.payload], 
      };
    

    default:
      throw Error("Unknown action.");
  }
}
