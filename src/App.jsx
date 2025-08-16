// This file is src/App.jsx

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import Chest from "./pages/Chest";
import Tricep from "./pages/Tricep";
import Biceps from "./pages/Biceps";
import Abs from "./pages/Abs";
import Shoulder from "./pages/Shoulder";
import Yoga from "./pages/Yoga";
import Back from "./pages/Back";
import Leg from "./pages/Leg";
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
