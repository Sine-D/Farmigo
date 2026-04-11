/**
 * LowStockPanel.jsx – Premium high-impact low-stock alerts.
 */
import { FaExclamationTriangle, FaBox } from "react-icons/fa";
import { urgencyColor } from "../../utils/formatters";

const LowStockPanel = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-inner">
          <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center">
             <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <p className="font-black text-gray-900 uppercase tracking-tight">Stock Healthy</p>
        <p className="text-xs text-gray-400 font-medium mt-1">All your products are adequately stocked.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-[0_10px_40px_rgba(249,115,22,0.05)] overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-orange-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
             <FaExclamationTriangle />
          </div>
          <div>
            <h3 className="font-black text-orange-950 text-sm uppercase tracking-tight">
              Low Stock Alerts
            </h3>
            <p className="text-[10px] text-orange-600/60 font-black uppercase tracking-widest">{items.length} items need attention</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg shadow-sm shadow-orange-200">URGENT</span>
      </div>

      <div className="divide-y divide-orange-50/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between px-8 py-5 hover:bg-orange-50/20 transition-all group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-all">
                  <FaBox size={14} />
               </div>
               <div className="min-w-0 overflow-hidden">
                 <p className="font-black text-gray-900 text-sm truncate uppercase tracking-tight group-hover:text-orange-900">{item.productName}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
               </div>
            </div>

            <div className="text-right flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 tracking-tight">
                  <span className="text-orange-600">{item.quantity}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span className="text-gray-400 text-xs font-bold">{item.minimumStockLevel}</span>
                </p>
                <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-0.5">
                  -{item.deficit || (item.minimumStockLevel - item.quantity)} {item.unit}
                </p>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border-2 ${urgencyColor(item.urgencyLevel)} shadow-sm`}
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
