import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FiLoader } from 'react-icons/fi'; // Added for a loading spinner

// Helper: Formats Firestore Timestamp or Date object to a readable string
const formatDateDisplay = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Helper: Formats a date object to a YYYY-MM-DD string for grouping
const getGroupableDate = (date) => {
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toISOString().split('T')[0];
};

// Helper: Formats exercise names nicely (e.g., "bench-press" -> "Bench Press")
const formatExerciseName = (name) => {
    if (typeof name !== 'string' || !name) return '';
    return name
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const logsRef = collection(db, 'workoutLogs');
        const q = query(
          logsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);

        // --- DATA AGGREGATION LOGIC ---
        // This groups all workouts from the same day together.
        const aggregatedData = {};

        querySnapshot.docs.forEach(doc => {
          const log = { id: doc.id, ...doc.data() };
          const dayKey = getGroupableDate(log.date);

          if (!aggregatedData[dayKey]) {
            // If this is the first log for the day, create a new entry
            aggregatedData[dayKey] = {
              date: log.date,
              totalDuration: Number(log.duration) || 0,
              totalSteps: Number(log.steps) || 0,
              allExercises: Array.isArray(log.exercises) ? log.exercises : [],
            };
          } else {
            // If the day already exists, add to the totals
            aggregatedData[dayKey].totalDuration += Number(log.duration) || 0;
            aggregatedData[dayKey].totalSteps += Number(log.steps) || 0;
            if (Array.isArray(log.exercises)) {
              aggregatedData[dayKey].allExercises.push(...log.exercises);
            }
          }
        });

        // Convert the aggregated object back to an array and remove duplicate exercises
        const finalData = Object.values(aggregatedData).map(day => ({
            ...day,
            // Use a Set to automatically handle duplicate exercise names
            allExercises: [...new Set(day.allExercises)]
        }));
        
        setHistoricalData(finalData);
      } catch (err) {
        console.error("Error fetching history: ", err);
        setError('Failed to load workout history.');
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            fetchHistory();
        } else {
            navigate('/login');
        }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 bg-gray-800 text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-white">
          🏋️‍♀️ Your Workout History
        </h1>
        
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <FiLoader className="animate-spin text-emerald-400 text-4xl" />
              <p className="ml-4 text-gray-400">Loading history...</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center p-8">Error: {error}</p>}
          {!loading && !error && historicalData.length === 0 && (
            <p className="text-gray-500 text-center p-8">No workout history logged yet.</p>
          )}
          {!loading && !error && historicalData.length > 0 && (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">Duration (mins)</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">Steps</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Exercises</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((day) => (
                  <tr key={getGroupableDate(day.date)} className="border-b border-gray-800 odd:bg-gray-800/50 even:bg-transparent hover:bg-emerald-900/30 transition-colors duration-200">
                    <td className="p-4 font-medium text-white whitespace-nowrap">{formatDateDisplay(day.date)}</td>
                    <td className="p-4 text-right text-gray-300 font-mono">{day.totalDuration > 0 ? day.totalDuration : '-'}</td>
                    <td className="p-4 text-right text-gray-300 font-mono">{day.totalSteps > 0 ? day.totalSteps.toLocaleString() : '-'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {day.allExercises.length > 0
                          ? day.allExercises.map(ex => (
                              <span key={ex} className="bg-gray-700 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {formatExerciseName(ex)}
                              </span>
                            ))
                          : <span className="text-gray-500">-</span>}
                      </div>
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