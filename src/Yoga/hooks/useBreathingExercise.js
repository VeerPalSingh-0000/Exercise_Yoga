import { useState, useEffect, useCallback, useMemo } from "react";

const useBreathingExercise = (totalCycles = 5) => {
  const breathingConfig = useMemo(
    () => ({
      inhale: 4,
      hold: 2,
      exhale: 4,
      pause: 2,
    }),
    []
  );

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Inhale");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const start = useCallback(() => {
    setIsActive(true);
    setCycleCount(1);
    setPhase("Inhale");
    setTimeRemaining(breathingConfig.inhale);
    setProgress(0);
  }, [breathingConfig.inhale]);

  const stop = useCallback(() => {
    setIsActive(false);
    setCycleCount(0);
    setPhase("Inhale");
    setTimeRemaining(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          // Phase transition
          if (cycleCount >= totalCycles && phase === "Pause") {
            stop();
            return 0;
          }

          let nextPhase, nextDuration;
          switch (phase) {
            case "Inhale":
              nextPhase = "Hold";
              nextDuration = breathingConfig.hold;
              break;
            case "Hold":
              nextPhase = "Exhale";
              nextDuration = breathingConfig.exhale;
              break;
            case "Exhale":
              nextPhase = "Pause";
              nextDuration = breathingConfig.pause;
              break;
            case "Pause":
            default:
              nextPhase = "Inhale";
              nextDuration = breathingConfig.inhale;
              setCycleCount((c) => c + 1);
              break;
          }
          setPhase(nextPhase);
          return nextDuration;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase, cycleCount, totalCycles, stop, breathingConfig]);

  useEffect(() => {
    if (!isActive) return;
    const totalDuration = breathingConfig[phase.toLowerCase()];
    setProgress(1 - timeRemaining / totalDuration);
  }, [timeRemaining, phase, isActive, breathingConfig]);

  return {
    isActive,
    phase,
    timeRemaining,
    progress,
    cycleCount,
    totalCycles,
    start,
    stop,
  };
};

export default useBreathingExercise;