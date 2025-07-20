import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthOptions from "./pages/AuthOptions";

// Import the new WorkoutHistory component
import WorkoutHistory from "./components/WorkoutHistory";

// Import exercise pages
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Bicep from "./pages/Biceps";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";
import Biceps from "./pages/Biceps";
import Back from "./pages/Back";
import Leg from "./pages/Leg";

// Firebase Auth
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // ✅ UPDATED: Check both Firebase auth AND guest mode
  useEffect(() => {
    console.log('🔍 App: Checking authentication status...');
    
    // Check for guest mode
    const checkGuestMode = () => {
      const guestMode = localStorage.getItem('isGuestMode');
      const guestTimestamp = localStorage.getItem('guestModeTimestamp');
      
      if (guestMode === 'true' && guestTimestamp) {
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - parseInt(guestTimestamp) < twentyFourHours) {
          console.log('✅ App: Valid guest session found');
          setIsGuestMode(true);
          return true;
        } else {
          console.log('❌ App: Guest session expired');
          localStorage.removeItem('isGuestMode');
          localStorage.removeItem('guestModeTimestamp');
        }
      }
      return false;
    };

    // Check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔍 App: Firebase auth state changed:', !!currentUser);
      setUser(currentUser);
      
      // If no Firebase user, check for guest mode
      if (!currentUser) {
        const hasValidGuestSession = checkGuestMode();
        if (!hasValidGuestSession) {
          setIsGuestMode(false);
        }
      } else {
        // Clear guest mode if user logs in
        setIsGuestMode(false);
        localStorage.removeItem('isGuestMode');
        localStorage.removeItem('guestModeTimestamp');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ NEW: Create effective user that includes guest mode
  const hasAccess = user || isGuestMode;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  console.log('🔍 App render - User:', !!user, 'Guest:', isGuestMode, 'HasAccess:', hasAccess);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          // ✅ UPDATED: If user OR guest mode exists, navigate to dashboard
          element={hasAccess ? <Navigate to="/dashboard" /> : <AuthOptions />}
        />
        <Route
          path="/login"
          // ✅ UPDATED: If user OR guest mode exists, redirect from login page
          element={!hasAccess ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          // ✅ UPDATED: If user OR guest mode exists, redirect from signup page
          element={!hasAccess ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          // ✅ UPDATED: Accessible if logged in OR in guest mode
          element={hasAccess ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* ✅ UPDATED: Workout History Route - Protected */}
        <Route
          path="/history"
          element={hasAccess ? <WorkoutHistory /> : <Navigate to="/" />}
        />

        {/* ✅ UPDATED: Exercise Pages - Accessible in guest mode too */}
        <Route
          path="/exercises/tricep"
          element={hasAccess ? <Tricep /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/bicep"
          element={hasAccess ? <Biceps /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/chest"
          element={hasAccess ? <Chest /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/abs"
          element={hasAccess ? <Abs /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/shoulder"
          element={hasAccess ? <Shoulder /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/yoga"
          element={hasAccess ? <Yoga /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/back"
          element={hasAccess ? <Back /> : <Navigate to="/" />}
        />
        <Route
          path="/exercises/leg"
          element={hasAccess ? <Leg /> : <Navigate to="/" />}
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
