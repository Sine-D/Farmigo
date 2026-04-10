/**
 * InventoryForm.jsx
 * Reusable Add / Edit inventory item form for farmer/admin management.
 * Fields match the Inventory schema exactly.
 */
import { useState, useEffect } from "react";
import { FaLeaf, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

const CATEGORIES = ["vegetables", "fruits", "grains", "dairy", "poultry", "herbs", "spices", "other"];
const UNITS = ["kg", "g", "pieces", "liters", "bundles", "dozen"];

const initialForm = {
  productName: "",
  description: "",
  category: "vegetables",
  tags: "",
  isOrganic: false,
  quantity: "",
  unit: "kg",
  minimumStockLevel: 5,
  pricePerUnit: "",
  currency: "LKR",
  harvestDate: "",
  expiryDate: "",
  location: "",
  image: "",
};

const InventoryForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Pre-populate form for edit mode
  useEffect(() => {
    if (initialData) {
      setForm({
        productName: initialData.productName || "",
        description: initialData.description || "",
        category: initialData.category || "vegetables",
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : (initialData.tags || ""),
        isOrganic: initialData.isOrganic || false,
        quantity: initialData.quantity ?? "",
        unit: initialData.unit || "kg",
        minimumStockLevel: initialData.minimumStockLevel ?? 5,
        pricePerUnit: initialData.pricePerUnit ?? "",
        currency: initialData.currency || "LKR",
        harvestDate: initialData.harvestDate ? initialData.harvestDate.substring(0, 10) : "",
        expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 10) : "",
        location: initialData.location || "",
        image: initialData.image || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    if (form.productName.trim().length < 2) errs.productName = "At least 2 characters";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = "Valid quantity required";
    if (!form.pricePerUnit || isNaN(form.pricePerUnit) || Number(form.pricePerUnit) < 0)
      errs.pricePerUnit = "Valid price required";
    if (!form.category) errs.category = "Category is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      pricePerUnit: Number(form.pricePerUnit),
      minimumStockLevel: Number(form.minimumStockLevel),
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      harvestDate: form.harvestDate || undefined,
      expiryDate: form.expiryDate || undefined,
      image: form.image || undefined,
      location: form.location || undefined,
    };

    onSubmit(payload);
  };

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span>⚠</span> {errors[name]}
      </p>
    ) : null;

  const inputClass = (name) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-400 ${
      errors[name] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"
    }`;

  const labelClass = "block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Row 1: Product Name + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product Name *</label>
          <input
            id="inv-productName"
            name="productName"
            value={form.productName}
            onChange={onChange}
            placeholder="e.g. Organic Tomatoes"
            className={inputClass("productName")}
          />
          <FieldError name="productName" />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select
            id="inv-category"
            name="category"
            value={form.category}
            onChange={onChange}
            className={inputClass("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <FieldError name="category" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          id="inv-description"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          placeholder="Describe the product, quality, origin..."
          className={`${inputClass("description")} resize-none`}
        />
      </div>

      {/* Row: Quantity + Unit + Min Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Quantity *</label>
          <input
            id="inv-quantity"
            name="quantity"
            type="number"
            min={0}
            value={form.quantity}
            onChange={onChange}
            placeholder="e.g. 100"
            className={inputClass("quantity")}
          />
          <FieldError name="quantity" />
        </div>

        <div>
          <label className={labelClass}>Unit *</label>
          <select
            id="inv-unit"
            name="unit"
            value={form.unit}
            onChange={onChange}
            className={inputClass("unit")}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Min. Stock Level</label>
          <input
            id="inv-minimumStockLevel"
            name="minimumStockLevel"
            type="number"
            min={0}
            value={form.minimumStockLevel}
            onChange={onChange}
            className={inputClass("minimumStockLevel")}
          />
        </div>
      </div>

      {/* Row: Price + Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price Per Unit *</label>
          <input
            id="inv-pricePerUnit"
            name="pricePerUnit"
            type="number"
            min={0}
            step="0.01"
            value={form.pricePerUnit}
            onChange={onChange}
            placeholder="e.g. 150.00"
            className={inputClass("pricePerUnit")}
          />
          <FieldError name="pricePerUnit" />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <select
            id="inv-currency"
            name="currency"
            value={form.currency}
            onChange={onChange}
            className={inputClass("currency")}
          >
            <option value="LKR">LKR</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Harvest Date</label>
          <input
            id="inv-harvestDate"
            name="harvestDate"
            type="date"
            value={form.harvestDate}
            onChange={onChange}
            className={inputClass("harvestDate")}
          />
        </div>

        <div>
          <label className={labelClass}>Expiry Date</label>
          <input
            id="inv-expiryDate"
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={onChange}
            className={inputClass("expiryDate")}
          />
        </div>
      </div>

      {/* Location + Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Storage/Location</label>
          <input
            id="inv-location"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="e.g. GreenCold Storage, Colombo"
            className={inputClass("location")}
          />
        </div>

        <div>
          <label className={labelClass}>Image URL</label>
          <input
            id="inv-image"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="https://..."
            className={inputClass("image")}
          />
        </div>
      </div>

      {/* Tags + Organic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            id="inv-tags"
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="e.g. fresh, local, seasonal"
            className={inputClass("tags")}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            id="inv-isOrganic"
            name="isOrganic"
            type="checkbox"
            checked={form.isOrganic}
            onChange={onChange}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
          <label htmlFor="inv-isOrganic" className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5">
            <FaLeaf className="text-emerald-500" />
            Certified Organic
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <FaTimes /> Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          id="inv-form-submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md hover:shadow-emerald-200/80 transition-all disabled:opacity-60"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {loading ? "Saving..." : (initialData ? "Update Item" : "Create Item")}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
