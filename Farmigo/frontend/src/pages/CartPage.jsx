/**
 * CartPage.jsx – Full cart page rebuilt with CartContext and backend stock validation.
 * Replaces the existing simple CartPage.jsx.
 */
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaTrash, FaPlus, FaMinus,
  FaLeaf, FaArrowLeft, FaCheckCircle, FaShieldAlt,
  FaStore,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { formatCurrency, getCategoryImage } from "../utils/formatters";
import { toast } from "sonner";

const CartItemRow = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const [imgErr, setImgErr] = [false, () => {}];

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-emerald-50">
        <img
          src={item.image || getCategoryImage(item.category)}
          alt={item.productName}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = getCategoryImage(item.category); }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-sm truncate">{item.productName}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <FaStore className="text-[9px] text-emerald-500" />
          {item.farmerName || "FARMIGO Seller"}
        </p>
        <p className="text-emerald-600 font-bold text-sm mt-1">
          {formatCurrency(item.pricePerUnit)} <span className="text-gray-400 font-normal">/{item.unit}</span>
        </p>
        {item.isOrganic && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
            <FaLeaf className="text-[8px]" /> Organic
          </span>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => {
            if (item.cartQty <= 1) removeFromCart(item._id);
            else updateQuantity(item._id, item.cartQty - 1);
          }}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors text-xs"
        >
          <FaMinus />
        </button>
        <span className="w-8 text-center font-black text-gray-800 text-sm">{item.cartQty}</span>
        <button
          onClick={() => updateQuantity(item._id, item.cartQty + 1)}
          disabled={item.cartQty >= item.availableStock}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors disabled:opacity-40 text-xs"
        >
          <FaPlus />
        </button>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0 min-w-[80px]">
        <p className="font-black text-gray-900 text-sm">
          {formatCurrency(item.pricePerUnit * item.cartQty)}
        </p>
        <p className="text-[10px] text-gray-400">{item.cartQty} × {item.unit}</p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item._id)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
        title="Remove"
      >
        <FaTrash className="text-sm" />
      </button>
    </div>
  );
};

const CartPage = () => {
  const { cartItems, totalItems, totalPrice, clearCart, finalizeCart } = useContext(CartContext);
  const navigate = useNavigate();

  const deliveryFee = 0;
  const grandTotal = totalPrice + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16">
            <FaShoppingCart className="text-6xl text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Start shopping the Farm Fresh Marketplace!</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md"
            >
              <FaLeaf /> Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 font-semibold mb-3 transition-colors"
            >
              <FaArrowLeft /> Continue Shopping
            </button>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <FaShoppingCart className="text-emerald-600" />
              Your Cart
              <span className="text-base font-normal text-gray-400">({totalItems} items)</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors flex items-center gap-1.5"
          >
            <FaTrash /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItemRow key={item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                📋 Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-xs text-gray-500">
                    <span className="truncate mr-2 max-w-[150px]">
                      {item.productName} × {item.cartQty}
                    </span>
                    <span className="font-semibold text-gray-700 whitespace-nowrap">
                      {formatCurrency(item.pricePerUnit * item.cartQty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-emerald-700">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 my-4 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <FaCheckCircle /> You saved on free delivery!
              </div>

              {/* SIMULATED CHECKOUT FLOW */}
              <div className="space-y-2 mt-4">
                <button
                  id="checkout-success-btn"
                  onClick={() => {
                    finalizeCart();
                    toast.success("Checkout Successful! Stock is now final.");
                    setTimeout(() => navigate("/dashboard"), 1500); 
                  }}
                  className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-md text-xs flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Finalize Order (Succeed)
                </button>
                
                <button
                  id="checkout-fail-btn"
                  onClick={async () => {
                    // Fail/Cancel: Restore all stock
                    toast.loading("Cancelling... Restoring stock...");
                    await clearCart();
                    toast.dismiss();
                    toast.error("Checkout Cancelled. Stock restored to inventory.");
                  }}
                  className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <FaTrash /> Cancel Order (Restore Stock)
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                <FaShieldAlt /> Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;