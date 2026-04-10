/**
 * ExpiringItemsPanel.jsx – Shows items expiring soon from /alerts/expiring
 */
import { FaClock } from "react-icons/fa";

const urgency = (days) => {
  if (days <= 0) return "bg-red-100 text-red-700 border-red-200";
  if (days <= 2) return "bg-red-100 text-red-700 border-red-200";
  if (days <= 4) return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
};

const ExpiringItemsPanel = ({ data }) => {
  const soonItems = data?.soonToExpire?.items || [];
  const expiredItems = data?.alreadyExpired?.items || [];
  const total = soonItems.length + expiredItems.length;

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="text-4xl mb-2">🟢</div>
        <p className="font-semibold text-gray-700">No expiry concerns</p>
        <p className="text-xs text-gray-400 mt-1">No items expiring within 7 days</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 bg-orange-50 px-5 py-4 border-b border-orange-100">
        <FaClock className="text-orange-500" />
        <h3 className="font-bold text-orange-800 text-sm">
          Expiry Alerts ({total} items)
        </h3>
      </div>

      {expiredItems.length > 0 && (
        <div className="px-5 py-2 bg-red-50 border-b border-red-100">
          <p className="text-xs font-bold text-red-600">
            ❌ Already Expired ({expiredItems.length})
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {[...expiredItems.map(i => ({ ...i, daysUntilExpiry: -1 })), ...soonItems].map((item) => {
          const days = item.daysUntilExpiry;
          return (
            <div key={item._id} className="flex items-center justify-between px-5 py-3 hover:bg-orange-50/30 transition-colors">
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.productName}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Qty: <strong>{item.quantity} {item.unit}</strong>
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${urgency(days)}`}>
                  {days <= 0 ? "EXPIRED" : `${days}d left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpiringItemsPanel;
