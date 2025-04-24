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

// ✅ Import exercise pages
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Bicep from "./pages/Bicep";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";

// Firebase Auth
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

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
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* ✅ Exercise Pages */}
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
      </Routes>
    </Router>
    
   
  );
};

export default App;
