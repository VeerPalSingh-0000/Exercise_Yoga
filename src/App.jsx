import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import all pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthOptions from "./pages/AuthOptions";
import WorkoutHistory from "./components/WorkoutHistory";
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Biceps from "./pages/Biceps";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";
import Back from "./pages/Back";
import Leg from "./pages/Leg";

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

