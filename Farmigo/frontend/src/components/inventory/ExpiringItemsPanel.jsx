/**
 * ExpiringItemsPanel.jsx – Premium high-urgency expiry alerts.
 */
import { FaClock, FaCalendarTimes, FaBox } from "react-icons/fa";

const urgency = (days) => {
  if (days <= 0) return "bg-red-500 text-white border-red-500 shadow-sm shadow-red-200";
  if (days <= 2) return "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200";
  return "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200";
};

const ExpiringItemsPanel = ({ soon = [], expired = [] }) => {
  const total = soon.length + expired.length;

  if (total === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-inner">
           <FaClock className="text-emerald-500 text-xl" />
        </div>
        <p className="font-black text-gray-900 uppercase tracking-tight">Fresh Fields</p>
        <p className="text-xs text-gray-400 font-medium mt-1">No products are reaching their expiry date soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-amber-100 shadow-[0_10px_40px_rgba(245,158,11,0.05)] overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-amber-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
             <FaCalendarTimes />
          </div>
          <div>
            <h3 className="font-black text-amber-950 text-sm uppercase tracking-tight">
              Expiry Alerts
            </h3>
            <p className="text-[10px] text-amber-600/60 font-black uppercase tracking-widest">{total} actions required</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg shadow-sm shadow-amber-200">CRITICAL</span>
      </div>

      <div className="divide-y divide-amber-50/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {/* Expired Items First */}
        {expired.map((item) => (
          <div key={item._id} className="flex items-center justify-between px-8 py-5 bg-red-50/20 hover:bg-red-50/40 transition-all group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className="w-11 h-11 rounded-2xl bg-white border-2 border-red-50 p-1">
                 {item.image ? (
                   <img src={item.image} alt="" className="w-full h-full rounded-xl object-cover grayscale opacity-50" />
                 ) : (
                   <div className="w-full h-full rounded-xl bg-red-50 flex items-center justify-center text-red-500 font-black text-xs">!</div>
                 )}
               </div>
               <div className="min-w-0">
                 <p className="font-black text-red-900 text-sm truncate uppercase tracking-tight">{item.productName}</p>
                 <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Already Expired</p>
               </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border-2 ${urgency(0)}`}>
              EXPIRED
            </span>
          </div>
        ))}

        {/* Soon to Expire */}
        {soon.map((item) => {
          const days = item.daysUntilExpiry;
          return (
            <div key={item._id} className="flex items-center justify-between px-8 py-5 hover:bg-amber-50/20 transition-all group">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-500 transition-all">
                    <FaBox size={14} />
                 </div>
                 <div className="min-w-0 overflow-hidden">
                   <p className="font-black text-gray-900 text-sm truncate uppercase tracking-tight group-hover:text-amber-900">{item.productName}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-900 tracking-tight">
                    {item.quantity} {item.unit}
                  </p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                    Stock Rem.
                  </p>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border-2 ${urgency(days)}`}>
                  {days}D LEFT
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
