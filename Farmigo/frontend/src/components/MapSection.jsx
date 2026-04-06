import React from "react";
import { FaSnowflake, FaClock, FaCheckCircle, FaNetworkWired } from "react-icons/fa";

const cities = [
  { name: "Puttalam", x: 22, y: 35, color: "#71f66a", delay: "0s" },
  { name: "Anuradhapura", x: 45, y: 25, color: "#137f13", delay: "1.2s" },
  { name: "Polonnaruwa", x: 58, y: 38, color: "#71f66a", delay: "2.5s" },
  { name: "Dambulla", x: 48, y: 45, color: "#137f13", delay: "0.8s" },
  { name: "Kandy", x: 48, y: 62, color: "#71f66a", delay: "1.8s" },
  { name: "Nuwara Eliya", x: 52, y: 75, color: "#137f13", delay: "3.2s" },
  { name: "Badulla", x: 65, y: 68, color: "#71f66a", delay: "0.5s" },
  { name: "Ratnapura", x: 38, y: 82, color: "#137f13", delay: "2.1s" },
];

const MapSection = () => {
  return (
    <section className="w-full bg-[#0a0f0a] py-32 px-4 sm:px-8 relative overflow-hidden group">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left: Map Content */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 text-[#71f66a] mb-6 font-bold uppercase tracking-widest text-sm translate-x-1">
            <FaNetworkWired />
            <span>FARMIGO Intel Network</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
            Smart Storage <br />
            <span className="text-[#137f13]">Real-time Network.</span>
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-[500px]">
            Our proprietary algorithm connects you to the nearest, most optimized cold storage units across the island. Every pulse represents a hub for freshness and fair distribution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-[#71f66a]/50 flex flex-col items-center text-center">
              <FaSnowflake className="text-3xl text-[#71f66a] mb-4" />
              <p className="font-black text-white text-xl">150+</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Storage Hubs</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-[#71f66a]/50 flex flex-col items-center text-center">
              <FaClock className="text-3xl text-[#71f66a] mb-4" />
              <p className="font-black text-white text-xl">24/7</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Live Tracking</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-[#71f66a]/50 flex flex-col items-center text-center">
              <FaCheckCircle className="text-3xl text-[#71f66a] mb-4" />
              <p className="font-black text-white text-xl">99.9%</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Uptime Rate</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Dark Map Slider */}
        <div className="order-1 lg:order-2 relative bg-white/[0.02] border border-white/5 rounded-[40px] p-8 aspect-square flex items-center justify-center overflow-hidden">
          {/* Schematic Map Representation */}
          <div className="relative w-[320px] h-[550px] md:w-[400px] md:h-[650px] opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            {/* Outline (Simplified SVG structure for visual interest) */}
            <svg viewBox="0 0 100 150" className="w-full h-full stroke-[#444] fill-none stroke-[0.5]">
              <path d="M50 5 L70 30 L85 60 L80 100 L65 140 L35 140 L20 100 L15 60 L30 30 Z" className="opacity-20" />
            </svg>

            {/* Pulses */}
            {cities.map((city, i) => (
              <div
                key={i}
                className="absolute"
                style={{ top: `${city.y}%`, left: `${city.x}%` }}
              >
                {/* Outward Ring 1 */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[8px] animate-ping"
                  style={{ 
                    backgroundColor: city.color, 
                    width: '32px', 
                    height: '32px', 
                    animationDuration: '3s',
                    animationDelay: city.delay
                  }} 
                />
                {/* Outward Ring 2 */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#71f66a]/30 animate-pulse"
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    animationDuration: '4s',
                    animationDelay: city.delay
                  }} 
                />
                {/* Core Dot */}
                <div 
                  className="relative w-2.5 h-2.5 rounded-full shadow-[0_0_15px_rgba(113,246,106,1)] z-10 transition-transform duration-300 hover:scale-150 cursor-pointer peer"
                  style={{ backgroundColor: city.color }}
                />
                {/* City Label */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 transition-opacity duration-300 peer-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{city.name} HUB</p>
                </div>
              </div>
            ))}
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] z-10 pointer-events-none" />
          </div>
          
          {/* Floating HUD Badges */}
          <div className="absolute top-8 left-8 bg-[#137f13]/20 border border-[#71f66a]/30 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-2xl animate-fade-in">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
               <p className="text-[10px] font-black text-white uppercase tracking-widest">System Active</p>
             </div>
          </div>
        </div>

      </div>

      {/* Extreme Blur Glows */}
      <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] bg-[#1d9e1d]/5 blur-[200px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#71f66a]/5 blur-[200px] rounded-full" />
    </section>
  );
};

export default MapSection;
