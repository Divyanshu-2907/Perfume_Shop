import React, { useState } from 'react';
import '../styles/ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart, onAddToWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.stockCount, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Add review logic here
    setReview({ rating: 5, comment: '' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <div className="modal-images">
            <div className="main-image">
              <img src={product.images[activeImage]} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={activeImage === index ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="modal-details">
            <h2>{product.name}</h2>
            <div className="product-rating">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span>({product.numReviews} reviews)</span>
            </div>
            
            {product.discount > 0 && (
              <div className="discount-badge">
                {product.discount}% OFF
              </div>
            )}
            
            <p className="product-price">
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
            </p>

            <p className="product-description">{product.description}</p>
            
            <div className="product-stock">
              {product.inStock ? (
                <span className="in-stock">In Stock ({product.stockCount} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stockCount}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <div className="modal-actions">
              <button
                className="add-to-cart-btn"
                onClick={() => onAddToCart(product, quantity)}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              <button
                className="wishlist-btn"
                onClick={() => onAddToWishlist(product)}
              >
                Add to Wishlist
              </button>
            </div>

            <div className="product-reviews">
              <h3>Reviews</h3>
              {product.reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                <div className="reviews-list">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.name}</span>
                        <div className="review-rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="review-form">
                <h4>Write a Review</h4>
                <div className="rating-input">
                  <label>Rating:</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Write your review..."
                  value={review.comment}
                  onChange={(e) => setReview({...review, comment: e.target.value})}
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 