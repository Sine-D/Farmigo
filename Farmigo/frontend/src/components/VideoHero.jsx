import React from "react";

const VideoHero = () => {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center z-[1] select-none">
      <video
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover -z-[1]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0" />
      
      {/* Floating UI Elements */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col items-center text-center mt-20">
        
        {/* Top badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
          <span className="text-white text-xs font-bold uppercase tracking-widest">Next-Gen Agricultural Platform</span>
        </div>

        {/* Main Heading Text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-tight drop-shadow-2xl">
          Cultivate Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#137f13]">Digital Harvest.</span>
        </h1>

        <p className="text-white/80 font-medium text-lg md:text-xl max-w-2xl mb-12 leading-relaxed drop-shadow-lg">
          Connect directly with markets, optimize your supply chain with cold storage, and harness data-driven farming insights all in one place.
        </p>

      </div>

      {/* Floating Glass Stats (Bottom) */}
      <div className="absolute bottom-10 left-0 right-0 z-10 hidden md:block">
        <div className="container mx-auto px-8">
           <div className="flex items-center justify-between gap-6 max-w-4xl mx-auto">
             
             <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1 hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <p className="text-[#ccff00] text-3xl font-black mb-1 drop-shadow-md">12k+</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Farmers</p>
             </div>

             <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1 hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <p className="text-[#ccff00] text-3xl font-black mb-1 drop-shadow-md">4.8T</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Monthly Trade Vol</p>
             </div>

             <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1 hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <p className="text-[#ccff00] text-3xl font-black mb-1 drop-shadow-md">98%</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Less Spoilage</p>
             </div>

           </div>
        </div>
      </div>

    </section>
  );
};

export default VideoHero;
