import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AnnouncementBar from "./components/AnnouncmentBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Faq from "./pages/faq";
import Review from "./pages/Review";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SupportManagement from "./pages/SupportManagement";
import SustainabilityManagement from "./pages/SustainabilityManagement";
import CommunityManagement from "./pages/CommunityManagement";
import LMSManagement from "./pages/LMSManagement";
import Contact from "./pages/contact";
import CartPage from "./pages/CartPage";
import Explore from "./pages/Explore";
import VideoHero from "./components/VideoHero";
import FarmerSpotlight from "./components/FarmerSpotlight";
import Newsletter from "./components/Newsletter";
import SupportCenter from "./pages/SupportCenter";
import TicketChatPage from "./pages/TicketChatPage";
import DisputeChatPage from "./pages/DisputeChatPage";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";

const sectionMap = {
  "/": "home",
  "/about": "about",
  "/cold-storage": "cold-storage",
  "/market": "market",
  "/review": "review",
  "/contact": "contact",
};

const FullLandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = sectionMap[location.pathname];
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname]);

  return (
    <>
      <VideoHero />
      <Home />
      <Services />
      <About />
      <FarmerSpotlight />
      <Faq />
      <Review />
      <Newsletter />
      <Contact />
    </>
  );
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayoutPaths = [
    "/login",
    "/signup",
    "/profile",
    "/admin",
    "/admin/support",
    "/admin/sustainability",
    "/admin/community",
    "/admin/lms",
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  const shouldHideAnnouncement = shouldHideLayout || 
    location.pathname === "/dashboard" || 
    location.pathname === "/profile" || 
    location.pathname.startsWith("/admin");

  return (
    <>
      {!shouldHideAnnouncement && <AnnouncementBar />}
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
};



const App = () => {
  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<FullLandingPage />} />
          <Route path="/about" element={<FullLandingPage />} />
          <Route path="/review" element={<FullLandingPage />} />
          <Route path="/contact" element={<FullLandingPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/support" element={<SupportManagement />} />
          <Route path="/admin/sustainability" element={<SustainabilityManagement />} />
          <Route path="/admin/community" element={<CommunityManagement />} />
          <Route path="/admin/lms" element={<LMSManagement />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/support" element={<SupportCenter />} />
          <Route path="/support/tickets/:id" element={<TicketChatPage />} />
          <Route path="/support/disputes/:id" element={<DisputeChatPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;