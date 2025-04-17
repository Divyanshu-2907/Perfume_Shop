const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    console.log("📥 Fetching all products...");
    const products = await Product.find()
      .sort({ 
        featured: -1, // Show featured products first
        rating: -1,   // Then sort by rating
        createdAt: -1 // Then by newest
      })
      .limit(20); // Limit to 20 products for performance

    console.log(`✅ Found ${products.length} products`);

    if (products.length === 0) {
      console.log("❌ No products found in database");
      return res.status(404).json({ 
        message: "No products found",
        success: false
      });
    }

    // Log a sample product for debugging
    if (products.length > 0) {
      console.log("📦 Sample product:", {
        name: products[0].name,
        price: products[0].price,
        category: products[0].category
      });
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ 
      message: "Error fetching products", 
      error: error.message,
      success: false
    });
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// POST - Add a new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      images, // Expecting an array of image URLs
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

// PUT - Update an existing product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// DELETE - Remove a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;
