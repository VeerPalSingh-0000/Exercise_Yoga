import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Helper for formatting date (returns yyyy-mm-dd)
const formatDateKey = (date) => {
  try {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  } catch {
    return 'N/A';
  }
};

// Helper for pretty date for display
const formatDateDisplay = (date) => {
  try {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return String(date);
  }
};

const NutritionHistory = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]); // one row per date
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutrition = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const logsRef = collection(db, 'nutritionLogs');
        const q = query(
          logsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        // Aggregate by date
        const aggregate = {};
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          const dateKey = formatDateKey(data.date);
          if (!aggregate[dateKey]) {
            aggregate[dateKey] = {
              date: data.date,
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0
            };
          }
          aggregate[dateKey].calories += Number(data.calories) || 0;
          aggregate[dateKey].protein += Number(data.protein) || 0;
          aggregate[dateKey].carbs += Number(data.carbs) || 0;
          aggregate[dateKey].fats += Number(data.fats) || 0;
        });
        // Convert to array and sort by date desc
        const rows = Object.values(aggregate)
          .sort((a, b) => b.date.seconds - a.date.seconds);
        setRows(rows);
      } catch (err) {
        setError('Failed to load nutrition history.');
        console.error('Nutrition query error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, [auth.currentUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 bg-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          🥗 Your Nutrition History
        </h1>
        <div className="bg-blue-800 bg-opacity-30 border border-blue-600 text-blue-200 p-4 rounded-md mb-6 text-sm">
          All data sourced from your <strong>Firebase Firestore</strong>.
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
          {loading && <p className="text-gray-400 text-center">Loading history...</p>}
          {error && <p className="text-red-500 text-center">Error: {error}</p>}
          {!loading && !error && rows.length === 0 && (
            <p className="text-gray-400 text-center">No nutrition history logged yet.</p>
          )}
          {!loading && !error && rows.length > 0 && (
            <table className="min-w-full table-auto border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Date</th>
                  <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Calories (kcal)</th>
                  <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Protein (g)</th>
                  <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Carbs (g)</th>
                  <th className="p-3 border border-gray-600 text-left text-sm md:text-base">Fats (g)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((log, idx) => (
                  <tr key={idx} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-3 border border-gray-600 text-sm">{formatDateDisplay(log.date)}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.calories}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.protein}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.carbs}</td>
                    <td className="p-3 border border-gray-600 text-sm">{log.fats}</td>
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

export default NutritionHistory;
