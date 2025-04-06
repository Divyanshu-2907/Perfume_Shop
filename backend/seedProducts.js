const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Delete existing products
    console.log("🗑️ Old products deleted!");

    await Product.insertMany([
      {
        name: "Gucci Guilty",
        description: "A modern, bold fragrance.",
        price: 130,
        images: ["/images/gucci-guilty.png"]
      },
      {
        name: "Versace Eros",
        description: "A fresh, woody scent.",
        price: 110,
        images: ["/images/versace-eros.png"]
      },
      {
        name: "Armani Code",
        description: "A timeless, seductive scent.",
        price: 120,
        images: ["/images/armani-code.png"]
      },
      {
        name: "Bleu de Chanel",
        description: "An intense, sophisticated fragrance.",
        price: 140,
        images: ["/images/bleu-de-chanel.png"]
      },
      {
        name: "Tom Ford Noir",
        description: "A mysterious, rich scent.",
        price: 150,
        images: ["/images/tom-ford-noir.png"]
      },
      {
        name: "Dior Fahrenheit",
        description: "A warm, spicy fragrance.",
        price: 125,
        images: ["/images/dior-fahrenheit.png"]
      }
    ]);

    console.log("✅ Database Seeded with 6 Products");
    mongoose.connection.close(); // Disconnect properly
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedProducts();
