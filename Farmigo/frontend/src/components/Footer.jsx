import React from 'react';
import { Link } from 'react-router-dom';
//import logo from '../../assets/images/logo.png';
import { FaLeaf } from 'react-icons/fa';

const quickLinks01 = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About Us" },
  { path: "/cold-storage", display: "Cold Storage" },
  { path: "/marketplace", display: "Marketplace" },
];

const quickLinks02 = [
  { path: "/shop", display: "Shop Fresh" },
  { path: "/locate", display: "Find Nearby Storage" },
  { path: "/blogs", display: "Read Blogs" },
  { path: "/faq", display: "FAQs" },
];

const quickLinks03 = [
  { path: "/contact", display: "Contact Us" },
  { path: "/support", display: "Support FARMIGO" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <FaLeaf className='footer-leaf' />
      <div className="footer-container">
        <div className="footer-column">
          <h1>FARMIGO</h1>
          <p className='footer-description'>
            FARMIGO connects rural farmers with cold storage, bringing you fresh groceries while supporting local agriculture.
          </p>
        </div>

        <div className="footer-column">
          <h2>Quick Links</h2>
          <ul>
            {quickLinks01.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.display}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h2>Explore</h2>
          <ul>
            {quickLinks02.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.display}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h2>Support</h2>
          <ul>
            {quickLinks03.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.display}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-divide">
        <hr />
        <p className="footer-divide-description">
          © {year} FARMIGO — Alrights Reserved 🌾
        </p>
      </div>
    </footer>
  );
};

export default Footer;
