/**
 * LowStockPanel.jsx – Displays low-stock alerts for the management dashboard.
 */
import { FaExclamationTriangle } from "react-icons/fa";
import { urgencyColor, formatCurrency } from "../../utils/formatters";

const LowStockPanel = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <p className="font-semibold text-gray-700">All items adequately stocked</p>
        <p className="text-xs text-gray-400 mt-1">No low-stock alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 bg-amber-50 px-5 py-4 border-b border-amber-100">
        <FaExclamationTriangle className="text-amber-500" />
        <h3 className="font-bold text-amber-800 text-sm">
          Low Stock Alerts ({items.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/40 transition-colors">
            <div className="flex-1 min-w-0 mr-3">
              <p className="font-semibold text-gray-800 text-sm truncate">{item.productName}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </div>

            <div className="text-right flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  <span className="font-bold text-amber-600">{item.quantity}</span>
                  {" / "}
                  <span className="text-gray-400">{item.minimumStockLevel} {item.unit}</span>
                </p>
                <p className="text-[10px] text-red-500 font-semibold">
                  Deficit: {item.deficit || (item.minimumStockLevel - item.quantity)}
                </p>
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full border ${urgencyColor(item.urgencyLevel)}`}
              >
                {item.urgencyLevel || "LOW"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockPanel;
