/** Loader.jsx – Full-page and inline loading spinner */
import { FaLeaf } from "react-icons/fa";

const Loader = ({ fullPage = false, text = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
          <FaLeaf className="absolute inset-0 m-auto text-emerald-600 text-xl" />
        </div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-3 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
    </div>
  );
};

export default Loader;
