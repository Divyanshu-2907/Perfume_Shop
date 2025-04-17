import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiCreditCard, FiCheck } from "react-icons/fi";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 5.99 : 0;
    return subtotal + shipping;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    alert("Thank you for your purchase!");
    localStorage.removeItem("cart");
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
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
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase in a few simple steps</p>
      </div>

      <div className="checkout-steps">
        <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 1 ? <FiCheck /> : "1"}</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 2 ? <FiCheck /> : "2"}</div>
          <div className="step-label">Payment</div>
        </div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-form">
          {currentStep === 1 && (
            <form onSubmit={handleNextStep}>
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-control"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      className="form-control"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="form-control"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="checkout-btn">
                Continue to Payment
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleNextStep}>
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <div
                    className={`payment-method ${formData.paymentMethod === "credit" ? "active" : ""}`}
                    onClick={() => handlePaymentMethodSelect("credit")}
                  >
                    <FiCreditCard className="payment-icon" />
                    <div>Credit Card</div>
                  </div>
                  <div
                    className={`payment-method ${formData.paymentMethod === "paypal" ? "active" : ""}`}
                    onClick={() => handlePaymentMethodSelect("paypal")}
                  >
                    <FiCreditCard className="payment-icon" />
                    <div>PayPal</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="checkout-btn"
                  onClick={handlePreviousStep}
                  style={{ background: "#718096" }}
                >
                  Back
                </button>
                <button type="submit" className="checkout-btn">
                  Continue to Confirmation
                </button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Order Confirmation</h3>
                <p>Please review your order details before confirming.</p>
                <div className="summary-item">
                  <div className="item-details">
                    <div>
                      <h4>Shipping Address</h4>
                      <p>
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.state} {formData.zipCode}
                        <br />
                        {formData.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="item-details">
                    <div>
                      <h4>Payment Method</h4>
                      <p>{formData.paymentMethod === "credit" ? "Credit Card" : "PayPal"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="checkout-btn"
                  onClick={handlePreviousStep}
                  style={{ background: "#718096" }}
                >
                  Back
                </button>
                <button type="submit" className="checkout-btn">
                  Place Order
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="order-summary">
          <h3 className="summary-header">Order Summary</h3>
          {cart.map((item, index) => (
            <div key={index} className="summary-item">
              <div className="item-details">
                <img src={item.images[0]} alt={item.name} className="item-image" />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-quantity">Quantity: {item.quantity}</div>
                </div>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
