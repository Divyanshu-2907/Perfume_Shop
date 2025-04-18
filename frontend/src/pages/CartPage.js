import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart, FiTrash2, FiPlus, FiMinus,
  FiArrowLeft, FiHeart
} from "react-icons/fi";
import "../styles/CartPage.css";
import { useCart } from "../context/CartContext"; // 

const CartPage = () => {
  const { cartItems: cart, removeFromCart, setCartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cart) {
      setLoading(false);
    }
  }, [cart]);

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    item.quantity = newQuantity;
    setCartItems([...cart]);
  };

  const handleQuantityChange = (item, value) => {
    const quantity = Math.max(1, parseInt(value));
    if (!isNaN(quantity)) updateQuantity(item, quantity);
  };

  const moveToWishlist = (item) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (!wishlist.some(w => w._id === item._id)) {
        localStorage.setItem("wishlist", JSON.stringify([...wishlist, item]));
      }
      removeFromCart(item._id);
    } catch (err) {
      setError("There was an issue moving the item to the wishlist.");
    }
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 5.99 : 0;
    return subtotal + shipping;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!cart.length) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <FiShoppingCart className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>Your Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-image-container">
                <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                <div className="item-actions">
                  <button className="action-btn wishlist-btn" onClick={() => moveToWishlist(item)}>
                    <FiHeart />
                  </button>
                  <button className="action-btn remove-btn" onClick={() => removeFromCart(item._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="cart-item-quantity">
                  <button className="quantity-btn" onClick={() => updateQuantity(item, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <FiMinus />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                    min="1"
                  />
                  <button className="quantity-btn" onClick={() => updateQuantity(item, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>
                <div className="item-total">
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-header">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{calculateSubtotal() > 0 ? '$5.99' : 'Free'}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
