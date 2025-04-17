import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const ProductImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc('https://via.placeholder.com/400x300?text=Product+Image');
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="product-image-container">
      {isLoading && <div className="image-loading-spinner" />}
      <img
        src={imgSrc}
        alt={alt}
        className={`product-image ${isLoading ? 'loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      // Filter featured products from the products array in the response
      const featured = data.products.filter(product => product.featured);
      setFeaturedProducts(featured);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch featured products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const categories = [
    {
      name: "Men's Fragrance",  // Updated to match exact category name from backend
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    },
    {
      name: "Women's Fragrance", // Updated to match exact category name from backend
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    },
    {
      name: "Unisex", // Updated to match exact category name from backend
      image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
    }
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchFeaturedProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Signature Scent</h1>
          <p className="hero-subtitle">Explore our collection of luxury fragrances</p>
          <Link to="/FragranceFinderPage" className="hero-button">
            Find Your Perfect Match
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="section-title">Featured Fragrances</h2>
        <div className="featured-products">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                />
                <div className="product-details">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    ${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                    {product.discount > 0 && (
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="category-card"
            >
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Category+Image';
                }}
              />
              <div className="category-overlay">
                <span>{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2 className="newsletter-title">Stay Updated</h2>
        <p>Subscribe to receive updates on new fragrances and exclusive offers</p>
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter-button">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
