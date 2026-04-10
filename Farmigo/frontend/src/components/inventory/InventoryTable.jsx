/**
 * InventoryTable.jsx – Data table for farmer/admin inventory management.
 * Features: sort, filter, actions (edit/delete/restore).
 */
import { useState } from "react";
import {
  FaEdit, FaTrash, FaUndo, FaSort, FaSortUp, FaSortDown,
  FaLeaf, FaCheckCircle, FaBan,
} from "react-icons/fa";
import { formatCurrency, getStockStatus, categoryConfig } from "../../utils/formatters";

const SortIcon = ({ field, sortBy, order }) => {
  if (sortBy !== field) return <FaSort className="text-gray-300 text-[10px]" />;
  return order === "asc" ? (
    <FaSortUp className="text-emerald-500 text-[10px]" />
  ) : (
    <FaSortDown className="text-emerald-500 text-[10px]" />
  );
};

const InventoryTable = ({
  items = [],
  onEdit,
  onDelete,
  onRestore,
  sortBy,
  order,
  onSort,
}) => {
  const cols = [
    { key: "productName", label: "Product" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Stock" },
    { key: "pricePerUnit", label: "Price" },
    { key: "isActive", label: "Status" },
    { key: "createdAt", label: "Added" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📦</div>
        <p className="font-bold text-gray-600">No inventory items found</p>
        <p className="text-sm text-gray-400 mt-1">Add a new item or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap ${
                  col.sortable !== false ? "cursor-pointer select-none hover:text-emerald-700 transition-colors" : ""
                }`}
                onClick={() => col.sortable !== false && onSort && onSort(col.key)}
              >
                <span className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable !== false && (
                    <SortIcon field={col.key} sortBy={sortBy} order={order} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-50">
          {items.map((item) => {
            const stock = getStockStatus(item.quantity, item.minimumStockLevel);
            const cat = categoryConfig[item.category] || categoryConfig.other;

            return (
              <tr
                key={item._id}
                className={`hover:bg-emerald-50/30 transition-colors ${!item.isActive ? "opacity-60" : ""}`}
              >
                {/* Product */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  <div className="flex items-center gap-2.5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-base flex-shrink-0">
                        {cat.emoji}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                      {item.isOrganic && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <FaLeaf className="text-[8px]" /> Organic
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold text-gray-600 capitalize">
                    {cat.emoji} {cat.label}
                  </span>
                </td>

                {/* Stock */}
                <td className="px-4 py-3.5">
                  <div>
                    <p className="font-bold text-gray-800">
                      {item.quantity} <span className="text-gray-400 font-normal">{item.unit}</span>
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stock.badge}`}>
                      {stock.label}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3.5 font-bold text-emerald-700">
                  {formatCurrency(item.pricePerUnit, item.currency)}
                  <span className="text-gray-400 font-normal text-xs">/{item.unit}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  {item.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <FaCheckCircle className="text-[10px]" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <FaBan className="text-[10px]" /> Inactive
                    </span>
                  )}
                </td>

                {/* Added date */}
                <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString("en-LK", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-inv-${item._id}`}
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    {item.isActive ? (
                      <button
                        id={`delete-inv-${item._id}`}
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Deactivate"
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <button
                        id={`restore-inv-${item._id}`}
                        onClick={() => onRestore(item)}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Restore"
                      >
                        <FaUndo />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
