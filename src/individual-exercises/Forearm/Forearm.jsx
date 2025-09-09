// src/components/ForearmWorkout/Forearm.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data and Assets
import motivationalSound from '../../assets/sounds/workout_motivation.mp3'; // Change to your actual sound
import { workoutsByPhase, achievements } from './data/workoutData'; // Use your forearm data

// Utils
import { getStorageItem, setStorageItem } from './utils/storage';
import { formatTime, formatDateToYYYYMMDD } from './utils/helpers';

// UI Components
import Header from './Header';
import ArmSizeSelector from './ArmSizeSelector'; // For forearm size selection
import PlanOverview from './PlanOverview';
import WorkoutDisplay from './WorkoutDisplay';
import RestTimer from './RestTimer';
import StatsModal from './StatsModal';
import AchievementNotification from './AchievementNotification';

const Forearm = () => {
  // State Management—use "forearm" keys for separation
  const [appState, setAppState] = useState(() => getStorageItem('forearmAppState', 'selection'));
  const [userProfile, setUserProfile] = useState(() => getStorageItem('forearmUserProfile', null));
  const [currentPhase, setCurrentPhase] = useState(() => getStorageItem('forearmCurrentPhase', 1));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [audio] = useState(() => new Audio(motivationalSound));
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('forearmSoundEnabled', true));
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState(() =>
    getStorageItem('forearmWorkoutHistory', [])
  );
  const [userAchievements, setUserAchievements] = useState(() =>
    getStorageItem('forearmUserAchievements', achievements)
  );
  const [showStats, setShowStats] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  const intervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  // Effects for managing local storage and side effects
  useEffect(() => setStorageItem('forearmSoundEnabled', isSoundEnabled), [isSoundEnabled]);
  useEffect(() => setStorageItem('forearmWorkoutHistory', workoutHistory), [workoutHistory]);
  useEffect(() => setStorageItem('forearmUserAchievements', userAchievements), [userAchievements]);
  useEffect(() => setStorageItem('forearmAppState', appState), [appState]);
  useEffect(() => setStorageItem('forearmUserProfile', userProfile), [userProfile]);
  useEffect(() => setStorageItem('forearmCurrentPhase', currentPhase), [currentPhase]);

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.3;
    if (isRunning && isSoundEnabled && !isResting) {
      audio.play().catch(error => console.error("Audio playback failed:", error));
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isRunning, isSoundEnabled, isResting, audio]);

  useEffect(() => {
    if (isRunning && !isResting) {
      intervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isResting]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            clearInterval(restIntervalRef.current);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restIntervalRef.current);
  }, [isResting, restTimer]);

  // Core Logic Functions
  const checkAchievements = useCallback(
    completedWorkoutData => {
      const newHistoryLength = workoutHistory.length + 1;
      const updatedAchievements = userAchievements.map(ach => {
        if (ach.unlocked) return ach;
        let newlyUnlocked = false;
        if (ach.phase && ach.phase === completedWorkoutData.phase) newlyUnlocked = true;
        if (ach.count && newHistoryLength >= ach.count) newlyUnlocked = true;

        if (newlyUnlocked) {
          setNewAchievement(ach);
          setTimeout(() => setNewAchievement(null), 5000);
          return { ...ach, unlocked: true };
        }
        return ach;
      });
      setUserAchievements(updatedAchievements);
    },
    [workoutHistory, userAchievements]
  );

  const handleArmSizeSelect = sizeData => {
    const profile = { armSize: sizeData.size, goal: sizeData.goal };
    setUserProfile(profile);
    setCurrentPhase(1);
    setAppState('plan');
  };

  const startWorkout = () => {
    setIsRunning(true);
    setCurrentIndex(0);
    setTimer(0);
    setAppState('workout');
  };

  const stopWorkout = (completed = false) => {
    setIsRunning(false);
    setIsResting(false);
    clearInterval(intervalRef.current);
    clearInterval(restIntervalRef.current);

    if (completed) {
      const workoutData = {
        phase: currentPhase,
        duration: timer,
        date: formatDateToYYYYMMDD(new Date()),
      };
      checkAchievements(workoutData);
      setWorkoutHistory([workoutData, ...workoutHistory]);
    }
    setAppState('plan');
  };

  const advancePhase = () => {
    if (currentPhase < 4) {
      setCurrentPhase(p => p + 1);
    }
  };

  const resetPlan = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      localStorage.removeItem('forearmAppState');
      localStorage.removeItem('forearmUserProfile');
      localStorage.removeItem('forearmCurrentPhase');
      localStorage.removeItem('forearmWorkoutHistory');
      localStorage.removeItem('forearmUserAchievements');

      setAppState('selection');
      setUserProfile(null);
      setCurrentPhase(1);
      setWorkoutHistory([]);
      setUserAchievements(achievements);
      setShowStats(false);
    }
  };

  const nextExercise = () => {
    const currentWorkoutList = workoutsByPhase[currentPhase].exercises;
    if (currentIndex < currentWorkoutList.length - 1) {
      const currentExercise = currentWorkoutList[currentIndex];
      if (currentExercise.restTime) {
        setRestTimer(currentExercise.restTime);
        setIsResting(true);
      }
      setCurrentIndex(prev => prev + 1);
    } else {
      stopWorkout(true);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
    clearInterval(restIntervalRef.current);
  };

  // Stats
  const getWorkoutStats = useCallback(() => {
    if (workoutHistory.length === 0) {
      return { totalWorkouts: 0, totalTime: formatTime(0), avgTime: formatTime(0) };
    }
    const totalWorkouts = workoutHistory.length;
    const totalTime = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    const avgTime = totalTime / totalWorkouts;
    return {
      totalWorkouts,
      totalTime: formatTime(totalTime),
      avgTime: formatTime(Math.round(avgTime)),
    };
  }, [workoutHistory]);

  const stats = getWorkoutStats();

  // UI
  const renderContent = () => {
    switch (appState) {
      case 'selection':
        return <ArmSizeSelector onSelect={handleArmSizeSelect} />;
      case 'plan':
        return (
          <PlanOverview
            userProfile={userProfile}
            currentPhase={currentPhase}
            onStart={startWorkout}
            onAdvance={advancePhase}
          />
        );
      case 'workout':
        return (
          <WorkoutDisplay
            currentPhase={currentPhase}
            currentIndex={currentIndex}
            timer={timer}
            isSoundEnabled={isSoundEnabled}
            onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            onNext={nextExercise}
            onStop={stopWorkout}
          />
        );
      default:
        return <ArmSizeSelector onSelect={handleArmSizeSelect} />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white selection:bg-purple-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        <Header onShowStats={() => setShowStats(true)} onReset={resetPlan} appState={appState} />

        <StatsModal
          show={showStats}
          onClose={() => setShowStats(false)}
          stats={stats}
          userAchievements={userAchievements}
          workoutHistory={workoutHistory}
        />

        <RestTimer isResting={isResting} restTimer={restTimer} onSkip={skipRest} />

        <AchievementNotification achievement={newAchievement} />

        <AnimatePresence mode="wait">
          <motion.div key={appState} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Forearm;
