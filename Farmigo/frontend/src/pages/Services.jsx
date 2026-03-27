import React from 'react';
import { FaSnowflake, FaShoppingBasket, FaHandsHelping } from 'react-icons/fa';

// Importing service images
import storageImg from '../assets/images/storage.png';
import marketImg from '../assets/images/market.svg';
import supportImg from '../assets/images/support.png';

const services = [
  {
    title: "Nearby Cold Storage",
    description: "Locate the closest cold storage to keep your harvest fresh and reduce wastage significantly.",
    image: storageImg,
    icon: <FaSnowflake className="text-2xl" />,
    color: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100 text-blue-600",
    accent: "#0ea5e9",
  },
  {
    title: "Grocery Marketplace",
    description: "Sell or buy farm-fresh groceries directly from local farmers and vendors at fair prices.",
    image: marketImg,
    icon: <FaShoppingBasket className="text-2xl" />,
    color: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100 text-green-600",
    accent: "#137f13",
  },
  {
    title: "Farmer Support",
    description: "Access expert advice, weather updates, and government schemes to maximise your productivity.",
    image: supportImg,
    icon: <FaHandsHelping className="text-2xl" />,
    color: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100 text-amber-600",
    accent: "#d97706",
  },
];

const Services = () => {
  return (
    <section className="w-full py-24 px-4 sm:px-8 bg-[#f9fafb]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#f0fdf4] border border-[#bbf7d0] text-[#137f13] text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Our Core Services
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Everything you need to connect, store, sell, and thrive — all in one platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${service.color} rounded-[28px] p-6 md:p-8 border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>

              {/* Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-[100px] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <h3 className="text-xl font-black text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
