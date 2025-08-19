import React, { useMemo } from "react";
import useBreathingExercise from "../hooks/useBreathingExercise";

const BreathingExercise = () => {
  const { isActive, phase, timeRemaining, progress, cycleCount, totalCycles, start, stop } =
    useBreathingExercise(5);

  const bubbleSize = useMemo(() => {
    const minSize = 120;
    const maxSize = 240;
    const sizeRange = maxSize - minSize;

    if (!isActive) return minSize;

    switch (phase) {
      case "Inhale":
        return minSize + sizeRange * progress;
      case "Hold":
        return maxSize;
      case "Exhale":
        return maxSize - sizeRange * progress;
      case "Pause":
        return minSize;
      default:
        return minSize;
    }
  }, [isActive, phase, progress]);

  if (!isActive) {
    return (
      <div className="text-center mb-6">
        <button
          onClick={start}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          💨 Begin Serenity Breath ({totalCycles} Cycles)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mb-8 bg-blue-900/20 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-blue-300 mb-4">{phase}</h3>
      <div className="relative mb-4 w-[280px] h-[280px] flex items-center justify-center">
        {/* Animated Bubble */}
        <div
          className="absolute rounded-full border-4 border-white/40 shadow-2xl flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            width: `${bubbleSize}px`,
            height: `${bubbleSize}px`,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.9), rgba(29, 78, 216, 1))`,
          }}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{timeRemaining.toFixed(1)}</div>
            <div className="text-xs opacity-80">seconds</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-blue-300 font-semibold mb-3">
          Cycle: {cycleCount} of {totalCycles}
        </p>
      </div>

      <button
        onClick={stop}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
      >
        Stop Exercise
      </button>
    </div>
  );
};

export default BreathingExercise;