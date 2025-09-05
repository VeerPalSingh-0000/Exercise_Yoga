// src/components/AbsWorkout/Abs.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data and Assets
import motivationalSound from '../.././assets/sounds/workout_motivation.mp3';
import { workoutsByPhase, achievements } from './data/workoutData';

// Utils
import { getStorageItem, setStorageItem } from './utils/storage';
// UPDATED: Now importing our new timezone-safe date formatter
import { formatTime, formatDateToYYYYMMDD } from './utils/helpers';

// UI Components
import Header from './Header';
import BodyFatSelector from './BodyFatSelector';
import PlanOverview from './PlanOverview';
import WorkoutDisplay from './WorkoutDisplay';
import RestTimer from './RestTimer';
import StatsModal from './StatsModal';
import AchievementNotification from './AchievementNotification';


const Abs = () => {
    // State Management
    const [appState, setAppState] = useState(() => getStorageItem('absAppState', 'selection'));
    const [userProfile, setUserProfile] = useState(() => getStorageItem('absUserProfile', null));
    const [currentPhase, setCurrentPhase] = useState(() => getStorageItem('absCurrentPhase', 1));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(() => new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('absSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('absWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('absUserAchievements', achievements));
    const [showStats, setShowStats] = useState(false);
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // Effects for managing local storage and side effects
    useEffect(() => setStorageItem('absSoundEnabled', isSoundEnabled), [isSoundEnabled]);
    useEffect(() => setStorageItem('absWorkoutHistory', workoutHistory), [workoutHistory]);
    useEffect(() => setStorageItem('absUserAchievements', userAchievements), [userAchievements]);
    useEffect(() => setStorageItem('absAppState', appState), [appState]);
    useEffect(() => setStorageItem('absUserProfile', userProfile), [userProfile]);
    useEffect(() => setStorageItem('absCurrentPhase', currentPhase), [currentPhase]);

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
    const checkAchievements = useCallback((completedWorkoutData) => {
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
    }, [workoutHistory, userAchievements]);
    
    const handleBodyFatSelect = (bfData) => {
        const profile = { bodyFatRange: bfData.range, timeline: bfData.timeline };
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
                // UPDATED: This now uses our timezone-safe function to record the correct date.
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
    }
    
    const resetPlan = () => {
        if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
            localStorage.removeItem('absAppState');
            localStorage.removeItem('absUserProfile');
            localStorage.removeItem('absCurrentPhase');
            localStorage.removeItem('absWorkoutHistory');
            localStorage.removeItem('absUserAchievements');
            
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

    // Derived State and Memoized Calculations
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

    // Conditional Rendering Logic
    const renderContent = () => {
        switch (appState) {
            case 'selection':
                return <BodyFatSelector onSelect={handleBodyFatSelect} />;
            case 'plan':
                return <PlanOverview userProfile={userProfile} currentPhase={currentPhase} onStart={startWorkout} onAdvance={advancePhase} />;
            case 'workout':
                return <WorkoutDisplay 
                    currentPhase={currentPhase}
                    currentIndex={currentIndex}
                    timer={timer}
                    isSoundEnabled={isSoundEnabled}
                    onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
                    onNext={nextExercise}
                    onStop={stopWorkout}
                />;
            default:
                return <BodyFatSelector onSelect={handleBodyFatSelect} />;
        }
    };

    // Main Render
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white selection:bg-orange-500 selection:text-white">
            <div className="max-w-6xl mx-auto">
                <Header onShowStats={() => setShowStats(true)} onReset={resetPlan} appState={appState} />
                
                <StatsModal show={showStats} onClose={() => setShowStats(false)} stats={stats} userAchievements={userAchievements} workoutHistory={workoutHistory} />
                
                <RestTimer isResting={isResting} restTimer={restTimer} onSkip={skipRest} />
                
                <AchievementNotification achievement={newAchievement} />
                
                <AnimatePresence mode="wait">
                    <motion.div key={appState}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Abs;