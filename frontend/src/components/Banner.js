import React from "react";
import { Link } from "react-router-dom";
import "../styles/Banner.css";
import bannerImage from "../assets/banner-dark.png"; // Use dark theme by default

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1 className="fade-in">Luxury Perfumes, Just for You</h1>
        <p className="fade-in">Discover our exclusive collection of premium fragrances.</p>
        <Link to="/products">
          <button className="shop-now-btn">Shop Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
