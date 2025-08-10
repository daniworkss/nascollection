import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  total: 0,
  count: 0,
  userData: null,
  clientSecret: '',
  isInitialized: false,
  orderId: [],
  receiptTotal: 0,

  initialize: () => {
    const savedCart = localStorage.getItem('cart');
    const savedTotal = localStorage.getItem('total');
    const savedCount = localStorage.getItem('count');

    set({
      cart: savedCart ? JSON.parse(savedCart) : [],
      total: savedTotal ? parseFloat(savedTotal) : 0,
      count: savedCount ? parseInt(savedCount) : 0,
      isInitialized: true,
    });
  },

  persistToLocalStorage: () => {
    const { cart, total, count } = get();
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total.toString());
    localStorage.setItem('count', count.toString());
  },

  calculateTotal: (cartItems) => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // Enhanced addToCart with variations support
  addToCart: (item, quantity, productid) => {
    const variations = {
      selectedColor: item.selectedColor || null,
      selectedSize: item.selectedSize || null,
      selectedInch: item.selectedInch || null,
    };
    
    // Create a unique cart item ID based on product ID and variations
    const variationKey = `${variations.selectedColor || 'none'}-${variations.selectedSize || 'none'}-${variations.selectedInch || 'none'}`;
    const cartItemId = `${productid}-${variationKey}-${Date.now()}`;
    
    // Check if the same product with same variations already exists
    const existingItemIndex = get().cart.findIndex(cartItem => 
      cartItem.productid === productid && 
      cartItem.variations.selectedColor === variations.selectedColor &&
      cartItem.variations.selectedSize === variations.selectedSize &&
      cartItem.variations.selectedInch === variations.selectedInch
    );

    let newCart;
    
    if (existingItemIndex !== -1) {
      // If item with same variations exists, update quantity
      newCart = [...get().cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with variations
      const newCartItem = { 
        ...item, 
        cartItemId, 
        quantity, 
        productid,
        variations,
        // Store formatted variation text for display
        variationText: get().formatVariationsText(variations, item.category)
      };
      newCart = [...get().cart, newCartItem];
    }
    
    const newTotal = get().calculateTotal(newCart);
    const newCount = existingItemIndex !== -1 ? get().count : get().count + 1;

    set({
      cart: newCart,
      total: newTotal,
      count: newCount,
    });

    get().persistToLocalStorage();
  },

  // Helper function to format variations for display
  formatVariationsText: (variations, category) => {
    const parts = [];
    
    if (variations.selectedColor) {
      parts.push(`Color: ${variations.selectedColor}`);
    }
    
    if (variations.selectedSize && (category === 'dresses')) {
      parts.push(`Size: ${variations.selectedSize.toUpperCase()}`);
    }
    
    if (variations.selectedInch && category === 'wigs') {
      parts.push(`Length: ${variations.selectedInch}"`);
    }
    
    return parts.join(' • ');
  },

  // Enhanced updateQuantity function
  updateQuantity: (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }

    const newCart = get().cart.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    const newTotal = get().calculateTotal(newCart);

    set({
      cart: newCart,
      total: newTotal,
    });

    get().persistToLocalStorage();
  },

  removeFromCart: (cartItemId) => {
    const newCart = get().cart.filter(item => item.cartItemId !== cartItemId);
    const newTotal = get().calculateTotal(newCart);

    set({
      cart: newCart,
      total: newTotal,
      count: Math.max(0, get().count - 1),
    });

    get().persistToLocalStorage();
  },

  clearCart: () => {
    set({ cart: [], total: 0, count: 0 });
    localStorage.removeItem('cart');
    localStorage.removeItem('total');
    localStorage.removeItem('count');
  },

  setReceiptTotal: (receiptTotal) => set({ receiptTotal }),
  setUserData: (data) => set({ userData: data }),
  setClientSecret: (secret) => set({ clientSecret: secret }),
  setOrderId: (orderId) => set({ orderId }),
}));