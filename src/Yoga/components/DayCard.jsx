import React from "react";
import YogaItem from "./YogaItem";

const DayCard = React.memo(
  ({
    day,
    dayData,
    isExpanded,
    onToggle,
    completedExercises,
    favorites,
    onToggleComplete,
    onToggleFavorite,
    completionPercentage,
  }) => {
    const isToday = new Date().toLocaleString("en-US", { weekday: "long" }) === day;

    return (
      <div
        className={`bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
          isToday ? "ring-2 ring-blue-600" : ""
        }`}
      >
        <div
          className={`px-6 py-4 cursor-pointer transition-all ${
            isToday
              ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30"
              : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700"
          }`}
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-100 flex items-center">
                {day}
                {isToday && (
                  <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    Today
                  </span>
                )}
              </h2>
              <p className="text-indigo-400 font-medium">{dayData.theme}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">{Math.round(completionPercentage)}%</div>
              </div>
              <div
                className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-6 border-t border-slate-700">
            <div className="mb-6 bg-orange-900/20 rounded-lg p-4 border border-orange-800">
              <h4 className="font-semibold text-orange-300 mb-2">☀️ Surya Namaskar</h4>
              <p className="text-sm text-orange-400">
                <span className="font-medium">Rounds:</span> {dayData.suryanamaskar.rounds} •
                <span className="font-medium ml-2">Benefits:</span>{" "}
                {dayData.suryanamaskar.benefits.join(", ")}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-200">🧘‍♂️ Asanas (Poses)</h4>
              {dayData.asanas.map((asana, index) => {
                const key = `asana-${day}-${index}`;
                return (
                  <YogaItem
                    key={key}
                    item={asana}
                    isCompleted={!!completedExercises[key]}
                    isFavorite={!!favorites[key]}
                    onToggleComplete={() => onToggleComplete("asana", day, index)}
                    onToggleFavorite={() => onToggleFavorite("asana", day, index)}
                  />
                );
              })}
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-200">🫁 Pranayama (Breathing)</h4>
              {dayData.pranayama.map((pran, index) => {
                const key = `pranayama-${day}-${index}`;
                return (
                  <YogaItem
                    key={key}
                    item={pran}
                    isCompleted={!!completedExercises[key]}
                    isFavorite={!!favorites[key]}
                    onToggleComplete={() => onToggleComplete("pranayama", day, index)}
                    onToggleFavorite={() => onToggleFavorite("pranayama", day, index)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default DayCard;