import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ProductPage.css";
import { useCart } from "../context/CartContext";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "featured",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid products data format");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on current filters and search term
  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && parseFloat(product.price) < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && parseFloat(product.price) > parseFloat(filters.maxPrice)) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const clearSearch = () => setSearchTerm("");

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "featured",
    });
    setSearchTerm("");
  };

  const cartTotal = cartItems.reduce((total, item) =>
    total + parseFloat(item.price) * item.quantity, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      <div className="page-headers">
        <h1>Our Products</h1>
        <p className="tagline">Explore our curated collection of premium fragrances.</p>
      </div>

      <div className="products-container">
        <div className="products-section">
          <div className="search-filter-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>✕</button>
              )}
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label><span>Category</span></label>
                <select
                  className="category-select"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div className="filter-group">
                <label><span>Price Range</span></label>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label><span>Sort By</span></label>
                <select
                  className="category-select"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {(filters.category || filters.minPrice || filters.maxPrice || searchTerm) && (
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          <div className="products-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
                      alt={product.name}
                      className="product-img"
                    />
                    <button className="wishlist-btn">❤</button>
                    {product.discount && (
                      <span className="discount-badge">{product.discount}% OFF</span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h2>{product.name}</h2>
                    <div className="product-rating">
                      <span className="star-icon">★★★★☆</span>
                      <span className="review-count">({product.reviewCount || 0})</span>
                    </div>
                    <p className="product-description">{product.description || "No description available"}</p>
                    <div className="product-price">
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                      <span className={product.discount ? "discounted-price" : ""}>
                        ${product.price}
                      </span>
                    </div>
                    <div className="product-actions">
                      <Link to={`/products/${product._id}`} className="view-btn">Details</Link>
                      <button className="cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products match your filters.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>

        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <span className="cart-count">{cartItems.length} items</span>
          </div>

          {cartItems.length > 0 ? (
            <>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item._id} className="cart-item">
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/60x60?text=No+Image"}
                      alt={item.name}
                      className="cart-img"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-name">{item.name}</h4>
                      <p className="cart-price">${item.price} × {item.quantity}</p>
                      <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <span>Total: </span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
              </div>
            </>
          ) : (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/products" className="continue-shopping">Continue Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
