import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../common';
import { SearchInput } from '../forms';
import { IconButton, NotificationBadge, Avatar } from '../ui';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <NavLink to="/" className="navbar-brand">
            <Logo />
          </NavLink>
          
          <ul className="navbar-links">
            <li>
              <NavLink to="/customer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                New
              </NavLink>
            </li>
            <li>
              <NavLink to="/men" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Men
              </NavLink>
            </li>
            <li>
              <NavLink to="/women" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Women
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-search">
            <SearchInput placeholder="Search sneakers..." />
          </div>
          
          <div className="navbar-actions">
            <div className="action-item">
              <IconButton 
                aria-label="Wishlist" 
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                } 
              />
            </div>
            
            <div className="action-item">
              <IconButton 
                aria-label="Cart" 
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                } 
              />
              <NotificationBadge count={3} className="cart-badge" />
            </div>
            
            <NavLink to="/login" className="profile-link">
              <Avatar alt="User Profile" initials="JD" size="sm" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
