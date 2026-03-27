import React, { useState } from "react";
import { FaChevronDown, FaLeaf, FaArrowRight } from "react-icons/fa";
const faqImage = "/faq.gif";

const faqData = [
  {
    question: "What is FARMIGO and how does it work?",
    answer:
      "FARMIGO is a platform that connects farmers, buyers, and cold storage providers. It helps users find nearby cold storages and purchase fresh, locally sourced produce directly from farms, promoting smarter agriculture and efficient distribution.",
  },
  {
    question: "How does FARMIGO help reduce food spoilage?",
    answer:
      "By linking farmers to the nearest available cold storage facilities, FARMIGO ensures perishable produce is preserved properly, minimizing spoilage and post-harvest losses.",
  },
  {
    question: "Is FARMIGO available in all regions?",
    answer:
      "FARMIGO is being launched in phases. While it's not yet available everywhere, you can enter your location on the platform to check availability in your region.",
  },
  {
    question: "How does FARMIGO support sustainability?",
    answer:
      "FARMIGO supports sustainability by promoting local food systems, reducing the distance food travels, cutting down on waste, and encouraging responsible storage and consumption practices.",
  },
  {
    question: "Can FARMIGO be used by cooperatives or farmer groups?",
    answer:
      "Yes, FARMIGO is designed to support both individual farmers and organized groups or cooperatives. It allows bulk listing of produce and shared access to nearby cold storages for streamlined operations.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="w-full relative py-12 md:py-24 px-4 sm:px-8 bg-[#f5f7fa]">
      <div className="w-full max-w-[1100px] mx-auto h-auto min-h-[500px] md:min-h-[700px] bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 relative">
        
        {/* Left Side (Image Panel) - Matching Contact Design */}
        <div className="hidden md:flex w-1/2 p-4">
          <div className="w-full h-full min-h-[500px] rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#eefaf0] to-[#f4f7f4]">
            {/* FAQ Illustration */}
            <img src={faqImage} alt='faq illustration' className="w-[85%] max-w-[420px] object-contain relative z-10 animate-float mix-blend-multiply" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#137f13]/10 to-transparent"></div>
            
            <div className="relative z-10 text-center mt-8">
              <h2 className="text-3xl font-black mb-2 text-[#137f13]">Got Questions?</h2>
              <p className="text-gray-600 font-medium">Find answers to the most commonly asked questions about FARMIGO.</p>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ccff00]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#137f13]/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Side (FAQ Content) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 flex flex-col justify-center bg-white relative">
          <div className="max-w-[480px] w-full mx-auto">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-8">
              <FaLeaf className="text-3xl text-[#137f13]" />
              <span className="text-2xl font-black tracking-tight text-gray-900">FARMIGO</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Most Asked Questions</h2>
            <p className="text-gray-500 mb-8">Everything you need to know about our platform and how we help farmers thrive.</p>

            <div className="space-y-4">
              {faqData.map((item, index) => {
                const isOpen = activeIndex === index;
                return (
                  <div
                    key={index}
                    className={`group transition-all duration-300 border-b border-gray-100 last:border-0 pb-4`}
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                    >
                      <span className={`font-bold text-sm md:text-base pr-4 transition-colors ${isOpen ? "text-[#137f13]" : "text-gray-800 group-hover:text-[#137f13]"}`}>
                        {item.question}
                      </span>
                      <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#137f13] text-white rotate-180" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
                        <FaChevronDown className="text-xs" />
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                    >
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Still have questions?</h4>
                <p className="text-xs text-gray-500">We're here to help you 24/7</p>
              </div>
              <a href="#contact" className="w-10 h-10 rounded-full bg-[#1c2a1c] hover:bg-[#121c12] text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <FaArrowRight className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative patterns matching other pages */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: floating 3s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};

export default Faq;
