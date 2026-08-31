import { NavLink, Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navContainer">
        
        {/* LEFT: Logo + Nav Links */}
        <div className="navLeft">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Sole Town Logo" />
          </Link>

          <ul className="navLinks">
            <li>
              <NavLink to="/new-drops" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                NEW DROPS
              </NavLink>
            </li>
            <li>
              <NavLink to="/men" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                MEN
              </NavLink>
            </li>
            <li>
              <NavLink to="/women" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                WOMEN
              </NavLink>
            </li>
            <li>
              <NavLink to="/limited-edition" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                LIMITED EDITION
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalogue" className={({ isActive }) => isActive ? 'link active' : 'link'}>
                CATALOGUE
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT: Search + Actions */}
        <div className="navRight">
          
          <div className="searchWrapper">
            <Search className="searchIcon" strokeWidth={1.75} />
            <input type="text" className="searchInput" placeholder="Search for shoes, brands..." />
          </div>

          <div className="navActions">
            {/* Wishlist Icon */}
            <Heart className="actionIcon" strokeWidth={1.75} />
            
            {/* Cart Icon */}
            <ShoppingBag className="actionIcon" strokeWidth={1.75} />

            {/* Profile Avatar placeholder */}
            <div className="profileAvatar">
              <User className="actionIcon" strokeWidth={1.75} />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
