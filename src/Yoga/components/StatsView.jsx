import React from "react";

const StatsView = ({ stats }) => {
  const avgCompletion =
    Math.round(
      Object.values(stats.completionByDay).reduce((acc, day) => acc + day.percentage, 0) /
        Object.keys(stats.completionByDay).length
    ) || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-300 mb-6">📊 Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900/30 p-4 rounded-xl text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.totalCompleted}</div>
          <div className="text-sm font-semibold text-blue-300">Exercises Completed</div>
        </div>
        <div className="bg-pink-900/30 p-4 rounded-xl text-center">
          <div className="text-3xl font-bold text-pink-400">{stats.totalFavorites}</div>
          <div className="text-sm font-semibold text-pink-300">Favorites</div>
        </div>
        <div className="bg-green-900/30 p-4 rounded-xl text-center">
          <div className="text-3xl font-bold text-green-400">{avgCompletion}%</div>
          <div className="text-sm font-semibold text-green-300">Average Completion</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">Daily Completion Progress</h3>
        {Object.entries(stats.completionByDay).map(([day, data]) => (
          <div key={day} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">{day}</span>
              <span className="text-sm text-gray-400">
                {data.completed}/{data.total} ({Math.round(data.percentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${data.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsView;