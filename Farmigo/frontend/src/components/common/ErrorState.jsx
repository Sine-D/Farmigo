/** ErrorState.jsx – Error display with retry option */
import { FaExclamationCircle, FaRedo } from "react-icons/fa";

const ErrorState = ({ message = "Something went wrong", onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <FaExclamationCircle className="text-red-400 text-5xl mb-4" />
    <h3 className="text-lg font-bold text-gray-700 mb-1">Failed to load data</h3>
    <p className="text-sm text-gray-400 max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
      >
        <FaRedo /> Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
