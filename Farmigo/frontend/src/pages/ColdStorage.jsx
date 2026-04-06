import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaStar, FaSnowflake, FaFilter } from 'react-icons/fa';
import img from "../assets/images/map-placeholder.jpg";

const coldStorages = [
  { id: 1, name: "GreenCold Storage",        location: "Pune, Maharashtra",    distance: "5km",  capacity: "50 tonnes",  contact: "+91 9876543210", rating: 4.5, price: "₹200/tonne/day" },
  { id: 2, name: "AgriFresh Solutions",       location: "Bengaluru, Karnataka", distance: "12km", capacity: "120 tonnes", contact: "+91 8765432109", rating: 4.2, price: "₹180/tonne/day" },
  { id: 3, name: "FarmToMarket Cold Chain",   location: "Hyderabad, Telangana", distance: "8km",  capacity: "80 tonnes",  contact: "+91 7654321098", rating: 3.8, price: "₹220/tonne/day" },
  { id: 4, name: "Rakesh Cold Chain",         location: "Bengaluru, Karnataka", distance: "3km",  capacity: "20 tonnes",  contact: "+91 7654321098", rating: 3.8, price: "₹225/tonne/day" },
  { id: 5, name: "Modern Cold Chain",         location: "Hyderabad, Telangana", distance: "7km",  capacity: "20 tonnes",  contact: "+91 6543210567", rating: 3.8, price: "₹211/tonne/day" },
  { id: 6, name: "RuralFreeze Ltd",           location: "Nashik, Maharashtra",  distance: "6km",  capacity: "60 tonnes",  contact: "+91 9123456789", rating: 4.0, price: "₹195/tonne/day" },
];

const ColdStorage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const handleContact = (name, contact) => {
    toast.info(`Contacting ${name} at ${contact}...`);
  };

  const filtered = coldStorages.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRating = ratingFilter === '' || s.rating >= parseFloat(ratingFilter);
    return matchSearch && matchRating;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className={i < Math.round(rating) ? "text-amber-400" : "text-gray-200"} />
    ));
  };

  return (
    <section id="cold-storage" className="w-full py-24 px-4 sm:px-8 bg-[#f9fafb]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <FaSnowflake className="text-xs" /> Cold Chain
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Find Nearby Cold Storages
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Locate and book storage for your produce to minimize post-harvest losses.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-sm">
            <FaSearch className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by location or storage name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-sm">
            <FaFilter className="text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="outline-none text-gray-700 text-sm bg-transparent cursor-pointer"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Map */}
          <div className="relative rounded-[28px] overflow-hidden shadow-2xl h-[480px]">
            <img src={img} alt="Cold storage map" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
              <button 
                className="flex items-center gap-2 bg-white text-gray-800 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-[#f0fdf4] hover:text-[#137f13] transition-colors text-sm"
                onClick={() => toast.info("Opening map views...")}
              >
                <FaMapMarkerAlt /> View in Full Map
              </button>
            </div>
          </div>

          {/* Storage Cards */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[480px] pr-1">
            {filtered.length > 0 ? filtered.map(storage => (
              <div key={storage.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#bbf7d0] transition-all p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h5 className="font-black text-gray-900 text-base mb-1">{storage.name}</h5>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                    <FaMapMarkerAlt className="text-[#137f13]" />
                    {storage.location} &bull; <span className="font-medium">{storage.distance} away</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {storage.capacity}
                    </span>
                    <span className="bg-[#f0fdf4] text-[#137f13] text-xs font-semibold px-3 py-1 rounded-full">
                      {storage.price}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    {renderStars(storage.rating)}
                    <span className="text-xs text-gray-500 ml-1 font-semibold">{storage.rating}</span>
                  </div>
                  <button 
                    className="flex items-center gap-2 bg-[#1c2a1c] hover:bg-[#121c12] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-md"
                    onClick={() => handleContact(storage.name, storage.contact)}
                  >
                    <FaPhone className="text-[#ccff00]" /> Contact
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <FaSnowflake className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium mb-4">No cold storages found matching your criteria.</p>
                <button
                  className="text-[#137f13] font-bold underline text-sm"
                  onClick={() => { setSearchTerm(''); setRatingFilter(''); }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ColdStorage;