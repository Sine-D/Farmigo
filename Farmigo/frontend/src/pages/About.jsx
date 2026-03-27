import React from 'react';
import aboutImg from '../assets/images/about1.png';
import aboutCardImg from "../assets/images/about2..png";
import { FaLeaf, FaSeedling, FaRecycle } from 'react-icons/fa';

const stats = [
  { label: "Farmers Empowered", value: "3,000+" },
  { label: "Cold Storages", value: "150+" },
  { label: "Tonnes Saved", value: "50T+" },
];

const About = () => {
  return (
    <section id="about" className="w-full py-24 px-4 sm:px-8 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-2 mb-4">
          <FaLeaf className="text-[#137f13]" />
          <span className="text-sm font-bold uppercase tracking-widest text-[#137f13]">Who We Are</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 items-center">

          {/* Left: Image Block */}
          <div className="relative w-full lg:w-1/2 flex-shrink-0">
            <div className="rounded-[32px] overflow-hidden shadow-2xl">
              <img src={aboutImg} alt="About Farmigo" className="w-full h-[320px] md:h-[480px] object-cover" />
            </div>

            {/* Floating overlay card */}
            <div className="absolute -bottom-6 -right-2 md:right-[-30px] bg-white rounded-[20px] shadow-2xl p-1.5 md:p-2 w-[140px] md:w-[180px] border border-gray-100">
              <img src={aboutCardImg} alt="About Card" className="w-full rounded-[14px] object-cover" />
            </div>

            {/* Stat chips */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-1.5 shadow-md flex items-center gap-2 border border-white">
                  <span className="text-[#137f13] font-black text-xs md:text-sm">{s.value}</span>
                  <span className="text-gray-500 text-[10px] md:text-xs font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text Block */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
              Bridging Farms to<br />
              <span className="text-[#137f13]">Markets & Storage</span>
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-4">
              Welcome to <strong className="text-gray-800">FARMIGO</strong> — your trusted partner in connecting rural producers with cold storage and fresh markets. Whether you're a farmer, health-conscious buyer, or sustainability champion, FARMIGO is built for you.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              We believe in smarter agriculture and better food distribution. Locate nearby cold storage, reduce spoilage, and shop organic goods at fair prices — all while supporting rural livelihoods.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: <FaSeedling />, label: "Farm Direct" },
                { icon: <FaRecycle />, label: "Zero Waste" },
                { icon: <FaLeaf />, label: "100% Organic" },
              ].map((tag, i) => (
                <span key={i} className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#137f13] font-semibold text-sm px-4 py-2 rounded-full">
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
