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
import WorkoutHistory from "./components/WorkoutHistory"; // Assuming it's in components folder

// Import exercise pages
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Bicep from "./pages/Biceps";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";

// Firebase Auth
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Biceps from "./pages/Biceps";
import Back from "./pages/Back";
import Leg from "./pages/Leg";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          // If user exists, navigate to dashboard.
          // If user does NOT exist, show the AuthOptions page.
          element={user ? <Navigate to="/dashboard" /> : <AuthOptions />}
        />
        <Route
          path="/login"
          // Keep existing logic: if user logged in, redirect from login page
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          // Keep existing logic: if user logged in, redirect from signup page
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          // Protected route: only accessible if logged in
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* --- New: Workout History Route - Protected --- */}
        <Route
          path="/history"
          // Protected route: only accessible if logged in
          element={user ? <WorkoutHistory /> : <Navigate to="/login" />}
        />

        {/* Exercise Pages - Protected Routes */}
        <Route
          path="/exercises/tricep"
          element={user ? <Tricep /> : <Navigate to="/login" />}
        />
        <Route
          path="/exercises/bicep"
          element={user ? <Bicep /> : <Navigate to="/login" />}
        />
        <Route
          path="/exercises/chest"
          element={user ? <Chest /> : <Navigate to="/login" />}
        />
        <Route
          path="/exercises/abs"
          element={user ? <Abs /> : <Navigate to="/login" />}
        />
        <Route
          path="/exercises/shoulder"
          element={user ? <Shoulder /> : <Navigate to="/login" />}
        />
         <Route
            path="/exercises/yoga"
            element={user ? <Yoga /> : <Navigate to="/login" />}
         />
         <Route
            path="/exercises/bicep"
            element={user ? <Biceps /> : <Navigate to="/login" />}
         />
         <Route
            path="/exercises/back"
            element={user ? <Back /> : <Navigate to="/login" />}
         />
         <Route
            path="/exercises/leg"
            element={user ? <Leg /> : <Navigate to="/login" />}
         />
      </Routes>
    </Router>
  );
};

export default App;