import React from 'react';
import { Logo } from '../common';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Logo />
          <p className="footer-description">
            Premium streetwear and exclusive sneakers. Stay ahead of the culture.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h3>Shop</h3>
            <ul>
              <li><a href="/sneakers">Sneakers</a></li>
              <li><a href="/apparel">Apparel</a></li>
              <li><a href="/accessories">Accessories</a></li>
              <li><a href="/sale">Sale</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/returns">Returns & Exchanges</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} TekkieStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
