const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Elegant Rose",
    description: "A sophisticated floral fragrance with notes of rose, jasmine, and vanilla.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80"
    ],
    category: "Women's Fragrance",
    tags: ["floral", "spring", "special", "medium", "mid"],
    inStock: true,
    stockCount: 50,
    rating: 4.5,
    numReviews: 120,
    featured: true,
    discount: 0
  },
  {
    name: "Ocean Breeze",
    description: "Fresh and invigorating aquatic fragrance with citrus and marine notes.",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
    ],
    category: "Unisex",
    tags: ["fresh", "summer", "daily", "light", "mid"],
    inStock: true,
    stockCount: 75,
    rating: 4.2,
    numReviews: 85,
    featured: true,
    discount: 10
  },
  {
    name: "Midnight Oud",
    description: "Rich and mysterious oriental fragrance with oud, amber, and spices.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
      "https://images.unsplash.com/photo-1615160460366-2c9a41771b51?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    category: "Men's Fragrance",
    tags: ["oriental", "winter", "night", "strong", "luxury"],
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    numReviews: 65,
    featured: true,
    discount: 0
  },
  {
    name: "Citrus Splash",
    description: "Energizing blend of lemon, bergamot, and mandarin orange.",
    price: 69.99,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
      "https://images.unsplash.com/photo-1680607618721-1a308edc6851?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    category: "Unisex",
    tags: ["citrus", "summer", "daily", "light", "budget"],
    inStock: true,
    stockCount: 100,
    rating: 4.3,
    numReviews: 95,
    featured: false,
    discount: 15
  },
  {
    name: "Vanilla Dreams",
    description: "Sweet and warm vanilla fragrance with hints of tonka bean and musk.",
    price: 94.99,
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
    ],
    category: "Women's Fragrance",
    tags: ["oriental", "autumn", "special", "medium", "mid"],
    inStock: true,
    stockCount: 45,
    rating: 4.6,
    numReviews: 78,
    featured: false,
    discount: 0
  },
  {
    name: "Lavender Fields",
    description: "Calming and fresh aromatic fragrance with lavender, sage, and bergamot.",
    price: 74.99,
    images: [
      "https://images.unsplash.com/photo-1705936118918-870095881e61?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1588482587611-692b19ee797b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    category: "Unisex",
    tags: ["floral", "spring", "daily", "light", "budget"],
    inStock: true,
    stockCount: 60,
    rating: 4.4,
    numReviews: 92,
    featured: false,
    discount: 5
  },
  {
    name: "Leather & Tobacco",
    description: "Sophisticated blend of leather, tobacco leaf, and warm spices.",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80",
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80"
    ],
    category: "Men's Fragrance",
    tags: ["woody", "winter", "special", "strong", "luxury"],
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    numReviews: 45,
    featured: true,
    discount: 0
  },
  {
    name: "Cherry Blossom",
    description: "Delicate floral fragrance with cherry blossom, peony, and white musk.",
    price: 84.99,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      "https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    category: "Women's Fragrance",
    tags: ["floral", "spring", "daily", "light", "mid"],
    inStock: true,
    stockCount: 55,
    rating: 4.5,
    numReviews: 88,
    featured: false,
    discount: 10
  },
  {
    name: "Forest Pine",
    description: "Refreshing woody fragrance with pine needles, cedar, and earthy notes.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1635796332668-78830169097d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
    ],
    category: "Men's Fragrance",
    tags: ["woody", "winter", "daily", "medium", "mid"],
    inStock: true,
    stockCount: 40,
    rating: 4.3,
    numReviews: 72,
    featured: false,
    discount: 0
  },
  {
    name: "Coconut Paradise",
    description: "Tropical blend of coconut, vanilla, and sun-kissed flowers.",
    price: 64.99,
    images: [
      "https://plus.unsplash.com/premium_photo-1673823666050-bb56202cc9e4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"
    ],
    category: "Women's Fragrance",
    tags: ["floral", "summer", "daily", "light", "budget"],
    inStock: true,
    stockCount: 85,
    rating: 4.2,
    numReviews: 65,
    featured: false,
    discount: 20
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Successfully seeded products');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
