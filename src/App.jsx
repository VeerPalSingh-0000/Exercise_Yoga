<<<<<<< HEAD
// This file is src/App.jsx

import React, { useEffect, useState } from "react";
=======
import React, { useEffect, useState, useCallback } from "react";
>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

<<<<<<< HEAD
// Assuming your firebase.js is in the src/ directory or src/services/
// Adjust the path if necessary.
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

// Import all your page and component files
import AuthOptions from "./pages/AuthOptions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import WorkoutHistory from "./components/WorkoutHistory"; // Note: from components folder
=======
// Import all pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthOptions from "./pages/AuthOptions";
import WorkoutHistory from "./components/WorkoutHistory";
>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Biceps from "./pages/Biceps";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";
import Back from "./pages/Back";
import Leg from "./pages/Leg";
<<<<<<< HEAD
import Keggle from "./pages/Keggle"; // Assuming you have a Keggle page
// --- Custom Hook for Auth State ---
// This hook encapsulates the logic for tracking the current user.
// It's good practice to keep this here or move it to a `hooks` folder.
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscribe function
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, loading };
};

// --- Loading Screen Component ---
// A simple component to show while authentication state is being determined.
const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold">Loading...</h1>
        </div>
    </div>
);

// --- Protected Route Component ---
// This component ensures that only authenticated users can access certain pages.
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    // If there's a user, render the children (the protected page).
    // Otherwise, redirect to the main landing/auth page.
    return user ? children : <Navigate to="/" />;
};


// --- Main App Component ---
// This is the root component that sets up the routing for your application.
const App = () => {
    const { user, loading } = useAuth();

    // Show a loading screen while we check for a user session.
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <Routes>
                {/* Public routes that are accessible whether the user is logged in or not */}
                {/* If a user is logged in, they will be redirected to the dashboard */}
                <Route path="/" element={!user ? <AuthOptions /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

                {/* Protected Routes that require a user to be logged in */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><WorkoutHistory /></ProtectedRoute>} />
                <Route path="/exercises/chest" element={<ProtectedRoute><Chest /></ProtectedRoute>} />
                <Route path="/exercises/tricep" element={<ProtectedRoute><Tricep /></ProtectedRoute>} />
                <Route path="/exercises/bicep" element={<ProtectedRoute><Biceps /></ProtectedRoute>} />
                <Route path="/exercises/abs" element={<ProtectedRoute><Abs /></ProtectedRoute>} />
                <Route path="/exercises/shoulder" element={<ProtectedRoute><Shoulder /></ProtectedRoute>} />
                <Route path="/exercises/yoga" element={<ProtectedRoute><Yoga /></ProtectedRoute>} />
                <Route path="/exercises/back" element={<ProtectedRoute><Back /></ProtectedRoute>} />
                <Route path="/exercises/leg" element={<ProtectedRoute><Leg /></ProtectedRoute>} />
                <Route path="/exercises/keggle" element={<ProtectedRoute><Keggle /></ProtectedRoute>} />
                {/* A fallback route for any path that doesn't match. */}
                {/* It redirects to the dashboard if logged in, or the home page if not. */}
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
            </Routes>
        </Router>
    );
};

export default App;
=======

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Checks for guest mode in localStorage (24h expiry)
  const checkGuestMode = useCallback(() => {
    const guestMode = localStorage.getItem('isGuestMode');
    const guestTimestamp = localStorage.getItem('guestModeTimestamp');
    if (guestMode === "true" && guestTimestamp) {
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000;
      if (now - parseInt(guestTimestamp) < maxAge) {
        setIsGuestMode(true);
        return true;
      } else {
        localStorage.removeItem('isGuestMode');
        localStorage.removeItem('guestModeTimestamp');
      }
    }
    setIsGuestMode(false);
    return false;
  }, []);

  // React to login and guest mode
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        const hasGuest = checkGuestMode();
        if (!hasGuest) setIsGuestMode(false);
      } else {
        // Clear guest mode if user logs in
        if (isGuestMode) {
          setIsGuestMode(false);
          localStorage.removeItem("isGuestMode");
          localStorage.removeItem("guestModeTimestamp");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [checkGuestMode, isGuestMode]);

  const hasAccess = !!user || isGuestMode;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );

  return (
    <Router>
      <Routes>
        {/* Public landing/auth */}
        <Route path="/" element={hasAccess ? <Navigate to="/dashboard" /> : <AuthOptions />} />

        {/* Auth pages */}
        <Route path="/login" element={!hasAccess ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!hasAccess ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={hasAccess ? <Dashboard /> : <Navigate to="/" />} />

        {/* History */}
        <Route path="/history" element={hasAccess ? <WorkoutHistory /> : <Navigate to="/" />} />

        {/* Exercises */}
        <Route path="/exercises/chest" element={hasAccess ? <Chest /> : <Navigate to="/" />} />
        <Route path="/exercises/tricep" element={hasAccess ? <Tricep /> : <Navigate to="/" />} />
        <Route path="/exercises/bicep" element={hasAccess ? <Biceps /> : <Navigate to="/" />} />
        <Route path="/exercises/abs" element={hasAccess ? <Abs /> : <Navigate to="/" />} />
        <Route path="/exercises/shoulder" element={hasAccess ? <Shoulder /> : <Navigate to="/" />} />
        <Route path="/exercises/yoga" element={hasAccess ? <Yoga /> : <Navigate to="/" />} />
        <Route path="/exercises/back" element={hasAccess ? <Back /> : <Navigate to="/" />} />
        <Route path="/exercises/leg" element={hasAccess ? <Leg /> : <Navigate to="/" />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

/*
=========================
IMPORTANT FOR DEPLOYMENT!
=========================
To fix "Page Not Found" on refresh in Vercel/Netlify:

- For Netlify:
    Place a _redirects file in your public/ or dist/ folder with:
      /*    /index.html   200

- For Vercel:
    Add a vercel.json file to project root with:
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
=========================
*/

>>>>>>> adf7b333b19adacd3463ffad555704561dad05d4
