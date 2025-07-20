// src/pages/AuthOptions.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import './AuthOptions.css'; // We'll create this CSS file

const AuthOptions = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Animated features carousel
  const features = [
    {
      emoji: "💪",
      title: "Track Your Workouts",
      description: "Monitor your fitness progress with detailed analytics"
    },
    {
      emoji: "🍎",
      title: "Nutrition Tracking",
      description: "Log your meals and track macro/micronutrients"
    },
    {
      emoji: "🏋️‍♂️",
      title: "Custom Workouts",
      description: "Create personalized workout plans for your goals"
    },
    {
      emoji: "📊",
      title: "Progress Analytics",
      description: "Visualize your fitness journey with charts and insights"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Handle guest mode
// In AuthOptions.jsx - Updated handleGuestMode function
const handleGuestMode = () => {
  try {
    console.log('🔍 Starting guest mode activation...');
    
    // Set guest mode flags
    localStorage.setItem('isGuestMode', 'true');
    localStorage.setItem('guestModeTimestamp', Date.now().toString());
    
    // Verify storage
    const verifyGuest = localStorage.getItem('isGuestMode');
    const verifyTimestamp = localStorage.getItem('guestModeTimestamp');
    
    console.log('✅ Guest mode set:', verifyGuest);
    console.log('✅ Timestamp set:', verifyTimestamp);
    
    // ✅ NEW: Trigger a storage event to notify App.js
    window.dispatchEvent(new Event('storage'));
    
    // ✅ NEW: Use window.location for immediate navigation
    console.log('🚀 Navigating to dashboard...');
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('❌ Error setting guest mode:', error);
    // Fallback: direct navigation
    window.location.href = '/dashboard';
  }
};


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-options-container">
      {/* Animated Background Elements */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Content */}
      <motion.div
        className="main-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand Section */}
        <motion.div
          className="brand-section"
          variants={itemVariants}
        >
          <div className="logo-container">
            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="brand-title">
            Fit<span className="brand-accent">Pro</span>
          </h1>
          <p className="brand-subtitle">
            Your personal fitness companion for a healthier, stronger you
          </p>
        </motion.div>

        {/* Features Carousel */}
        <motion.div
          className="features-carousel"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="feature-slide"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="feature-emoji">{features[currentSlide].emoji}</div>
              <h3 className="feature-title">
                {features[currentSlide].title}
              </h3>
              <p className="feature-description">
                {features[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Authentication Buttons */}
        <motion.div
          className="auth-buttons"
          variants={itemVariants}
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/login" className="auth-button login-button">
              <div className="button-content">
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/signup" className="auth-button signup-button">
              <div className="button-content">
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Create Account</span>
              </div>
            </Link>
          </motion.div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-text">
              <span>Or explore as guest</span>
            </div>
          </div>

          {/* Guest Mode Option */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleGuestMode}
            className="guest-button"
          >
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Continue as Guest</span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div className="footer-section" variants={itemVariants}>
          <p className="footer-text">
            By continuing, you agree to our{' '}
            <button className="footer-link">Terms of Service</button>
            {' '}and{' '}
            <button className="footer-link">Privacy Policy</button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthOptions;
