/**
 * CartContext.jsx – Full cart state management with localStorage persistence.
 *
 * Replaces the minimal existing CartContext with a production-quality version:
 * - localStorage persistence (survives page refresh)
 * - stock limit enforcement
 * - item count badge
 * - total price & total items
 * - clearCart for post-checkout
 */
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { toast } from "sonner";

export const CartContext = createContext(null);

const CART_KEY = "farmigo_cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Add to Cart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    // product must have: _id (or id), productName, pricePerUnit, quantity (stock), unit
    const itemId = product._id || product.id;
    const availableStock = product.quantity ?? Infinity;

    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === itemId);

      if (existing) {
        if (existing.cartQty >= availableStock) {
          toast.warning(`Maximum available stock (${availableStock} ${product.unit || "units"}) already in cart`);
          return prev;
        }
        toast.success(`${product.productName || product.name} quantity updated`);
        return prev.map((i) =>
          i._id === itemId ? { ...i, cartQty: i.cartQty + 1 } : i
        );
      }

      if (availableStock === 0) {
        toast.error("This item is out of stock");
        return prev;
      }

      toast.success(`🌿 ${product.productName || product.name} added to cart!`);
      return [
        ...prev,
        {
          _id: itemId,
          productName: product.productName || product.name,
          pricePerUnit: product.pricePerUnit || product.price,
          unit: product.unit || "unit",
          image: product.image || null,
          farmerId: product.farmerId,
          farmerName: product.farmerName || product.farmer || "FARMIGO Seller",
          category: product.category,
          availableStock,
          isOrganic: product.isOrganic || false,
          cartQty: 1,
        },
      ];
    });
  }, []);

  // ── Update Quantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback((itemId, newQty) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i._id !== itemId) return i;
        if (newQty < 1) return i;
        if (newQty > i.availableStock) {
          toast.warning(`Only ${i.availableStock} ${i.unit} available`);
          return i;
        }
        return { ...i, cartQty: newQty };
      })
    );
  }, []);

  // ── Remove Item ──────────────────────────────────────────────────────────────
  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i._id === itemId);
      if (item) toast.info(`${item.productName} removed from cart`);
      return prev.filter((i) => i._id !== itemId);
    });
  }, []);

  // ── Clear Cart ───────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success("Cart cleared");
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────────
  const totalItems = cartItems.reduce((sum, i) => sum + i.cartQty, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.pricePerUnit * i.cartQty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Convenience hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
