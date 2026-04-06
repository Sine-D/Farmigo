import React from "react";
import mainImage from "../assets/images/home1.png";
import sideImage1 from "../assets/images/home2.png";
import sideImage2 from "../assets/images/home3.png";
import { FaLeaf, FaSnowflake, FaStore, FaUsers } from "react-icons/fa";

const stats = [
  { icon: <FaSnowflake />, value: "150+", label: "Cold Storages", bg: "bg-blue-50", text: "text-blue-500" },
  { icon: <FaUsers />,     value: "3k+",  label: "Farmers",       bg: "bg-green-50", text: "text-[#137f13]" },
  { icon: <FaStore />,     value: "50+",  label: "Products",      bg: "bg-amber-50", text: "text-amber-500" },
];

const Home = () => {
  return (
    <section id="hero-content" className="w-full py-24 px-4 sm:px-8 bg-white relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f0fdf4] blur-[120px] rounded-full -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-14 relative z-10">

        {/* Left: Hero Text */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#137f13] text-sm font-bold px-4 py-1.5 rounded-full mb-6 self-start animate-fade-in">
            <FaLeaf className="text-xs" /> Fresh &amp; Local
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6 animate-slide-up">
            Connecting Cold Storages.<br />
            Empowering Farmers.{" "}
            <span className="text-[#137f13]">Naturally.</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10 max-w-[480px] animate-slide-up animation-delay-200">
            FARMIGO bridges the gap between rural producers and cold storage facilities. Shop fresh groceries and support local farming with our smart logistics network.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 ${s.bg} rounded-2xl px-4 py-3 md:px-5 md:py-4 border border-white shadow-sm flex-1 min-w-[140px] md:flex-none`}
              >
                <div className={`text-xl ${s.text}`}>{s.icon}</div>
                <div>
                  <p className="font-black text-gray-900 text-lg md:text-xl leading-none">{s.value}</p>
                  <p className="text-gray-500 text-[10px] md:text-xs font-medium mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hero Images */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4 items-start">
          {/* Main image */}
          <div className="relative flex-1 w-full animate-float" style={{ animationDuration: '4s' }}>
            <div className="rounded-[28px] overflow-hidden shadow-2xl relative group">
              <img src={mainImage} alt="Main Farm" className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-5 py-2 shadow-xl border border-white flex items-center gap-2 whitespace-nowrap z-20 animate-bounce-slow">
              <span className="text-lg">🌾</span>
              <span className="font-bold text-gray-800 text-sm">100% Organic</span>
            </div>
          </div>

          {/* Side images */}
          <div className="hidden sm:flex flex-col gap-4 w-full sm:w-[45%]">
            <div className="rounded-[22px] overflow-hidden shadow-xl animate-float" style={{ animationDelay: '0.5s', animationDuration: '5s' }}>
              <img src={sideImage1} alt="Farm 2" className="w-full h-[190px] md:h-[240px] object-cover" />
            </div>
            <div className="rounded-[22px] overflow-hidden shadow-xl animate-float" style={{ animationDelay: '1s', animationDuration: '6s' }}>
              <img src={sideImage2} alt="Farm 3" className="w-full h-[190px] md:h-[240px] object-cover" />
            </div>
          </div>
        </div>

      </div>

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0px); }
          50% { transform: translate(-50%, -10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}} />
    </section>
  );
};

export default Home;
