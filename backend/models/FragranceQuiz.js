const mongoose = require('mongoose');

const fragranceQuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if user is not logged in
  },
  answers: {
    fragranceFamily: {
      type: String,
      required: true,
      enum: ['floral', 'woody', 'citrus', 'oriental', 'fresh']
    },
    season: {
      type: String,
      required: true,
      enum: ['spring', 'summer', 'autumn', 'winter']
    },
    intensity: {
      type: String,
      required: true,
      enum: ['light', 'medium', 'strong']
    },
    budget: {
      type: String,
      required: true,
      enum: ['budget', 'mid', 'luxury']
    },
    occasion: {
      type: String,
      required: true,
      enum: ['daily', 'special', 'work', 'night']
    }
  },
  recommendedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FragranceQuiz', fragranceQuizSchema); 