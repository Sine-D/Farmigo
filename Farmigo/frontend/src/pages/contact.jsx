import React, { useState } from 'react';
import '../index.css';
import contactImage from '../assets/images/contactimage.png';
import { FaLeaf, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import { apiPost } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use standard apiPost utility instead of manual fetch
      const result = await apiPost('/contact', formData);
      
      toast.success("Message sent Successfully! We'll reply soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message || "Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id='contact' className="w-full relative py-12 md:py-20 px-4 sm:px-8 bg-[#f5f7fa]">
      <div className="w-full max-w-[1100px] mx-auto h-auto min-h-[500px] md:min-h-[600px] bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 relative">
        
        {/* Left Side (Image Panel) */}
        <div className="hidden md:flex w-1/2 p-4">
          <div className="w-full h-full min-h-[500px] rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#eefaf0] to-[#f4f7f4]">
            {/* The provided illustration */}
            <img src={contactImage} alt='contact illustration' className="w-[80%] max-w-[400px] object-contain relative z-10 drop-shadow-xl" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#137f13]/10 to-transparent"></div>
            
            <div className="relative z-10 text-center mt-8">
              <h2 className="text-3xl font-black mb-2 text-[#137f13]">We're here to help</h2>
              <p className="text-gray-600 font-medium">Reach out to us and our support team will get back to you immediately.</p>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 flex flex-col justify-center bg-white relative">
          <div className="max-w-[400px] w-full mx-auto">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-8">
              <FaLeaf className="text-3xl text-[#137f13]" />
              <span className="text-2xl font-black tracking-tight text-gray-900">FARMIGO</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in touch</h2>
            <p className="text-gray-500 mb-8">Have any questions, feedback, or suggestions? We'd love to hear from you!</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pb-3 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#137f13] transition-colors bg-transparent font-medium"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter a Valid Email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pb-3 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#137f13] transition-colors bg-transparent font-medium"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows="3"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pb-3 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#137f13] transition-colors bg-transparent font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#1c2a1c] hover:bg-[#121c12] text-white rounded-xl font-bold transition-all relative group overflow-hidden mt-8 shadow-lg flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:opacity-50 transition-opacity" style={{backgroundImage: "url('https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80')"}}></div>
                <span className="relative z-10">{loading ? 'Sending...' : 'Send Message'}</span>
                {!loading && (
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#ccff00] text-black flex items-center justify-center ml-2 group-hover:scale-110 transition-transform">
                    <FaArrowRight className="text-xs" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;