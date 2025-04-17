import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiArrowRight, FiHeart, FiShoppingCart, FiShare2 } from 'react-icons/fi';
import '../styles/FragranceFinder.css';

const FragranceFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const questions = [
    {
      question: "What's your preferred fragrance family?",
      description: "Choose the type of scent that appeals to you most.",
      options: [
        { value: "floral", label: "Floral", description: "Romantic and feminine with flower-based scents" },
        { value: "woody", label: "Woody", description: "Warm and earthy with wood-based notes" },
        { value: "citrus", label: "Citrus", description: "Fresh and energetic with citrus fruits" },
        { value: "oriental", label: "Oriental", description: "Rich and exotic with spices and vanilla" },
        { value: "fresh", label: "Fresh", description: "Clean and light with aquatic or green notes" }
      ]
    },
    {
      question: "What's your favorite season?",
      description: "Select when you plan to wear this fragrance most.",
      options: [
        { value: "spring", label: "Spring", description: "Light and floral scents" },
        { value: "summer", label: "Summer", description: "Fresh and citrusy notes" },
        { value: "autumn", label: "Autumn", description: "Warm and spicy fragrances" },
        { value: "winter", label: "Winter", description: "Rich and intense perfumes" }
      ]
    },
    {
      question: "What's your preferred intensity?",
      description: "How long and strong should your fragrance be?",
      options: [
        { value: "light", label: "Light & Subtle", description: "Perfect for daily wear, 2-4 hours longevity" },
        { value: "medium", label: "Moderate", description: "Balanced projection, 4-6 hours longevity" },
        { value: "strong", label: "Strong & Long-lasting", description: "Bold presence, 6-8+ hours longevity" }
      ]
    },
    {
      question: "What's your budget range?",
      description: "Select your preferred price range.",
      options: [
        { value: "budget", label: "Budget-friendly", description: "Under $50" },
        { value: "mid", label: "Mid-range", description: "$50-$100" },
        { value: "luxury", label: "Luxury", description: "$100+" }
      ]
    },
    {
      question: "What's your preferred occasion?",
      description: "When do you plan to wear this fragrance?",
      options: [
        { value: "daily", label: "Daily Wear", description: "Perfect for work and casual settings" },
        { value: "special", label: "Special Occasions", description: "Ideal for events and celebrations" },
        { value: "work", label: "Work/Professional", description: "Subtle and office-appropriate" },
        { value: "night", label: "Night Out", description: "Bold and attention-grabbing" }
      ]
    }
  ];

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const response = await axios.get('/api/fragrance-quiz/history');
      setQuizHistory(response.data);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const handleAnswer = async (value) => {
    const newAnswers = {
      ...answers,
      [currentStep]: value
    };
    
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        const formattedAnswers = {
          fragranceFamily: newAnswers[0],
          season: newAnswers[1],
          intensity: newAnswers[2],
          budget: newAnswers[3],
          occasion: newAnswers[4]
        };

        const response = await axios.post('/api/fragrance-quiz', {
          answers: formattedAnswers
        });

        if (!response.data || !response.data.recommendedProducts) {
          throw new Error('Invalid response from server');
        }

        setResult({
          recommendedProducts: response.data.recommendedProducts,
          quizId: response.data.quizId
        });

        // Reset retry count on success
        setRetryCount(0);
        
        // Track quiz completion
        trackQuizCompletion(formattedAnswers);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get recommendations';
        const errorCode = err.response?.status;
        
        setError(errorMessage);
        setErrorDetails({
          code: errorCode,
          message: errorMessage,
          timestamp: new Date().toISOString()
        });
        
        // Increment retry count
        setRetryCount(prev => prev + 1);
        
        // Log error for debugging
        console.error('Error submitting quiz:', {
          error: err,
          answers: newAnswers,
          retryCount: retryCount + 1
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const trackQuizCompletion = (answers) => {
    // Analytics tracking
    try {
      window.gtag('event', 'quiz_completion', {
        'event_category': 'Quiz',
        'event_label': 'Fragrance Finder',
        ...answers
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const handleShare = async (product) => {
    try {
      await navigator.share({
        title: 'Check out this fragrance!',
        text: `I found ${product.name} through the Perfume Shop's Fragrance Finder!`,
        url: window.location.origin + '/product/' + product._id
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setErrorDetails(null);
    setRetryCount(0);
  };

  if (loading) {
    return (
      <div className="fragrance-finder">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding your perfect match...</p>
          <p className="loading-tip">Did you know? The right fragrance can boost your confidence and mood!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fragrance-finder">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          {errorDetails && (
            <div className="error-details">
              <p>Error Code: {errorDetails.code || 'Unknown'}</p>
              <p>Time: {new Date(errorDetails.timestamp).toLocaleString()}</p>
            </div>
          )}
          <div className="error-actions">
            <button 
              onClick={restartQuiz} 
              className="restart-btn"
            >
              Start Over
            </button>
            {retryCount < 3 && (
              <button 
                onClick={() => handleAnswer(answers[currentStep])} 
                className="retry-btn"
              >
                Try Again ({3 - retryCount} attempts left)
              </button>
            )}
          </div>
          <p className="error-help">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fragrance-finder-result">
        <h2>Your Perfect Matches</h2>
        <p className="result-description">
          Based on your preferences, we've selected these fragrances just for you.
        </p>
        
        <div className="recommended-products">
          {result.recommendedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.images[0]} alt={product.name} />
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  {"★".repeat(Math.round(product.rating))}
                  {"☆".repeat(5 - Math.round(product.rating))}
                  <span>({product.numReviews})</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="price-container">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">${product.price}</span>
                      <span className="discounted-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="price">${product.price}</span>
                  )}
                </div>
                <div className="product-actions">
                  <button 
                    className="view-product-btn"
                    onClick={() => window.location.href = `/product/${product._id}`}
                  >
                    View Details
                  </button>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {/* Add to cart logic */}}
                  >
                    <FiShoppingCart />
                  </button>
                  <button 
                    className="wishlist-btn"
                    onClick={() => {/* Add to wishlist logic */}}
                  >
                    <FiHeart />
                  </button>
                  <button 
                    className="share-btn"
                    onClick={() => handleShare(product)}
                  >
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button onClick={restartQuiz} className="restart-btn">
            Take Quiz Again
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="history-btn"
          >
            {showHistory ? 'Hide History' : 'Show Previous Results'}
          </button>
        </div>

        {showHistory && quizHistory.length > 0 && (
          <div className="quiz-history">
            <h3>Your Previous Results</h3>
            <div className="history-list">
              {quizHistory.map((quiz, index) => (
                <div key={index} className="history-item">
                  <p className="history-date">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  <div className="history-preferences">
                    <span>{quiz.answers.fragranceFamily}</span>
                    <span>{quiz.answers.season}</span>
                    <span>{quiz.answers.intensity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fragrance-finder">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      <h2>Find Your Perfect Fragrance</h2>
      <p className="question">{questions[currentStep].question}</p>
      <p className="question-description">{questions[currentStep].description}</p>
      
      <div className="options">
        {questions[currentStep].options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleAnswer(option.value)}
          >
            <span className="option-label">{option.label}</span>
            <span className="option-description">{option.description}</span>
          </button>
        ))}
      </div>
      
      <div className="navigation-buttons">
        {currentStep > 0 && (
          <button 
            className="nav-btn back-btn"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            <FiArrowLeft /> Previous
          </button>
        )}
        <span className="step-indicator">
          Step {currentStep + 1} of {questions.length}
        </span>
      </div>
    </div>
  );
};

export default FragranceFinder; 