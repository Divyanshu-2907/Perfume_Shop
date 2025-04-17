import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {/* ✅ Display first image if available */}
      {product.images?.length > 0 ? (
        <img src={product.images[0]} alt={product.name} className="product-image" />
      ) : (
        <p className="no-image">No Image Available</p>
      )}

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>

        {/* ✅ Link to Product Page */}
        <Link to={`/product/${product._id}`}>
          <button className="view-details-btn">View Details</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
