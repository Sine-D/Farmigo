import React, { useState } from 'react';
import { FaPaperPlane, FaLeaf, FaTimes } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="w-full py-24 px-4 sm:px-8 bg-white overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto relative group">
        
        {/* The Glass Container */}
        <div className="relative z-10 p-10 md:p-16 rounded-[48px] overflow-hidden bg-gradient-to-br from-[#137f13]/5 to-[#71f66a]/5 border border-[#137f13]/10 backdrop-blur-3xl shadow-2xl flex flex-col items-center text-center">
          
          {/* Animated Glows inside the Card */}
          <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#71f66a]/15 blur-[100px] rounded-full animate-pulse transition-transform duration-[5s]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#137f13]/10 blur-[100px] rounded-full animate-pulse transition-transform duration-[8s]" />

          <div className="relative z-20 max-w-[700px] w-full">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto mb-8 animate-bounce transition-transform duration-2000">
               <FaLeaf className="text-3xl text-[#137f13]" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
              Join the <span className="text-[#137f13]">Freshness Revolution.</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium mb-12 max-w-[500px] mx-auto">
              Get the latest insights on cold storage tips, market demand trends, and fresh farm listings delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative w-full max-w-[540px] mx-auto">
              <div className={`relative transition-all duration-300 ${subscribed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   placeholder="Enter your email address" 
                   className="w-full bg-white/50 backdrop-blur-md border border-gray-200 focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 p-5 pr-16 md:p-6 md:pr-20 rounded-full font-bold text-gray-800 placeholder-gray-400 outline-none transition-all shadow-lg"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#137f13] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#137f13]/30"
                >
                  <FaPaperPlane className="text-xl translate-x-[2px] -translate-y-[1px]" />
                </button>
              </div>

              {/* Success Feedback Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 rounded-full bg-[#137f13] text-white font-black overflow-hidden shadow-2xl ${subscribed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                 <div className="flex items-center gap-3 animate-slide-up">
                    <span className="text-xl">Welcome to the family! 🌱</span>
                 </div>
              </div>
            </form>
            
            {/* Disclaimer */}
            <p className="mt-8 text-xs text-gray-400 font-bold tracking-widest uppercase">We respect your privacy. No spam, only freshness. Guaranteed.</p>
          </div>
        </div>

        {/* Outer Cinematic Elements */}
        <div className="absolute top-0 right-[-10vw] w-[40vw] h-[40vw] bg-[#137f13]/5 blur-[200px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-[-10vw] w-[30vw] h-[30vw] bg-[#71f66a]/5 blur-[150px] -z-10 rounded-full" />
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease forwards; }
      `}</style>
    </section>
  );
};

export default Newsletter;
