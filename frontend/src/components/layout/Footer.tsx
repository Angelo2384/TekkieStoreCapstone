import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Logo />
          <p className="footer-description">
            Elite sneaker retailer blending premium streetwear editorial aesthetics with high-performance digital shopping experiences.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h3>SHOP</h3>
            <ul>
              <li><a href="/new-drops">New Drops</a></li>
              <li><a href="/men">Men</a></li>
              <li><a href="/women">Women</a></li>
              <li><a href="/limited-edition">Limited Edition</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>SUPPORT</h3>
            <ul>
              <li><Link to="/delivery">Delivery</Link></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>COMPANY</h3>
            <ul>
              <li><a href="/about">About Tekkies Store</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Tekkies Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

