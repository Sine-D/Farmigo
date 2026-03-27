import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { FaLeaf } from "react-icons/fa";
import {
  Container,
  Navbar as BsNavbar,
  Nav,
  Button,
} from "react-bootstrap";


const navLinks = [
  { path: "/", section: "home", display: "Home" },
  { path: "/", section: "about", display: "About Us" },
  { path: "/", section: "review", display: "Reviews" },
  { path: "/", section: "contact", display: "Contact Us" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-bold text-white transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_15px_rgba(19,127,19,0.3)] hover:shadow-[0_8px_25px_rgba(19,127,19,0.4)]"
              style={{ backgroundColor: "var(--primary-green)", textDecoration: "none" }}
            >
              Login
            </Link>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
