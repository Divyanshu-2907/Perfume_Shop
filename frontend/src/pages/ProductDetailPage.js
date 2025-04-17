import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiChevronLeft, 
  FiChevronRight,
  FiClock,
  FiTruck,
  FiShield
} from "react-icons/fi";
import "../styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log the API request
        console.log(`Fetching product with ID: ${id}`);
        
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
        // Log the response
        console.log('Product response:', response.data);
        
        if (!response.data) {
          throw new Error('No product data received');
        }
        
        setProduct(response.data);
        
        // Fetch related products
        try {
          const relatedResponse = await axios.get(`http://localhost:5000/api/products/related/${id}`);
          console.log('Related products response:', relatedResponse.data);
          setRelatedProducts(relatedResponse.data);
        } catch (relatedError) {
          console.warn('Failed to fetch related products:', relatedError);
          // Don't set error state for related products failure
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        let errorMessage = "Failed to load product details. Please try again later.";
        
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Product not found.";
          } else if (err.response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (err.message === 'No product data received') {
          errorMessage = "Invalid product data received from server.";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.stockCount, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout");
  };

  const handleWishlistToggle = () => {
    setIsWishlist(!isWishlist);
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (!isWishlist) {
      wishlist.push(product);
    } else {
      const index = wishlist.findIndex(item => item._id === product._id);
      if (index !== -1) wishlist.splice(index, 1);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on our perfume shop!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, reviewForm);
      setProduct(response.data);
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        comment: '',
        name: '',
        email: ''
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again later.");
    }
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-content">
            <p className="product-description">{product.description}</p>
            <div className="product-specifications">
              <h3>Product Specifications</h3>
              <ul>
                <li><strong>Brand:</strong> {product.brand || 'N/A'}</li>
                <li><strong>Size:</strong> {product.size || 'N/A'}</li>
                <li><strong>Fragrance Type:</strong> {product.fragranceType || 'N/A'}</li>
                <li><strong>Gender:</strong> {product.gender || 'Unisex'}</li>
                <li><strong>Ingredients:</strong> {product.ingredients || 'N/A'}</li>
              </ul>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="tab-content">
            <div className="reviews-summary">
              <div className="average-rating">
                <h3>{product.rating.toFixed(1)}</h3>
                <div className="stars">
                  {"★".repeat(Math.round(product.rating))}
                  {"☆".repeat(5 - Math.round(product.rating))}
                </div>
                <p>{product.numReviews} reviews</p>
                <button 
                  className="write-review-btn"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              </div>
              <div className="reviews-list">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h4>{review.name}</h4>
                          <div className="review-rating">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
            {showReviewForm && (
              <div className="review-form-container">
                <h3>Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={reviewForm.name}
                      onChange={handleReviewInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={reviewForm.email}
                      onChange={handleReviewInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewInputChange}
                      required
                      rows="4"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-review-btn">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <p>Product not found</p>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => navigate("/products")}>
        <FiChevronLeft /> Back to Products
      </button>

      <div className="product-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="product-image"
            />
            {product.discount > 0 && (
              <div className="discount-badge">
                {product.discount}% OFF
              </div>
            )}
          </div>
          
          <div className="thumbnail-container">
            <button 
              className="thumbnail-nav prev"
              onClick={() => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
            >
              <FiChevronLeft />
            </button>
            
            <div className="thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
            
            <button 
              className="thumbnail-nav next"
              onClick={() => setActiveTab((prev) => (prev + 1) % product.images.length)}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-meta">
            <div className="product-rating">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span>({product.numReviews} reviews)</span>
            </div>
            <div className="product-category">{product.category}</div>
          </div>

          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="original-price">${product.price}</span>
                <span className="discounted-price">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span>${product.price}</span>
            )}
          </div>

          <div className="product-features">
            <div className="feature">
              <FiTruck />
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <FiShield />
              <span>2-Year Warranty</span>
            </div>
            <div className="feature">
              <FiClock />
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="product-stock">
            {product.inStock ? (
              <span className="in-stock">In Stock ({product.stockCount} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stockCount}
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button 
                onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                disabled={quantity >= product.stockCount}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              className={`wishlist-btn ${isWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              <FiHeart /> {isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="share-btn" onClick={handleShare}>
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="product-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description & Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews})
          </button>
        </div>
        {renderTabContent()}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div 
                key={relatedProduct._id} 
                className="related-product-card"
                onClick={() => navigate(`/products/${relatedProduct._id}`)}
              >
                <img src={relatedProduct.images[0]} alt={relatedProduct.name} />
                <h3>{relatedProduct.name}</h3>
                <div className="related-product-price">
                  ${relatedProduct.discount > 0 
                    ? (relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)
                    : relatedProduct.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
