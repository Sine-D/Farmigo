/**
 * StockHistoryPanel.jsx – Displays recent stock movements from /history/my
 */
import { FaHistory } from "react-icons/fa";
import { changeTypeBadge } from "../../utils/formatters";

const StockHistoryPanel = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <FaHistory className="text-3xl text-gray-300 mx-auto mb-2" />
        <p className="font-semibold text-gray-500">No stock history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 bg-gray-50 px-5 py-4 border-b border-gray-100">
        <FaHistory className="text-gray-500" />
        <h3 className="font-bold text-gray-700 text-sm">Recent Stock Activity</h3>
      </div>

      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {history.slice(0, 20).map((entry) => {
          const badge = changeTypeBadge[entry.changeType] || changeTypeBadge.UPDATED;
          const isPositive = entry.changeAmount > 0;
          return (
            <div key={entry._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className} whitespace-nowrap`}>
                {badge.label}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{entry.productName}</p>
                {entry.note && (
                  <p className="text-xs text-gray-400 truncate">{entry.note}</p>
                )}
              </div>

              <div className="text-right">
                <p className={`text-sm font-black ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                  {isPositive ? "+" : ""}{entry.changeAmount} {entry.unit}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString("en-LK", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockHistoryPanel;
