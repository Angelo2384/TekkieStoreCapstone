import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Logo } from '../common';
import { IconButton, NotificationBadge, Avatar } from '../ui';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, type Product } from '../../data/products';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { cartCount, wishlist } = useShop();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Derive filtered search results — no side effects needed
  const searchResults = useMemo<Product[]>(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(trimmed) ||
      p.brand.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed)
    );
  }, [searchQuery]);

  // Show dropdown when there's a query and user focused the input
  const showDropdown = isSearchOpen && searchQuery.trim().length > 0;

  // Close dropdown when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setIsSearchOpen(false);
      navigate(`/catalogue?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Open dropdown as soon as user types
    if (e.target.value.trim()) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSelectProduct = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT: Logo + Nav Links */}
        <div className="navbar-left">
          <NavLink to="/" className="navbar-brand">
            <Logo />
          </NavLink>

          <ul className="navbar-links">
            <li>
              <NavLink
                to="/new-drops"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                NEW DROPS
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/men"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                MEN
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/women"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                WOMEN
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/limited-edition"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                LIMITED EDITION
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                CATALOGUE
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT: Search + Actions */}
        <div className="navbar-right">
          {/* Search — scoped inside .navbar-search so CSS selectors don't bleed */}
          <div className="navbar-search" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="search-form" role="search">
              <div className="search-input-wrapper">
                {/* Magnifying glass icon — 18×18, never larger */}
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for shoes, brands..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchQuery.trim()) setIsSearchOpen(true);
                  }}
                  autoComplete="off"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-expanded={showDropdown}
                />

                {/* Clear button — shown when there is text */}
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {showDropdown && (
              <div className="search-dropdown-menu" role="listbox">
                {searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((product: Product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="search-result-item"
                        onClick={handleSelectProduct}
                        role="option"
                      >
                        <div className="search-result-thumb">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                            }}
                          />
                        </div>
                        <div className="search-result-info">
                          <span className="search-result-brand">{product.brand}</span>
                          <span className="search-result-name">{product.name}</span>
                          <span className="search-result-price">
                            R{product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <div
                      className="search-view-all"
                      role="option"
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery('');
                      }}
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; &rarr;
                    </div>
                  </div>
                ) : (
                  <div className="search-no-results">
                    <span>No products found for &ldquo;{searchQuery}&rdquo;</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="navbar-actions">
            <div className="action-item">
              <IconButton
                aria-label="Wishlist"
                onClick={() => navigate('/wishlist')}
                icon={
                  <svg viewBox="0 0 24 24" fill={wishlist.size > 0 ? 'var(--color-primary)' : 'none'} stroke={wishlist.size > 0 ? 'var(--color-primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                }
              />
              {wishlist.size > 0 && (
                <NotificationBadge count={wishlist.size} className="cart-badge" />
              )}
            </div>

            <div className="action-item">
              <IconButton
                aria-label="Cart"
                onClick={() => navigate('/cart')}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                }
              />
              {cartCount > 0 && (
                <NotificationBadge count={cartCount} className="cart-badge" />
              )}
            </div>

            <NavLink to="/login" className="profile-link" aria-label="Account profile">
              <Avatar alt="User Profile" initials="JD" size="sm" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
