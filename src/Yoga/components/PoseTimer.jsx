import React, { useState, useEffect, useRef } from "react";

const PoseTimer = () => {
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef(null);

  const isActive = timeRemaining > 0;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const startTimer = (seconds) => {
    clearInterval(intervalRef.current);
    setDuration(seconds);
    setTimeRemaining(seconds);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-green-900/20 to-teal-900/20 rounded-xl p-4 border border-green-800">
      <h3 className="text-lg font-semibold mb-3 text-green-500">⏱️ Pose Timer</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {[60, 180, 300, 600].map((sec) => (
          <button
            key={sec}
            onClick={() => startTimer(sec)}
            disabled={isActive}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-lg text-sm font-medium transition-all"
          >
            {sec / 60} min
          </button>
        ))}
        {isActive && (
          <button
            onClick={stopTimer}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
          >
            Stop
          </button>
        )}
      </div>
      {isActive && (
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-400">Time remaining</div>
        </div>
      )}
    </div>
  );
};

export default PoseTimer;