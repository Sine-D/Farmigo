import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

// IMPORTANT: Replace this with your actual Google Client ID from Google Cloud Console
// Example: "1234567890-abc123def456.apps.googleusercontent.com"
const GOOGLE_CLIENT_ID = "1008554697728-e8hoc2oppmabhsrmutf9vpcb7tqolfct.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <CartProvider>
      <App />
    </CartProvider>
  </GoogleOAuthProvider>
);
