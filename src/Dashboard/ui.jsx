import React, { useState, memo, useMemo } from "react";
import { FiEdit, FiLoader, FiSave, FiSettings, FiX } from "react-icons/fi";
import { AVAILABLE_EXERCISES, DAY_NAMES } from "./constants";

export const ProgressBar = memo(({ label, percentage, valueText, icon, isLoading, goal, onGoalChange }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const displayPercentage = Math.min(100, Math.max(0, percentage));

  const handleGoalSave = () => {
    // Ensure the goal is a positive number before saving
    if (tempGoal > 0) {
      onGoalChange?.(Number(tempGoal));
      setIsEditingGoal(false);
    }
  };

  // CORRECTED: Added a cancel handler to reset the temporary state
  const handleGoalCancel = () => {
    setTempGoal(goal);
    setIsEditingGoal(false);
  };
  
  // Open edit mode and ensure tempGoal is current
  const openEditMode = () => {
    setTempGoal(goal);
    setIsEditingGoal(true);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon && <span className="text-emerald-400 mr-2">{icon}</span>}
          <h3 className="text-base font-semibold text-gray-200">{label}</h3>
        </div>
        {onGoalChange && (
          // CORRECTED: Toggle edit mode with a single function call
          <button onClick={() => isEditingGoal ? handleGoalCancel() : openEditMode()}
            className="text-gray-400 hover:text-emerald-400 transition-colors">
            {isEditingGoal ? <FiX size={16} /> : <FiSettings size={16} />}
          </button>
        )}
      </div>
      {isEditingGoal && (
        <div className="mb-3 flex items-center space-x-2">
          <input
            type="number"
            value={tempGoal}
            onChange={e => setTempGoal(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
            min="1"
          />
          {/* CORRECTED: Replaced text with icons for consistency */}
          <button onClick={handleGoalSave} className="text-green-400 hover:text-green-300 p-1">
            <FiSave />
          </button>
          <button onClick={handleGoalCancel} className="text-red-400 hover:text-red-300 p-1">
            <FiX />
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="h-10 flex items-center justify-center">
          <FiLoader className="animate-spin text-emerald-400 text-2xl" />
        </div>
      ) : (
        <div className="relative pt-1">
          <div className="flex mb-1 items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{valueText}</span>
            <span className="text-sm font-medium text-gray-400">{displayPercentage.toFixed(0)}%</span>
          </div>
          <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded bg-gray-700">
            <div
              style={{ width: `${displayPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-out rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
});

export const CircularProgress = memo(
  ({ label, percentage, current, goal, unit, color = "#10b981", isLoading }) => {
    const size = 100, strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (Math.min(percentage, 100) / 100) * circumference;

    if (isLoading)
      return (
        <div className="flex flex-col items-center justify-center h-28 w-24">
          <FiLoader className="animate-spin text-emerald-400 text-2xl mb-2" />
          <span className="text-xs text-gray-400">{label}</span>
        </div>
      );
      
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="transparent" />
            <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-gray-200">{label}</div>
          <div className="text-xs text-gray-400">
            {Math.round(current)}/{goal} {unit}
          </div>
        </div>
      </div>
    );
  }
);

export const WeeklyPlan = memo(
  ({ schedule, isEditable, onExerciseClick, onExerciseChange, highlightIndex }) => {
    
    // IMPROVEMENT: Create the options list once to avoid re-mapping inside every select
    const exerciseOptions = useMemo(() => (
        <>
            <option value="">- Empty -</option>
            {AVAILABLE_EXERCISES.map((ex) => (
                <option key={ex} value={ex} className="capitalize">{ex}</option>
            ))}
        </>
    ), []);

    return (
      <div className="space-y-4">
        {DAY_NAMES.map((day, dayIndex) => {
          const isToday = dayIndex === highlightIndex;
          const dayExercises = schedule[dayIndex] || [];
          
          // IMPROVEMENT: Filter out empty exercises for cleaner display logic
          const exercisesToShow = dayExercises.filter(Boolean);

          return (
            <div
              key={day}
              className={`p-4 rounded-lg flex items-center transition-all duration-300 ${isToday ? "bg-emerald-900/50 border-2 border-emerald-500" : "bg-gray-800"}`}
            >
              <div className="w-28 flex-shrink-0">
                <p className="font-bold text-lg text-white">{day}</p>
                {isToday && (<p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Today</p>)}
              </div>
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 items-center">
                {isEditable ? (
                  // CORRECTED: Use a loop to create a fixed number of slots (e.g., 3) instead of a hardcoded few.
                  // This makes the component more flexible.
                  [0, 1, 2].map((exerciseIndex) => (
                    <select
                      key={exerciseIndex}
                      value={dayExercises[exerciseIndex] || ""}
                      onChange={e => onExerciseChange(dayIndex, exerciseIndex, e.target.value)}
                      className="bg-gray-700 p-2 rounded w-full text-sm capitalize"
                    >
                      {exerciseOptions}
                    </select>
                  ))
                ) : exercisesToShow.length > 0 ? (
                  exercisesToShow.map(
                    (ex, exIndex) => (
                      <span key={exIndex} onClick={() => onExerciseClick(ex)} className="bg-gray-700 capitalize text-gray-200 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-emerald-600 transition-colors text-center">
                        {ex}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500 sm:col-span-2 lg:col-span-3">Rest Day</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);