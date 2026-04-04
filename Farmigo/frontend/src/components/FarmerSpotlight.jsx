import React from 'react';
import { FaLeaf, FaArrowRight, FaQuoteLeft } from "react-icons/fa";

const farmerImg = "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2400&auto=format&fit=crop";

const FarmerSpotlight = () => {
  return (
    <section className="w-full bg-[#1c2a1c] py-24 px-4 sm:px-8 overflow-hidden relative">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-14">
        
        {/* Left: Cinematic Image */}
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#137f13]/40 to-transparent z-10 rounded-[40px]" />
          <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
            <img 
              src={farmerImg} 
              alt="Farmer Spotlight" 
              className="w-full h-[500px] md:h-[650px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          {/* Floating Bio Card */}
          <div className="absolute -bottom-8 -right-4 md:right-8 bg-white/95 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl border border-white/20 z-20 max-w-[240px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#137f13] flex items-center justify-center text-white shrink-0">
                <FaLeaf />
              </div>
              <div>
                <h4 className="font-black text-gray-900 leading-tight">Dhammika Bandara</h4>
                <p className="text-[#137f13] text-xs font-bold uppercase tracking-wider">Cinnamon Farmer</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm italic leading-relaxed">
              "FARMIGO connected me to cold storage facilities I never knew existed. Now I can wait for better prices."
            </p>
          </div>
        </div>

        {/* Right: Testimonial & Value Prop */}
        <div className="w-full lg:w-1/2 text-white">
          <div className="flex items-center gap-3 mb-6 text-[#71f66a]">
            <FaQuoteLeft className="text-4xl opacity-50" />
            <span className="font-bold uppercase tracking-widest text-sm">Farmer Success Story</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            "FARMIGO changed the way I look at <span className="text-[#71f66a]">Freshness & Profit.</span>"
          </h2>
          
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-[540px]">
            Before FARMIGO, most of my harvest would spoil if the markets were down. Today, I use the smart storage network to preserve my crops and sell them directly to buyers across the country. It's not just a platform; it's a lifeline for my family.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
              <p className="text-3xl font-black text-[#71f66a] mb-1">40% ↑</p>
              <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Revenue Increase</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
              <p className="text-3xl font-black text-[#71f66a] mb-1"> Zero</p>
              <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Harvest Spoiled</p>
            </div>
          </div>

        </div>

      </div>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#71f66a]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#137f13]/10 blur-[120px] rounded-full" />
    </section>
  );
};

export default FarmerSpotlight;
