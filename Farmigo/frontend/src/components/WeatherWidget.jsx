import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaMapMarkerAlt, FaCog, FaMoon, FaThLarge,
  FaWind, FaTint, FaChevronRight, FaSun, FaCloudSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaTachometerAlt
} from 'react-icons/fa';

const API_KEY = 'c15a125db1c412dd6244e6ff6c1b054b'; // OpenWeather API Key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherWidget = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [otherCities, setOtherCities] = useState([]);
  const [city, setCity] = useState('Colombo');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper to map OpenWeather icons/conditions to emojis
  const getWeatherIcon = (main) => {
    switch(main) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Drizzle': return '🌦️';
      case 'Thunderstorm': return '⛈️';
      case 'Snow': return '❄️';
      default: return '🌤️';
    }
  };

  const fetchRealTimeData = async (queryCity) => {
    setLoading(true);
    try {
      // 1. Current Weather
      const currentRes = await fetch(`${BASE_URL}/weather?q=${queryCity},LK&units=metric&appid=${API_KEY}`);
      if (!currentRes.ok) throw new Error('City not found');
      const currentData = await currentRes.json();
      setCurrentWeather(currentData);

      // 2. 5-Day Forecast (3-hour intervals)
      const forecastRes = await fetch(`${BASE_URL}/forecast?q=${queryCity},LK&units=metric&appid=${API_KEY}`);
      const forecastData = await forecastRes.json();
      
      // Extract one forecast per day (around noon)
      const dailyForecast = [];
      const seenDays = new Set();
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        // Try to get forecasts around midday
        if (!seenDays.has(dayName) && date.getHours() >= 11 && date.getHours() <= 15) {
          seenDays.add(dayName);
          dailyForecast.push({
            day: dayName,
            temp: Math.round(item.main.temp) + '°',
            icon: getWeatherIcon(item.weather[0].main),
            rainProb: Math.round(item.pop * 100) // Probability of precipitation
          });
        }
      });
      setForecastList(dailyForecast.slice(0, 6)); // Ensure exactly 6 days shown

      // 3. Other Cities in Sri Lanka
      const targetCities = ['Kandy', 'Galle', 'Jaffna'];
      const cityPromises = targetCities.map(c => 
        fetch(`${BASE_URL}/weather?q=${c},LK&units=metric&appid=${API_KEY}`).then(res => res.json())
      );
      const citiesData = await Promise.all(cityPromises);
      setOtherCities(citiesData.filter(d => d.cod === 200).map(d => ({
        region: 'Sri Lanka',
        city: d.name,
        condition: d.weather[0].main,
        temp: Math.round(d.main.temp) + '°',
        icon: getWeatherIcon(d.weather[0].main)
      })));

    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeData(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery) {
      setCity(searchQuery);
      fetchRealTimeData(searchQuery);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-gradient-to-br from-[#0d1a0d] to-[#132b13] text-white p-6 md:p-8 rounded-[32px] font-sans my-12 relative overflow-hidden ring-1 ring-white/10" style={{boxShadow: '0 25px 60px rgba(0,0,0,0.4)'}}>
      {loading && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#71f66a] border-t-transparent rounded-full"></div>
      </div>}
      
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10 ring-1 ring-white/10 transition-all shadow-inner">
            <FaThLarge />
          </button>
          <div className="flex items-center gap-2 text-gray-200 text-sm font-bold bg-white/5 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-white/10">
            <FaMapMarkerAlt className="text-[#71f66a]" />
            <span>{currentWeather ? `${currentWeather.name}, ${currentWeather.sys.country}` : 'Loading...'}</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus:text-[#71f66a] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Sri Lankan city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 text-white font-medium rounded-full py-2.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#71f66a]/30 focus:bg-white/10 transition-all text-sm shadow-inner ring-1 ring-white/5"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button className="text-gray-400 hover:text-white transition-colors"><FaCog size={18} /></button>
          <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"><FaMoon size={14} /></button>
          <div className="w-8 h-8 bg-gray-500 rounded-full overflow-hidden border-2 border-white/10">
             <img src="https://i.pravatar.cc/100?img=47" alt="Profile" className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Left Column */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
            <div className="flex gap-6 text-sm">
               <button className="text-white font-bold border-b-2 border-[#71f66a] pb-2 relative top-[9px]">Today</button>
               <button className="text-gray-400 font-medium hover:text-white pb-2 transition-colors">Tomorrow</button>
               <button className="text-gray-400 font-medium hover:text-white pb-2 transition-colors">Next 5 days</button>
            </div>
            <div className="hidden sm:flex bg-white/5 rounded-full p-1 text-xs shadow-inner ring-1 ring-white/5">
              <button className="bg-white text-black rounded-full px-4 py-1.5 font-bold shadow-sm">Forecast</button>
              <button className="text-gray-400 font-medium px-4 py-1.5 hover:text-white transition-colors">Air quality</button>
            </div>
          </div>

          {/* Days Row */}
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
            {/* Current Day Highlighted */}
            <div className="bg-gradient-to-br from-[#d4fcd4] to-[#71f66a] text-[#0d1a0d] rounded-[28px] p-5 min-w-[220px] flex-shrink-0 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(113,246,106,0.2)]">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-black text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                 <span className="text-xs font-black uppercase text-[#137f13] bg-white/40 px-2 py-1 rounded-lg backdrop-blur-sm">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-6xl font-black tracking-tighter">{currentWeather ? Math.round(currentWeather.main.temp) : '--'}°</span>
                 <span className="text-4xl drop-shadow-md">{currentWeather ? getWeatherIcon(currentWeather.weather[0].main) : '⛅'}</span>
               </div>
               <div className="grid grid-cols-2 gap-y-3 text-[10px] font-bold text-[#0d1a0d]/80">
                 <div className="flex items-center gap-1.5 bg-white/30 px-2 py-1.5 rounded-lg"><FaSun className="text-orange-600"/> Feels: {currentWeather ? Math.round(currentWeather.main.feels_like) : '--'}°</div>
                 <div className="flex items-center gap-1.5 bg-white/30 px-2 py-1.5 rounded-lg"><FaTint className="text-blue-600"/> Humid: {currentWeather ? currentWeather.main.humidity : '--'}%</div>
                 <div className="flex items-center gap-1.5 bg-white/30 px-2 py-1.5 rounded-lg"><FaWind className="text-emerald-700"/> Wind: {currentWeather ? Math.round(currentWeather.wind.speed * 3.6) : '--'} Km/h</div>
                 <div className="flex items-center gap-1.5 bg-white/30 px-2 py-1.5 rounded-lg"><FaTachometerAlt className="text-emerald-700"/> Pres: {currentWeather ? currentWeather.main.pressure : '--'}MB</div>
               </div>
            </div>

            {/* Forecast Days */}
            {forecastList.map((d, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-[28px] p-4 min-w-[85px] flex flex-col items-center justify-between py-6 flex-shrink-0 border border-white/5 hover:bg-white/10 hover:border-[#71f66a]/30 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1">
                 <span className="text-sm font-bold text-gray-400 mb-4">{d.day}</span>
                 <span className="text-3xl mb-4 drop-shadow-lg">{d.icon}</span>
                 <span className="text-lg font-black">{d.temp}</span>
              </div>
            ))}
          </div>

          {/* Global Map Section */}
          <div className="mt-8">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg">Sri Lanka map</h3>
               <button className="text-xs font-medium flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow-inner border border-white/5">View wide <span className="text-[10px]">✨</span></button>
             </div>
             
             <div className="relative h-[220px] bg-white/5 backdrop-blur-md rounded-[28px] overflow-hidden border border-white/5 shadow-inner group">
                {/* Map Background */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ee/Sri_Lanka_location_map.svg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{filter: 'invert(1) hue-rotate(90deg)'}}></div>
                
                {/* Overlay Card */}
                <div className="absolute flex flex-col items-center justify-center p-5 bg-[#132b13]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                   <p className="text-white text-xs font-bold mb-3 text-center tracking-wide leading-tight px-4 max-w-[200px]">Explore detailed agricultural weather data across districts.</p>
                   <button className="w-full py-2.5 bg-gradient-to-r from-[#71f66a] to-[#137f13] text-white font-black rounded-xl text-xs hover:opacity-90 hover:scale-105 transition-all shadow-[0_5px_15px_rgba(113,246,106,0.3)]">Get started</button>
                </div>
                
                {/* Map Pins */}
                {otherCities.map((c, i) => (
                  <div key={i} className={`absolute w-3 h-3 bg-[#71f66a] rounded-full shadow-[0_0_15px_rgba(113,246,106,0.8)] border-2 border-[#0d1a0d] ${i === 0 ? 'top-[40%] left-[45%]' : i === 1 ? 'bottom-[20%] left-[40%]' : 'top-[20%] left-[45%]'}`} title={c.city}></div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-8">
           
           {/* Chance of Rain Graph */}
           <div className="bg-white/5 backdrop-blur-md rounded-[28px] p-6 border border-white/5 shadow-inner relative overflow-hidden">
             {/* Decorative Gradient */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#71f66a]/10 blur-3xl rounded-full"></div>
             
             <h3 className="font-bold text-sm mb-6 flex justify-between items-center">
               Chance of rain
               <span className="bg-white/5 p-2 rounded-xl border border-white/5"><FaCloudRain className="text-[#71f66a]" /></span>
             </h3>
             <div className="flex items-end gap-3 h-[130px] relative mt-2">
                <div className="absolute -left-2 flex flex-col justify-between h-full text-[9px] font-bold text-gray-500 py-1">
                  <span>Heavy</span>
                  <span>Sunny</span>
                  <span>Rainy</span>
                </div>
                <div className="ml-10 flex items-end gap-4 w-full h-[120px] pb-4 border-b border-white/10">
                   {(forecastList.length > 0 ? forecastList.map(f => f.rainProb) : [40, 20, 80, 50, 40, 90]).slice(0,6).map((h, i) => (
                     <div key={i} className="w-full bg-[#71f66a]/20 hover:bg-[#71f66a]/50 transition-colors rounded-t-lg relative group flex items-end justify-center" style={{height: `${Math.max(h, 10)}%`}}> 
                       <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-[#132b13] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap border border-white/10">
                         {h}%
                       </div>
                       {h > 50 && <div className="absolute -top-4 w-full text-center text-[10px] animate-bounce">💧</div>}
                     </div>
                   ))}
                </div>
             </div>
             <div className="flex justify-between items-center ml-10 text-[9px] font-bold text-gray-500 mt-3 px-1">
               {forecastList.slice(0,6).map((f, i) => <span key={i}>{f.day}</span>)}
             </div>
           </div>

           {/* Other large cities */}
           <div className="flex-1 mt-2">
             <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-sm">Other major districts</h3>
               <button className="text-gray-400 font-bold text-[10px] uppercase tracking-wider hover:text-white flex items-center bg-white/5 border border-white/5 px-3 py-1.5 rounded-full transition-colors">Show All <FaChevronRight className="ml-1 text-[8px]" /></button>
             </div>
             
             <div className="flex flex-col gap-3">
                {otherCities.map((c, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 hover:border-[#71f66a]/30 transition-all cursor-pointer shadow-sm hover:shadow-lg group">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{c.region}</p>
                      <h4 className="font-black text-sm mb-1 group-hover:text-[#71f66a] transition-colors">{c.city}</h4>
                      <p className="text-[11px] font-medium text-gray-400">{c.condition}</p>
                    </div>
                    <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-xl group-hover:bg-white/10 border border-white/5">
                      <span className="text-2xl mb-1 drop-shadow-md">{c.icon}</span>
                      <span className="font-black text-sm">{c.temp}</span>
                    </div>
                  </div>
                ))}
                {otherCities.length === 0 && !loading && (
                   <p className="text-xs text-gray-500 text-center py-4">Loading cities...</p>
                )}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
