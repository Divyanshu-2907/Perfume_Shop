import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiYoutube,
  FiCreditCard,
  FiTruck,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Top Section - Features */}
      <div className="footer-features">
        <div className="feature-item">
          <FiTruck className="feature-icon" />
          <div className="feature-content">
            <h3>Free Shipping</h3>
            <p>On all orders over $50</p>
          </div>
        </div>
        <div className="feature-item">
          <FiRefreshCw className="feature-icon" />
          <div className="feature-content">
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
        <div className="feature-item">
          <FiShield className="feature-icon" />
          <div className="feature-content">
            <h3>Secure Payment</h3>
            <p>100% secure checkout</p>
          </div>
        </div>
        <div className="feature-item">
          <FiCreditCard className="feature-icon" />
          <div className="feature-content">
            <h3>Multiple Payment</h3>
            <p>All major cards accepted</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-title">Perfume Shop</h3>
          <p className="footer-description">
            Your destination for premium fragrances. Discover the perfect scent that matches your personality and style.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>123 Fragrance Street, Scent City</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>info@perfumeshop.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/fragrance-finder">Fragrance Finder</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-links">
            <li><Link to="/products?category=men">Men's Fragrances</Link></li>
            <li><Link to="/products?category=women">Women's Fragrances</Link></li>
            <li><Link to="/products?category=unisex">Unisex Fragrances</Link></li>
            <li><Link to="/products?category=limited">Limited Editions</Link></li>
            <li><Link to="/products?category=gift">Gift Sets</Link></li>
            <li><Link to="/products?category=travel">Travel Size</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3 className="footer-title">Newsletter</h3>
          <p className="newsletter-description">
            Subscribe to our newsletter for exclusive offers and fragrance tips.
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FiInstagram className="social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FiFacebook className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FiTwitter className="social-icon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FiYoutube className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} Perfume Shop. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/shipping">Shipping Policy</Link>
            <Link to="/returns">Returns Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
