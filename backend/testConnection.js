const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB');

    // Check if we have any products
    const productCount = await Product.countDocuments();
    console.log(`Found ${productCount} products in the database`);

    if (productCount === 0) {
      console.log('No products found. You may need to run the seed script.');
    } else {
      // Get a sample of products
      const products = await Product.find().limit(2);
      console.log('\nSample products:');
      products.forEach(product => {
        console.log(`- ${product.name} ($${product.price})`);
      });
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

testConnection(); 