import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#71717a"];

const InventoryAnalytics = ({ items, stats }) => {
  // 1. Prepare data for Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    return (stats?.byCategory || []).map(cat => ({
      name: cat._id?.charAt(0).toUpperCase() + cat._id?.slice(1) || "Other",
      value: cat.count
    }));
  }, [stats]);

  // 2. Prepare data for Price Benchmark (Bar Chart)
  // We'll compare average farmer price per category vs a hypothetical market baseline
  const priceData = useMemo(() => {
    return (stats?.byCategory || []).map(cat => {
      const avgPrice = cat.avgPrice || 0;
      // For demo purposes, we simulate a market baseline roughly +/- 10%
      const marketBaseline = avgPrice * (0.9 + Math.random() * 0.2);
      
      return {
        name: cat._id?.charAt(0).toUpperCase() + cat._id?.slice(1) || "Other",
        YourPrice: Number(avgPrice.toFixed(2)),
        MarketAvg: Number(marketBaseline.toFixed(2))
      };
    }).slice(0, 5); // Show top 5 categories
  }, [stats]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 outline-none">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8 mb-1">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="text-sm font-black text-gray-900">
                LKR {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Category Distribution */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inventory Mix</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stock items by category</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            📊
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Price Benchmark</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Price vs Market Average</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            📈
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Bar dataKey="YourPrice" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} name="Your Price" />
              <Bar dataKey="MarketAvg" fill="#e5e7eb" radius={[6, 6, 0, 0]} barSize={20} name="Market Avg" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
