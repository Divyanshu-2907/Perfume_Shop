const express = require('express');
const router = express.Router();
const FragranceQuiz = require('../models/FragranceQuiz');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Submit quiz answers and get recommendations
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Find matching products based on quiz answers
    const recommendedProducts = await Product.find({
      tags: { 
        $all: [
          answers.fragranceFamily,
          answers.season,
          answers.occasion
        ]
      }
    })
    .sort({ rating: -1 }) // Sort by rating
    .limit(5);

    // If no exact matches found, try to find partial matches
    if (recommendedProducts.length === 0) {
      const partialMatches = await Product.find({
        tags: { 
          $in: [
            answers.fragranceFamily,
            answers.season,
            answers.occasion
          ]
        }
      })
      .sort({ rating: -1 })
      .limit(5);

      recommendedProducts.push(...partialMatches);
    }

    // Create new quiz entry
    const quizEntry = new FragranceQuiz({
      user: req.user?.id, // Optional user ID if authenticated
      answers,
      recommendedProducts: recommendedProducts.map(p => p._id)
    });

    await quizEntry.save();

    res.json({
      success: true,
      recommendedProducts,
      quizId: quizEntry._id
    });
  } catch (error) {
    console.error('Error processing quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing quiz answers',
      error: error.message
    });
  }
});

// Get user's quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const quizzes = await FragranceQuiz.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('recommendedProducts');

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching quiz history' 
    });
  }
});

// Get specific quiz result
router.get('/:id', async (req, res) => {
  try {
    const quiz = await FragranceQuiz.findById(req.params.id)
      .populate('recommendedProducts');

    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching quiz result' 
    });
  }
});

module.exports = router; 