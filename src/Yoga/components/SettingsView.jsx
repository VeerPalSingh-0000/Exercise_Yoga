import React from "react";

const SettingsView = ({ onResetAllData }) => {
  const handleReset = () => {
    if (confirm("This will reset all your progress, favorites, and custom routines. Are you sure?")) {
      onResetAllData();
      alert("All data has been reset to default.");
    }
  };

  const handleExport = () => {
    // In a real app, you would gather all data from localStorage or state management
    const dataToExport = {
      completed: localStorage.getItem("completedExercises"),
      favorites: localStorage.getItem("favorites"),
      // etc.
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yoga-data-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-300 mb-6">⚙️ Settings</h2>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all"
          >
            📥 Export My Data
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all"
          >
            🔄 Reset All Data
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Export your progress and favorites to a JSON file. Resetting will restore the default
          routine and clear your history.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;