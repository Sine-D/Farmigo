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
  { path: "/", section: "about", display: "About Us" },
  { path: "/", section: "review", display: "Reviews" },
  { path: "/", section: "contact", display: "Contact Us" },
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

        <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none">
          <BiMenu className="fs-1" style={{ color: "var(--primary-green)" }} />
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto align-items-center">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleNavClick(link.path, link.section)}
                className="mx-2 nav-link-custom"
                style={{ fontWeight: "500", fontSize: "1.05rem" }}
              >
                {link.display}
              </Nav.Link>
            ))}
          </Nav>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <Link
                  to="/dashboard"
                  className="d-flex align-items-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_15px_rgba(19,127,19,0.3)]"
                  style={{ backgroundColor: "var(--primary-green)", textDecoration: "none" }}
                >
                  <FaUserCircle className="fs-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest bg-transparent border-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-full font-bold text-white transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_15px_rgba(19,127,19,0.3)] hover:shadow-[0_8px_25px_rgba(19,127,19,0.4)]"
                style={{ backgroundColor: "var(--primary-green)", textDecoration: "none" }}
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

