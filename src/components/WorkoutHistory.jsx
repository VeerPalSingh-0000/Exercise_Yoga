// src/components/WorkoutHistory.jsx (or src/pages/WorkoutHistory.jsx depending on your file structure)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase"; // --- NEW: Import auth to get user ID
import { db } from "../firebase"; // --- NEW: Import db for Firestore
// --- NEW: Import Firestore functions for querying data ---
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// Helper function to format date (optional, based on how you want to display)
const formatDateDisplay = (date) => {
    if (!date) return 'N/A';
    // Assuming 'date' is a Firebase Timestamp object or a Date object
    try {
         const dateObj = date.toDate ? date.toDate() : new Date(date); // Handle Timestamp or Date
        return dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", date, error);
        return String(date); // Fallback
    }
};


const WorkoutHistory = () => {
    const navigate = useNavigate();

    // State for storing historical data loaded from Firestore
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Effect to Fetch Data from Firestore on Mount ---
    useEffect(() => {
        const fetchHistory = async () => {
            const user = auth.currentUser; // Get the currently logged-in user

            if (!user) {
                setError("User not logged in. Please log in to view history.");
                setLoading(false);
                // Optionally redirect to login if not logged in
                // navigate("/login");
                return;
            }

            setLoading(true); // Start loading state
            setError(null); // Clear previous errors
            setHistoricalData([]); // Clear previous data

            try {
                // Create a query against the "workoutLogs" collection
                const logsRef = collection(db, "workoutLogs");

                // --- NEW: Build the Firestore Query ---
                // Query for documents where userId matches the current user's ID
                // and order them by date descending (most recent first)
                const q = query(
                    logsRef,
                    where("userId", "==", user.uid), // Filter by the current user's ID
                    orderBy("date", "desc") // Order results by the 'date' field, descending
                    // You could add limit() here for pagination if needed
                    // You could add more where() clauses for date range filtering (e.g., where("date", ">=", startDate))
                );

                // Execute the query
                const querySnapshot = await getDocs(q);

                // Map the documents to a usable array of objects
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Include the document ID (useful for updates/deletes later)
                    ...doc.data(), // Get all fields from the document (date, duration, steps, exercises etc.)
                    // The 'date' field fetched from Firestore will be a Timestamp object,
                    // the formatDateDisplay helper handles this conversion.
                }));

                setHistoricalData(data);
                console.log("Loaded history from Firestore:", data); // Debug log

            } catch (err) {
                console.error("Error fetching workout history from Firestore:", err);
                setError("Failed to load workout history.");
                setHistoricalData([]); // Clear data on error
            } finally {
                setLoading(false); // End loading state
            }
        };

        // Call the fetch function when the component mounts or user changes
        fetchHistory();

    }, [auth.currentUser]); // Dependency array: re-run this effect if the logged-in user changes


    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Go Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 bg-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200 shadow"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
                    🏋️‍♀️ Your Workout History
                </h1>

                 {/* --- Info Message (Updated) --- */}
                 <div className="bg-blue-800 bg-opacity-30 border border-blue-600 text-blue-200 p-4 rounded-md mb-6 text-sm">
                     <p className="font-semibold mb-2">Data Source:</p>
                     <p>
                         This history is loaded from your **Firebase Firestore** database,
                         providing permanent storage and syncing across devices.
                     </p>
                      {/* You could add filtering UI (date range, exercise type) here later */}
                 </div>


                {/* --- Display Area: Loading, Error, or Table --- */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
                    {loading && <p className="text-gray-400 text-center">Loading history...</p>}
                    {error && <p className="text-red-500 text-center">Error: {error}</p>}

                    {!loading && !error && historicalData.length === 0 && (
                        <p className="text-gray-400 text-center">No workout history logged yet.</p>
                    )}

                    {!loading && !error && historicalData.length > 0 && (
                        <table className="min-w-full table-auto border-collapse border border-gray-700">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Date</th>
                                    <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Duration (mins)</th>
                                    <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Steps</th>
                                    <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Exercises</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalData.map((log) => ( // Use log.id for the key
                                    <tr key={log.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150">
                                        <td className="p-3 border border-gray-600 text-sm">{formatDateDisplay(log.date)}</td>
                                        <td className="p-3 border border-gray-600 text-sm">{log.duration > 0 ? log.duration : '-'}</td>
                                        <td className="p-3 border border-gray-600 text-sm">{log.steps > 0 ? log.steps : '-'}</td>
                                        <td className="p-3 border border-gray-600 text-sm capitalize">
                                            {log.exercises && log.exercises.length > 0
                                                ? log.exercises.map(ex => ex.replace("-", " ").charAt(0).toUpperCase() + ex.slice(1)).join(', ')
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutHistory;
