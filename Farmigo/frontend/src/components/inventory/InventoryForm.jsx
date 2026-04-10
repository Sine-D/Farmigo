/**
 * InventoryForm.jsx
 * Reusable Add / Edit inventory item form for farmer/admin management.
 * Features: Comprehensive inline validation & backend error mapping.
 */
import { useState, useEffect } from "react";
import { FaLeaf, FaSave, FaTimes, FaSpinner, FaExclamationCircle } from "react-icons/fa";

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

const InventoryForm = ({ initialData = null, onSubmit, onCancel, loading = false, serverErrors = null }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Sync server-side errors
  useEffect(() => {
    if (serverErrors) {
      setErrors(prev => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

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
    // Clear error for this field
    if (errors[name]) {
      const newErrs = { ...errors };
      delete newErrs[name];
      setErrors(newErrs);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    else if (form.productName.trim().length < 3) errs.productName = "Name must be at least 3 characters";

    if (!form.description.trim()) errs.description = "Please provide a short description";
    
    if (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = "Enter a valid quantity (0 or more)";

    if (!form.pricePerUnit || isNaN(form.pricePerUnit) || Number(form.pricePerUnit) <= 0)
      errs.pricePerUnit = "Price must be greater than 0";

    if (form.expiryDate && form.harvestDate) {
      if (new Date(form.expiryDate) <= new Date(form.harvestDate)) {
        errs.expiryDate = "Expiry must be after harvest date";
      }
    }

    if (!form.category) errs.category = "Please select a category";
    if (!form.unit) errs.unit = "Please select a unit";

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      <div className="flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
        <FaExclamationCircle className="text-red-500 text-[10px]" />
        <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">
          {errors[name]}
        </p>
      </div>
    ) : null;

  const inputClass = (name) =>
    `w-full px-4 py-3.5 rounded-2xl border-2 transition-all outline-none text-sm font-bold ${
      errors[name] 
        ? "border-red-100 bg-red-50/50 text-red-900 focus:border-red-300 ring-red-50" 
        : "border-gray-100 bg-white hover:border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-gray-700"
    }`;

  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Product Name + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Product Name *</label>
          <input
            name="productName"
            value={form.productName}
            onChange={onChange}
            placeholder="e.g. Organic Tomatoes"
            className={inputClass("productName")}
          />
          <FieldError name="productName" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className={inputClass("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
          <FieldError name="category" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          placeholder="Detailed quality description helps buyers choose your produce..."
          className={`${inputClass("description")} resize-none`}
        />
        <FieldError name="description" />
      </div>

      {/* Row: Quantity + Unit + Min Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Quantity *</label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={onChange}
            placeholder="0"
            className={inputClass("quantity")}
          />
          <FieldError name="quantity" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Unit *</label>
          <select
            name="unit"
            value={form.unit}
            onChange={onChange}
            className={inputClass("unit")}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u.toUpperCase()}</option>
            ))}
          </select>
          <FieldError name="unit" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Safety Stock Level</label>
          <input
            name="minimumStockLevel"
            type="number"
            value={form.minimumStockLevel}
            onChange={onChange}
            className={inputClass("minimumStockLevel")}
          />
          <FieldError name="minimumStockLevel" />
        </div>
      </div>

      {/* Row: Price + Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Price Per Unit (LKR) *</label>
          <input
            name="pricePerUnit"
            type="number"
            step="0.01"
            value={form.pricePerUnit}
            onChange={onChange}
            placeholder="0.00"
            className={inputClass("pricePerUnit")}
          />
          <FieldError name="pricePerUnit" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={onChange}
            className={inputClass("currency")}
          >
            <option value="LKR">LKR (Sri Lankan Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Harvest Date</label>
          <input
            name="harvestDate"
            type="date"
            value={form.harvestDate}
            onChange={onChange}
            className={inputClass("harvestDate")}
          />
          <FieldError name="harvestDate" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Expiry Date</label>
          <input
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={onChange}
            className={inputClass("expiryDate")}
          />
          <FieldError name="expiryDate" />
        </div>
      </div>

      {/* Location + Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Storage/Location</label>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Farm storage, Cold room, etc."
            className={inputClass("location")}
          />
          <FieldError name="location" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Product Image</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((prev) => ({ ...prev, image: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-xs text-gray-400 font-bold
                  file:mr-4 file:py-3.5 file:px-6 file:cursor-pointer
                  file:rounded-xl file:border-0
                  file:text-[10px] file:font-black file:uppercase file:tracking-[0.1em]
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100 file:transition-all
                  bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200/60 hover:border-emerald-200 transition-all"
              />
            </label>
            {form.image && (
              <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-emerald-900/10 transition-all">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <FieldError name="image" />
        </div>
      </div>

      {/* Organic Checkbox */}
      <div className="flex items-center gap-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
        <div className="relative flex items-center">
            <input
              id="isOrganic"
              name="isOrganic"
              type="checkbox"
              checked={form.isOrganic}
              onChange={onChange}
              className="w-6 h-6 rounded-lg accent-emerald-600 transition-all cursor-pointer"
            />
        </div>
        <label htmlFor="isOrganic" className="flex-1 cursor-pointer">
           <p className="text-xs font-black text-emerald-900 uppercase tracking-tight flex items-center gap-1.5">
             <FaLeaf className="text-emerald-500" /> Certified Organic Produce
           </p>
           <p className="text-[10px] text-emerald-600/60 font-medium">Toggle if this product is grown without chemicals.</p>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-8 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 px-10 py-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-xl shadow-emerald-200 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {loading ? "Syncing..." : (initialData ? "Update Harvest" : "Push to Market")}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
