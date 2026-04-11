import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { toast } from "sonner";
import { reduceStock, restoreStock } from "../services/inventoryService";

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

    try {
      if (diff > 0) {
        // Increase quantity in cart = reduce stock in backend
        await reduceStock(itemId, { 
          quantityOrdered: diff, 
          note: "Cart quantity increased" 
        });
      } else {
        // Decrease quantity in cart = restore stock in backend
        await restoreStock(itemId, { 
          quantityRestored: Math.abs(diff), 
          note: "Cart quantity decreased" 
        });
      }
      
      setCartItems(prev => prev.map(i => i._id === itemId ? { ...i, cartQty: newQty } : i));
    } catch (err) {
      toast.error(err.response?.data?.message || "Stock update failed");
    }
  }, [cartItems]);

  // ── Remove Item (Restores stock to backend) ──────────────────────────────────
  const removeFromCart = useCallback(async (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;

    try {
      // Restore the full cart quantity back to the inventory
      await restoreStock(itemId, {
        quantityRestored: item.cartQty,
        note: `Item removed from cart: ${item.productName}`
      });

      setCartItems((prev) => prev.filter((i) => i._id !== itemId));
      toast.info(`${item.productName} removed from cart. Stock released.`);
    } catch (err) {
      toast.error("Failed to release stock. Removing from cart anyway.");
      setCartItems((prev) => prev.filter((i) => i._id !== itemId));
    }
  }, [cartItems]);

  // ── Clear Cart (Restores all stock) ──────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (cartItems.length === 0) return;

    try {
      // Loop through all items and restore their stock
      const promises = cartItems.map(item => 
        restoreStock(item._id, {
          quantityRestored: item.cartQty,
          note: "Cart cleared by user"
        })
      );

      await Promise.all(promises);
      setCartItems([]);
      toast.success("Cart cleared and stock released");
    } catch (err) {
      console.error("Error clearing cart stock:", err);
      setCartItems([]);
      toast.error("Cart cleared (some stock might not have released properly)");
    }
  }, [cartItems]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const totalItems = cartItems.reduce((sum, i) => sum + i.cartQty, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.pricePerUnit * i.cartQty,
    0
  );

  // ── Finalize Cart (Clears local but keeps backend reduction) ────────────────
  const finalizeCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        finalizeCart,
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
