import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiSearch, FiHeart, FiUser, FiChevronDown } from "react-icons/fi";
import "../styles/Navbar.css";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = savedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span>PerfumeShop</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <FiMenu />
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${isActive("/products") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>

        <div className="nav-actions">
          <div className="search-container">
            <form onSubmit={handleSearch} className={`search-form ${isSearchOpen ? "search-open" : ""}`}>
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search perfumes"
              />
              <button type="submit" className="search-submit" aria-label="Submit search">
                <FiSearch />
              </button>
            </form>
            <button
              className="action-btn search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
              aria-label="Toggle search"
            >
              <FiSearch />
            </button>
          </div>

          <Link to="/wishlist" className="action-btn" title="Wishlist" aria-label="Wishlist">
            <FiHeart />
          </Link>

          {user ? (
            <div className="profile-menu-container">
              <button 
                className="action-btn profile-btn" 
                onClick={toggleProfileMenu}
                aria-label="Profile menu"
              >
                <FiUser />
                <FiChevronDown className={`chevron ${isProfileMenuOpen ? 'open' : ''}`} />
              </button>
              <div className={`profile-menu ${isProfileMenuOpen ? 'open' : ''}`}>
                <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                  My Profile
                </Link>
                <Link to="/orders" onClick={() => setIsProfileMenuOpen(false)}>
                  My Orders
                </Link>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="action-btn" title="Login" aria-label="Login">
              <FiUser />
            </Link>
          )}

          <Link to="/cart" className="action-btn cart-btn" title="Cart" aria-label="Cart">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo">
            <span>PerfumeShop</span>
          </Link>
          <button
            className="mobile-menu-close"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <div className="mobile-nav-links">
          <Link
            to="/"
            className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`mobile-nav-link ${isActive("/products") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`mobile-nav-link ${isActive("/about") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`mobile-nav-link ${isActive("/contact") ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
              <button onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          )}
        </div>

        <div className="mobile-nav-actions">
          <div className="mobile-search-container">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search perfumes"
              />
              <button type="submit" className="search-submit" aria-label="Submit search">
                <FiSearch />
              </button>
            </form>
          </div>
          <Link to="/wishlist" className="action-btn" title="Wishlist" aria-label="Wishlist">
            <FiHeart />
          </Link>
          <Link
            to="/cart"
            className="action-btn"
            title="Cart"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cart"
          >
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
