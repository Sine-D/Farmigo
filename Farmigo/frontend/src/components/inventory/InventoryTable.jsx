/**
 * InventoryTable.jsx – Premium data table for the FARMIGO Dashboard.
 */
import {
  FaEdit,
  FaTrash,
  FaUndo,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaLeaf,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import {
  formatCurrency,
  getStockStatus,
  categoryConfig,
} from "../../utils/formatters";

const SortIcon = ({ field, sortBy, order }) => {
  if (sortBy !== field) {
    return <FaSort className="opacity-20 text-[10px]" />;
  }

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
    { key: "productName", label: "Product Listing" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Inventory" },
    { key: "pricePerUnit", label: "Market Price" },
    { key: "isActive", label: "Listing Status" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-emerald-50 shadow-sm border-dashed">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
          🌱
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">
          Your fields are empty!
        </h4>
        <p className="text-sm text-gray-400 font-medium">
          Start adding listings to your farm inventory to reach buyers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap ${col.sortable !== false
                      ? "cursor-pointer select-none hover:text-emerald-600 transition-all"
                      : ""
                    }`}
                  onClick={() =>
                    col.sortable !== false && onSort && onSort(col.key)
                  }
                >
                  <span className="flex items-center gap-2">
                    {col.label}
                    {col.sortable !== false && (
                      <SortIcon field={col.key} sortBy={sortBy} order={order} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {items.map((item) => {
              const stock = getStockStatus(
                item.quantity,
                item.minimumStockLevel
              );
              const cat =
                categoryConfig[item.category] || categoryConfig.other;

              return (
                <tr
                  key={item._id}
                  className={`group transition-all duration-300 hover:bg-emerald-50/20 ${!item.isActive ? "bg-gray-50/50" : ""
                    }`}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110">
                            {cat.emoji}
                          </div>
                        )}

                        {!item.isActive && (
                          <div className="absolute inset-0 bg-gray-500/20 rounded-2xl backdrop-blur-[1px] flex items-center justify-center">
                            <FaBan className="text-white text-xs drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`font-black tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors ${!item.isActive ? "text-gray-400" : ""
                            }`}
                        >
                          {item.productName}
                        </p>

                        {item.isOrganic && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                            <FaLeaf size={8} /> Organic Certified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100/50 text-xs font-bold text-gray-600 border border-transparent group-hover:border-emerald-100 transition-all">
                      <span className="text-sm grayscale-[0.5] group-hover:grayscale-0 transition-all">
                        {cat.emoji}
                      </span>
                      {cat.label}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <p className="text-sm font-black text-gray-900">
                        {item.quantity}{" "}
                        <span className="text-gray-400 font-bold text-[10px] uppercase">
                          {item.unit}
                        </span>
                      </p>

                      <div
                        className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${stock.badge}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {stock.label}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="space-y-0.5">
                      <p className="text-lg font-black text-emerald-700 tracking-tight">
                        {formatCurrency(item.pricePerUnit, item.currency)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        per {item.unit}
                      </p>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    {item.isActive ? (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm">
                        <FaCheckCircle className="text-xs" /> Marketplace Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 bg-gray-100 border border-gray-200 px-4 py-2 rounded-2xl uppercase tracking-widest">
                        <FaBan className="text-xs" /> Inactive / Draft
                      </span>
                    )}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEdit(item)}
                        className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-blue-200 hover:-translate-y-1 active:scale-95"
                        title="Edit Listing"
                        type="button"
                      >
                        <FaEdit size={14} />
                      </button>

                      {item.isActive ? (
                        <button
                          onClick={() => onDelete(item)}
                          className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-red-200 hover:-translate-y-1 active:scale-95"
                          title="Deactivate Listing"
                          type="button"
                        >
                          <FaTrash size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRestore(item)}
                          className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-emerald-200 hover:-translate-y-1 active:scale-95"
                          title="Restore Listing"
                          type="button"
                        >
                          <FaUndo size={14} />
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
    </div>
  );
};

export default InventoryTable;