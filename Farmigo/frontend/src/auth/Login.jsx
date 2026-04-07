import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaArrowRight } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/users/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Google Login successful!');
        localStorage.setItem('user', JSON.stringify({
          userId: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        localStorage.setItem('token', data.token);
        setTimeout(() => { 
          if (data.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard'); 
          }
        }, 2000);
      } else {
        toast.error(data.message || 'Google Login failed');
      }
    } catch (err) {
      toast.error('Network error with Google authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful! Redirecting to dashboard...');
        localStorage.setItem('user', JSON.stringify({
          userId: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        localStorage.setItem('token', data.token);
        setTimeout(() => { 
          if (data.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard'); 
          }
        }, 2000);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Network error. Please make sure the server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 sm:p-8 bg-[#f5f7fa]">
      {/* Full Page Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-[1100px] h-[700px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex z-10 relative">
        {/* Left Side (Image Panel) */}
        <div className="hidden md:flex w-1/2 p-1.5">
          <div 
            className="w-full h-full rounded-[32px] overflow-hidden relative flex flex-col justify-end p-10 text-white"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#ccff00] text-black text-sm font-bold px-3 py-1 rounded-full">12k+</div>
                <p className="text-sm font-semibold uppercase tracking-wider">Join with 12k+ farmers!</p>
              </div>
              <h1 className="text-5xl font-black mb-4 leading-none tracking-tighter text-[#ccff00]">Back to<br/>nature.</h1>
              <p className="text-white/80 font-medium">Get started and connect directly with markets.</p>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center bg-white relative">
          <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-green-600 transition-colors hidden sm:block font-medium">
            Back to Home
          </Link>

          <div className="max-w-[400px] w-full mx-auto">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-10">
              <FaLeaf className="text-3xl text-[#137f13]" />
              <span className="text-2xl font-black tracking-tight text-gray-900">FARMIGO</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pb-3 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#137f13] transition-colors bg-transparent font-medium"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pb-3 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#137f13] transition-colors bg-transparent font-medium"
                />
              </div>

              <div className="flex items-center justify-between text-sm py-2">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#137f13] focus:ring-[#137f13] cursor-pointer" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#" className="font-semibold text-gray-900 hover:text-[#137f13] transition-colors">Forgot Password</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#1c2a1c] hover:bg-[#121c12] text-white rounded-xl font-bold transition-all relative group overflow-hidden mt-4 shadow-lg flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:opacity-50 transition-opacity" style={{backgroundImage: "url('https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80')"}}></div>
                <span className="relative z-10">{loading ? 'Logging In...' : 'Log In'}</span>
                {!loading && (
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#ccff00] text-black flex items-center justify-center ml-2 group-hover:scale-110 transition-transform">
                    <FaArrowRight className="text-xs" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/signup" className="text-[#137f13] font-bold hover:underline">Sign Up</Link>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <span className="text-gray-400 text-sm">or login with</span>
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Login Failed')}
                  useOneTap
                  theme="outline"
                  shape="circle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;