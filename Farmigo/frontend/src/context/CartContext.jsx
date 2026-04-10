import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { toast } from "sonner";
import { reduceStock } from "../services/inventoryService";

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

  // ── Add to Cart (with Real-time Stock Reduction) ──────────────────────────
  const addToCart = useCallback(async (product) => {
    const itemId = product._id || product.id;
    const availableStock = product.quantity ?? Infinity;

    if (availableStock <= 0) {
      toast.error("This item is out of stock");
      return;
    }

    try {
      // Call backend to reduce stock immediately
      const result = await reduceStock(itemId, {
        quantityOrdered: 1,
        note: "Added to cart (auto-reduction)"
      });

      if (result.lowStockWarning) {
        toast.warning(result.lowStockWarning.message);
      }

      setCartItems((prev) => {
        const existing = prev.find((i) => i._id === itemId);
        if (existing) {
          return prev.map((i) =>
            i._id === itemId ? { ...i, cartQty: i.cartQty + 1 } : i
          );
        }

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
            availableStock: result.updatedInventory.quantity + 1, // Store what it was
            isOrganic: product.isOrganic || false,
            cartQty: 1,
          },
        ];
      });

      toast.success(`🌿 ${product.productName || product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  }, []);

  // ── Update Quantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (itemId, newQty) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;

    const diff = newQty - item.cartQty;
    if (diff === 0) return;

    if (diff > 0) {
      try {
        await reduceStock(itemId, { quantityOrdered: diff, note: "Cart quantity increased" });
        setCartItems(prev => prev.map(i => i._id === itemId ? { ...i, cartQty: newQty } : i));
      } catch (err) {
        toast.error(err.response?.data?.message || "Stock update failed");
      }
    } else {
      // Releasing stock would require another endpoint or allowing negative numbers
      // For this demo, we'll just update local state and warn the user
      // Note: A production system would have an 'increase-stock' or 'cancel-reservation' endpoint
      setCartItems(prev => prev.map(i => i._id === itemId ? { ...i, cartQty: newQty } : i));
      toast.info("Stock released locally (Backend re-stocking simulated)");
    }
  }, [cartItems]);

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
