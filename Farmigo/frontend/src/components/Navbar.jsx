import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { FaLeaf, FaUserCircle } from "react-icons/fa";
import {
  Container,
  Navbar as BsNavbar,
  Nav,
} from "react-bootstrap";


const navLinks = [
  { path: "/", section: "home", display: "Home" },
  { path: "/explore", display: "Marketplace" },
  { path: "/lms", display: "LMS Academy" },
  { path: "/", section: "about", display: "About Us" },
  { path: "/", section: "contact", display: "Contact" },
];

import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check for user login status on mount and when location changes
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleNavClick = (path, section) => {
    setExpanded(false);
    if (section && path === window.location.pathname) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    setUser(null);
    navigate('/');
  };

  return (
    <BsNavbar
      expand="lg"
      className={`custom-navbar ${scrolled ? "scrolled" : ""} sticky-top`}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      style={{
        zIndex: 1050,
      }}
    >
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center logo" onClick={() => handleNavClick("/", "home")}>
          <FaLeaf className="leaf-icon me-2" style={{ color: "var(--primary-green)", fontSize: "1.5rem" }} />
          <span className="fw-bold fs-3" style={{ color: "var(--text-dark)", letterSpacing: "-0.5px" }}>FARMIGO</span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0 shadow-none p-2 rounded-xl bg-white/5 active:bg-white/10 transition-colors"
        >
          {expanded ? (
            <span className="text-2xl text-[#71f66a] font-bold">✕</span>
          ) : (
            <BiMenu className="fs-1" style={{ color: scrolled ? "var(--primary-green)" : "#71f66a" }} />
          )}
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto align-items-stretch lg:align-items-center mt-4 lg:mt-0">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavClick(link.path, link.section)}
                className="mx-2 nav-link-custom group"
                style={{ fontWeight: "600" }}
              >
                <span>{link.display}</span>
              </Nav.Link>
            ))}
          </Nav>

          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3 mt-4 mt-lg-0">
            {user ? (
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
                <Link
                  to={user.role === 'Admin' ? "/admin" : "/dashboard"}
                  className="d-flex align-items-center justify-content-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_rgba(113,246,106,0.2)]"
                  style={{ background: "linear-gradient(135deg, #137f13, #0d1a0d)", textDecoration: "none" }}
                  onClick={() => setExpanded(false)}
                >
                  <FaUserCircle className="fs-5" />
                  <span>{user.role === 'Admin' ? "Admin Panel" : "My Dashboard"}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl font-bold bg-white/5 text-gray-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-400/30 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl font-bold text-white text-center transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_rgba(113,246,106,0.2)] ring-1 ring-[#71f66a]/30"
                style={{ background: "linear-gradient(135deg, #71f66a, #137f13)", textDecoration: "none" }}
                onClick={() => setExpanded(false)}
              >
                Login
              </Link>
            )}
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;

