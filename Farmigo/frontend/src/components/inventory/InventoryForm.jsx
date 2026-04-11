/**
 * InventoryForm.jsx
 * Reusable Add / Edit inventory item form for farmer/admin management.
 * Features: Comprehensive inline validation, backend error mapping, and calendar date picker.
 */
import { useState, useEffect } from "react";
import {
  FaLeaf,
  FaSave,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CATEGORIES = [
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "poultry",
  "herbs",
  "spices",
  "other",
];

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

const InventoryForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors = null,
}) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (serverErrors) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  useEffect(() => {
    if (initialData) {
      setForm({
        productName: initialData.productName || "",
        description: initialData.description || "",
        category: initialData.category || "vegetables",
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tags || "",
        isOrganic: initialData.isOrganic || false,
        quantity: initialData.quantity ?? "",
        unit: initialData.unit || "kg",
        minimumStockLevel: initialData.minimumStockLevel ?? 5,
        pricePerUnit: initialData.pricePerUnit ?? "",
        currency: initialData.currency || "LKR",
        harvestDate: initialData.harvestDate
          ? initialData.harvestDate.substring(0, 10)
          : "",
        expiryDate: initialData.expiryDate
          ? initialData.expiryDate.substring(0, 10)
          : "",
        location: initialData.location || "",
        image: initialData.image || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const validateField = (name, value, fullForm = form) => {
    switch (name) {
      case "productName":
        if (!String(value).trim()) return "Product name is required";
        if (String(value).trim().length < 3) {
          return "Name must be at least 3 characters";
        }
        if (String(value).trim().length > 100) {
          return "Name must be less than 100 characters";
        }
        return "";

      case "description":
        if (!String(value).trim()) return "Description is required";
        if (String(value).trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        if (String(value).trim().length > 500) {
          return "Description must be less than 500 characters";
        }
        return "";

      case "category":
        if (!value) return "Please select a category";
        if (!CATEGORIES.includes(value)) return "Invalid category selected";
        return "";

      case "quantity":
        if (value === "" || value === null || value === undefined) {
          return "Quantity is required";
        }
        if (isNaN(value)) return "Quantity must be a number";
        if (Number(value) < 0) return "Quantity cannot be negative";
        return "";

      case "unit":
        if (!value) return "Please select a unit";
        if (!UNITS.includes(value)) return "Invalid unit selected";
        return "";

      case "minimumStockLevel":
        if (value === "" || value === null || value === undefined) {
          return "Safety stock level is required";
        }
        if (isNaN(value)) return "Safety stock level must be a number";
        if (Number(value) < 0) return "Safety stock level cannot be negative";
        return "";

      case "pricePerUnit":
        if (value === "" || value === null || value === undefined) {
          return "Price per unit is required";
        }
        if (isNaN(value)) return "Price must be a number";
        if (Number(value) <= 0) return "Price must be greater than 0";
        return "";

      case "currency":
        if (!value) return "Currency is required";
        return "";

      case "harvestDate":
        if (
          value &&
          fullForm.expiryDate &&
          new Date(fullForm.expiryDate) <= new Date(value)
        ) {
          return "Harvest date must be before expiry date";
        }
        return "";

      case "expiryDate":
        if (
          value &&
          fullForm.harvestDate &&
          new Date(value) <= new Date(fullForm.harvestDate)
        ) {
          return "Expiry date must be after harvest date";
        }
        return "";

      case "location":
        if (String(value).trim().length > 100) {
          return "Location must be less than 100 characters";
        }
        return "";

      case "tags":
        if (String(value).length > 150) return "Tags are too long";
        return "";

      case "image":
        if (
          value &&
          typeof value === "string" &&
          value.length > 10 * 1024 * 1024
        ) {
          return "Image is too large";
        }
        return "";

      default:
        return "";
    }
  };

  const validate = (fullForm = form) => {
    const newErrors = {};

    Object.keys(fullForm).forEach((key) => {
      const error = validateField(key, fullForm[key], fullForm);
      if (error) newErrors[key] = error;
    });

    return newErrors;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };

    setForm(updatedForm);

    if (touched[name] || errors[name]) {
      const fieldError = validateField(name, updatedForm[name], updatedForm);

      setErrors((prev) => {
        const next = { ...prev };

        if (fieldError) next[name] = fieldError;
        else delete next[name];

        if (name === "harvestDate" || name === "expiryDate") {
          const otherField =
            name === "harvestDate" ? "expiryDate" : "harvestDate";
          const otherError = validateField(
            otherField,
            updatedForm[otherField],
            updatedForm
          );

          if (otherError) next[otherField] = otherError;
          else delete next[otherField];
        }

        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, form[name], form);

    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[name] = fieldError;
      else delete next[name];
      return next;
    });
  };

  const handleDateChange = (field, date) => {
    const formatted = date ? date.toISOString().split("T")[0] : "";
    const updatedForm = { ...form, [field]: formatted };

    setForm(updatedForm);
    setTouched((prev) => ({ ...prev, [field]: true }));

    setErrors((prev) => {
      const next = { ...prev };

      const fieldError = validateField(field, formatted, updatedForm);
      if (fieldError) next[field] = fieldError;
      else delete next[field];

      if (field === "harvestDate" || field === "expiryDate") {
        const otherField = field === "harvestDate" ? "expiryDate" : "harvestDate";
        const otherError = validateField(
          otherField,
          updatedForm[otherField],
          updatedForm
        );
        if (otherError) next[otherField] = otherError;
        else delete next[otherField];
      }

      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setTouched((prev) => ({ ...prev, image: true }));

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, or WEBP images are allowed",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      ...form,
      productName: form.productName.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      pricePerUnit: Number(form.pricePerUnit),
      minimumStockLevel: Number(form.minimumStockLevel),
      tags: form.tags
        ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : [],
      harvestDate: form.harvestDate || undefined,
      expiryDate: form.expiryDate || undefined,
      image: form.image || undefined,
      location: form.location.trim() || undefined,
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
    `w-full px-4 py-3.5 rounded-2xl border-2 transition-all outline-none text-sm font-bold ${errors[name]
      ? "border-red-300 bg-red-50/60 text-red-900 focus:border-red-400 focus:ring-4 focus:ring-red-100"
      : "border-gray-100 bg-white hover:border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-gray-700"
    }`;

  const labelClass =
    "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Product Name *</label>
          <input
            name="productName"
            value={form.productName}
            onChange={onChange}
            onBlur={handleBlur}
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
            onBlur={handleBlur}
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

      <div className="space-y-1">
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          onBlur={handleBlur}
          rows={3}
          placeholder="Detailed quality description helps buyers choose your produce..."
          className={`${inputClass("description")} resize-none`}
        />
        <FieldError name="description" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Quantity *</label>
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={onChange}
            onBlur={handleBlur}
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
            onBlur={handleBlur}
            className={inputClass("unit")}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u.toUpperCase()}
              </option>
            ))}
          </select>
          <FieldError name="unit" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Safety Stock Level *</label>
          <input
            name="minimumStockLevel"
            type="number"
            min="0"
            step="1"
            value={form.minimumStockLevel}
            onChange={onChange}
            onBlur={handleBlur}
            className={inputClass("minimumStockLevel")}
          />
          <FieldError name="minimumStockLevel" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Price Per Unit (LKR) *</label>
          <input
            name="pricePerUnit"
            type="number"
            min="0.01"
            step="0.01"
            value={form.pricePerUnit}
            onChange={onChange}
            onBlur={handleBlur}
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
            onBlur={handleBlur}
            className={inputClass("currency")}
          >
            <option value="LKR">LKR (Sri Lankan Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
          </select>
          <FieldError name="currency" />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Harvest Date</label>
          <DatePicker
            selected={form.harvestDate ? new Date(form.harvestDate) : null}
            onChange={(date) => handleDateChange("harvestDate", date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select harvest date"
            className={inputClass("harvestDate")}
            wrapperClassName="w-full"
            maxDate={form.expiryDate ? new Date(form.expiryDate) : null}
            showPopperArrow={false}
          />
          <FieldError name="harvestDate" />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Expiry Date</label>
          <DatePicker
            selected={form.expiryDate ? new Date(form.expiryDate) : null}
            onChange={(date) => handleDateChange("expiryDate", date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiry date"
            className={inputClass("expiryDate")}
            wrapperClassName="w-full"
            minDate={form.harvestDate ? new Date(form.harvestDate) : null}
            showPopperArrow={false}
          />
          <FieldError name="expiryDate" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass}>Storage/Location</label>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            onBlur={handleBlur}
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
                onChange={handleImageChange}
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
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <FieldError name="image" />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder="e.g. fresh, local, premium"
          className={inputClass("tags")}
        />
        <FieldError name="tags" />
      </div>

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
          <p className="text-[10px] text-emerald-600/60 font-medium">
            Toggle if this product is grown without chemicals.
          </p>
        </label>
      </div>

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
          {loading
            ? "Syncing..."
            : initialData
              ? "Update Harvest"
              : "Push to Market"}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;