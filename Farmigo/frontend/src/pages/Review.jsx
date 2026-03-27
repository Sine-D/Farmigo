import React, { useState, useEffect, useRef } from "react";
import shreya from "../assets/images/review1.png";
import john from "../assets/images/review2.png";
import michael from "../assets/images/review3.png";
import aarti from "../assets/images/review4.png";
import ravi from "../assets/images/review5.png";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Kusuma Perera",
    role: "Farmer, Anuradhapura",
    image: shreya,
    stars: 5,
    text: "FARMIGO has made it incredibly easy for me to store my produce safely. I can now locate cold storage near my farm instantly, reducing spoilage and increasing profits!",
  },
  {
    name: "Nimal Siriwardena",
    role: "Health-conscious Buyer, Colombo",
    image: john,
    stars: 5,
    text: "As a health-conscious buyer, I love that FARMIGO connects me directly with local farmers. The groceries are fresh, organic, and fairly priced — plus I'm supporting rural livelihoods!",
  },
  {
    name: "Kamal Gunaratne",
    role: "Cooperative Manager, Kandy",
    image: michael,
    stars: 5,
    text: "Managing our farmers' cooperative has become so efficient with FARMIGO. We can find shared storage and coordinate fresh deliveries with just a few clicks. Brilliant initiative!",
  },
  {
    name: "Anula Rathnayake",
    role: "Self-Help Group Leader, Matara",
    image: aarti,
    stars: 5,
    text: "I've started recommending FARMIGO to all the women in our self-help group. It makes cold storage and market access easier and safer for all of us!",
  },
  {
    name: "Upul Shantha",
    role: "Small Farmer, Nuwara Eliya",
    image: ravi,
    stars: 5,
    text: "With FARMIGO, I've been able to sell directly to customers and save money on transport. It's empowering for small farmers like me!",
  },
];

const FARMIGOReviewSection = () => {
  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p === 0 ? reviews.length - 1 : p - 1));
  const next = () => setActive((p) => (p === reviews.length - 1 ? 0 : p + 1));

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);

  const getCard = (offset) => {
    const idx = (active + offset + reviews.length) % reviews.length;
    return { review: reviews[idx], idx };
  };

  return (
    <section id="review" className="w-full py-24 px-4 sm:px-8 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#f0fdf4] border border-[#bbf7d0] text-[#137f13] text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Trusted by farmers, buyers, and cooperatives alike — FARMIGO makes local sourcing, storage, and food access simpler.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-6">

          {/* Prev Nav */}
          <button
            onClick={prev}
            className="hidden md:flex w-12 h-12 rounded-full border-2 border-gray-200 items-center justify-center text-gray-500 hover:border-[#137f13] hover:text-[#137f13] transition-colors flex-shrink-0 z-10"
          >
            <FaChevronLeft />
          </button>

          {/* Cards */}
          <div className="flex items-center justify-center gap-6 w-full">

            {/* Side card left */}
            <div className="hidden lg:block w-[280px] flex-shrink-0 opacity-50 scale-90 transition-all duration-500">
              <ReviewCard review={getCard(-1).review} muted />
            </div>

            {/* Main card */}
            <div className="w-full max-w-[440px] flex-shrink-0 transition-all duration-500">
              <ReviewCard review={reviews[active]} featured />
            </div>

            {/* Side card right */}
            <div className="hidden lg:block w-[280px] flex-shrink-0 opacity-50 scale-90 transition-all duration-500">
              <ReviewCard review={getCard(1).review} muted />
            </div>

          </div>

          {/* Next Nav */}
          <button
            onClick={next}
            className="hidden md:flex w-12 h-12 rounded-full border-2 border-gray-200 items-center justify-center text-gray-500 hover:border-[#137f13] hover:text-[#137f13] transition-colors flex-shrink-0 z-10"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500">
            <FaChevronLeft />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500">
            <FaChevronRight />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "w-8 h-2 bg-[#137f13]" : "w-2 h-2 bg-gray-300"}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

const ReviewCard = ({ review, featured, muted }) => (
  <div className={`bg-white rounded-[28px] p-5 md:p-8 border transition-all duration-300 ${featured ? "border-[#bbf7d0] shadow-2xl" : "border-gray-100 shadow-md"}`}>
    {/* Stars */}
    <div className="flex gap-1 mb-5">
      {Array.from({ length: review.stars }).map((_, i) => (
        <FaStar key={i} className="text-amber-400 text-xs md:text-sm" />
      ))}
    </div>

    {/* Quote */}
    <p className={`leading-relaxed mb-6 ${featured ? "text-gray-700 text-sm md:text-base" : "text-gray-500 text-[11px] md:text-sm"} line-clamp-4`}>
      "{review.text}"
    </p>

    {/* Reviewer */}
    <div className="flex items-center gap-3">
      <img
        src={review.image}
        alt={review.name}
        className={`rounded-full object-cover border-2 border-[#bbf7d0] ${featured ? "w-10 h-10 md:w-12 md:h-12" : "w-8 h-8 md:w-10 md:h-10"}`}
      />
      <div>
        <p className="font-bold text-gray-900 text-xs md:text-sm">{review.name}</p>
        <p className="text-[10px] md:text-xs text-gray-400">{review.role}</p>
      </div>
    </div>
  </div>
);

export default FARMIGOReviewSection;
