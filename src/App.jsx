// This file is src/App.jsx

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

// dashboard
import Dashboard from "./Dashboard/Dashboard";

// Import all your page and component files
import AuthOptions from "./Auth/AuthOptions";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Exercise from "./Exercise/Exercise";
import WorkoutHistory from "./components/WorkoutHistory"; 
import NutritionHistory from './components/NutritionHistory';

import Chest from "./individual-exercises/Chest";
import Tricep from "./individual-exercises/Tricep";
import Biceps from "./individual-exercises/Biceps";
import Abs from "./individual-exercises/Abs/Abs";
import Forearm from "./individual-exercises/Forearm/Forearm";
import Shoulder from "./individual-exercises/Shoulder";
import Back from "./individual-exercises/Back";
import Leg from "./individual-exercises/Leg";
import Keggle from "./individual-exercises/Keggle";


import Yoga from "./Yoga/Yoga";

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
                {/* If a user is logged in, they will be redirected to the exercise */}
                <Route path="/" element={!user ? <AuthOptions /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

                {/* Protected Routes that require a user to be logged in */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><WorkoutHistory /></ProtectedRoute>} />
                <Route path="/nutrition-history" element={<ProtectedRoute><NutritionHistory /></ProtectedRoute>} />
                <Route path="/exercises/chest" element={<ProtectedRoute><Chest /></ProtectedRoute>} />
                <Route path="/exercises/tricep" element={<ProtectedRoute><Tricep /></ProtectedRoute>} />
                <Route path="/exercises/bicep" element={<ProtectedRoute><Biceps /></ProtectedRoute>} />
                <Route path="/exercises/abs" element={<ProtectedRoute><Abs /></ProtectedRoute>} />
                <Route path="/exercises/shoulder" element={<ProtectedRoute><Shoulder /></ProtectedRoute>} />
                <Route path="/yoga" element={<ProtectedRoute><Yoga /></ProtectedRoute>} />
                <Route path="/exercises/back" element={<ProtectedRoute><Back /></ProtectedRoute>} />
                <Route path="/exercises/leg" element={<ProtectedRoute><Leg /></ProtectedRoute>} />
                <Route path="/exercises/keggle" element={<ProtectedRoute><Keggle /></ProtectedRoute>} />
                <Route path="/exercises/arm" element={<ProtectedRoute><Forearm /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to={user ? "/exercise" : "/"} replace />} />
            </Routes>
        </Router>
    );
};

export default App;
