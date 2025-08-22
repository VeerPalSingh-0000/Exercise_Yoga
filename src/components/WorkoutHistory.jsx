import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Helper: Formats Firestore Timestamp or Date object
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
    return String(date);
  }
};

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workouts for logged-in user
  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in. Please log in to view history.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHistoricalData([]);

      try {
        const logsRef = collection(db, 'workoutLogs');
        const q = query(
          logsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistoricalData(data);
      } catch (err) {
        setError('Failed to load workout history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [auth.currentUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 bg-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          🏋️‍♀️ Your Workout History
        </h1>

        <div className="bg-blue-800 bg-opacity-30 border border-blue-600 text-blue-200 p-4 rounded-md mb-6 text-sm">
          <p className="font-semibold mb-2">Data Source:</p>
          <p>
            This history is loaded from your <strong>Firebase Firestore</strong> database,
            providing permanent storage and syncing across devices.
          </p>
        </div>

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
                {historicalData.map((log) => (
                  <tr key={log.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-3 border border-gray-600 text-sm">{formatDateDisplay(log.date)}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.duration > 0 ? log.duration : '-'}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.steps > 0 ? log.steps : '-'}</td>
                    <td className="p-3 border border-gray-600 text-sm capitalize">
                      {Array.isArray(log.exercises) && log.exercises.length > 0
                        ? log.exercises.map(
                          ex => ex.replace("-", " ").charAt(0).toUpperCase() + ex.slice(1)
                        ).join(', ')
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
