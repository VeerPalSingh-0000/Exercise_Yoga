import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import motivationalSound from "../assets/sounds/workout_motivation.mp3";
import workoutVideo from "../assets/images/Keggle/keggle.mp4"; // <-- 1. IMPORT YOUR VIDEO HERE

// Warmup and Cooldown Images
import deepBreathing from "../assets/images/Keggle/deep-breathing.gif";
import pelvicTilt from "../assets/images/Keggle/pelvic-tilt.gif";
import happyBaby from "../assets/images/Keggle/happy-baby-pose.gif";
import childsPose from "../assets/images/Warmup and stretch/child-pose.jpg";

// Kegel Exercise Images
import shortFlicks from "../assets/images/Keggle/short-flicks.gif";
import longHolds from "../assets/images/Keggle/long-holds.gif";
import bridgePose from "../assets/images/Keggle/bridge-pose.gif";
import squatHold from "../assets/images/Keggle/squat-hold.gif";


// ======================== HELPER FUNCTIONS ========================
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getStorageItem = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return defaultValue;
    }
};

const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
};

// ======================== EXERCISE DATA ========================
const warmupExercises = [
    { 
        name: "Warm-up: Diaphragmatic Breathing", 
        img: deepBreathing, 
        duration: "60 seconds",
        difficulty: 1,
        instructions: "Lie on your back with knees bent. Place one hand on your chest and the other on your belly. Inhale deeply through your nose, allowing your belly to rise. Exhale slowly through your mouth.",
        targetMuscles: ["Diaphragm", "Pelvic Floor"],
        tips: "Focus on relaxing your pelvic floor as you inhale."
    },
    { 
        name: "Warm-up: Pelvic Tilts", 
        img: pelvicTilt, 
        duration: "60 seconds",
        difficulty: 1,
        instructions: "Lie on your back with knees bent and feet flat on the floor. Gently flatten your lower back against the floor by tightening your abdominal muscles and tilting your pelvis up slightly. Hold for a few seconds and release.",
        targetMuscles: ["Lower Abs", "Pelvic Floor"],
        tips: "Coordinate the movement with your breath, exhaling as you tilt."
    },
];

const cooldownStretches = [
    { 
        name: "Cooldown: Child's Pose", 
        img: childsPose, 
        duration: "60 seconds",
        difficulty: 1,
        instructions: "Kneel on the floor, sit back on your heels, then fold forward, extending your arms in front of you to gently stretch your back and pelvic region.",
        targetMuscles: ["Back", "Hips", "Pelvic Floor"],
        tips: "Breathe deeply into your lower back and focus on releasing all tension."
    },
    { 
        name: "Cooldown: Happy Baby Pose", 
        img: happyBaby, 
        duration: "45 seconds",
        difficulty: 2,
        instructions: "Lie on your back, draw your knees towards your chest, and grab the outsides of your feet. Gently pull your knees towards your armpits to stretch the inner groin and pelvic floor.",
        targetMuscles: ["Hips", "Groin", "Pelvic Floor"],
        tips: "Keep your lower back pressed into the floor."
    },
];

const kegelWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Short Flicks", 
                img: shortFlicks, 
                reps: "3 sets × 15 reps",
                difficulty: 1,
                instructions: "Quickly contract and release your pelvic floor muscles. Imagine you are trying to stop the flow of urine mid-stream.",
                targetMuscles: ["Pelvic Floor"],
                tips: "Focus on quick, sharp contractions without holding your breath.",
                restTime: 30
            },
            { 
                name: "Long Holds", 
                img: longHolds, 
                reps: "3 sets × 10 reps (5-sec hold)",
                difficulty: 2,
                instructions: "Contract your pelvic floor muscles and hold for 5 seconds. Relax completely for 5 seconds between each repetition.",
                targetMuscles: ["Pelvic Floor"],
                tips: "Ensure you are fully relaxing the muscles after each hold.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Kegel Bridge", 
                img: bridgePose, 
                reps: "3 sets × 12 reps",
                difficulty: 3,
                instructions: "Lie on your back with knees bent. As you lift your hips off the floor into a bridge, contract your pelvic floor muscles. Hold at the top, then lower your hips while relaxing the muscles.",
                targetMuscles: ["Pelvic Floor", "Glutes", "Hamstrings"],
                tips: "Squeeze your glutes at the top of the bridge for added benefit.",
                restTime: 60
            },
            { 
        
               name: "Long Holds (Advanced)", 
                img: longHolds, 
                reps: "3 sets × 10 reps (10-sec hold)",
                difficulty: 3,
                instructions: "Contract your pelvic floor muscles and hold for a full 10 seconds. Relax completely for 10 seconds between each repetition.",
                targetMuscles: ["Pelvic Floor"],
                tips: "Maintain normal breathing throughout the hold.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Kegel Squat Hold", 
                img: squatHold, 
                reps: "3 sets × 30-sec hold",
                difficulty: 4,
                instructions: "Lower into a squat position. While holding the squat, perform 5 quick Kegel contractions, then relax for 5 seconds. Repeat this cycle for the duration of the hold.",
                targetMuscles: ["Pelvic Floor", "Quads", "Glutes"],
                tips: "Keep your chest up and back straight during the squat.",
                restTime: 90
            },
            { 
                name: "The Elevator", 
                img: longHolds, 
                reps: "3 sets × 8 reps",
                difficulty: 5,
                instructions: "Imagine your pelvic floor is an elevator. Slowly contract upwards in stages (floor 1, 2, 3). Hold at the top for 3 seconds, then slowly release back down in stages.",
                targetMuscles: ["Pelvic Floor"],
                tips: "This exercise requires intense focus and control.",
                restTime: 90
            },
            ...cooldownStretches
        ],
    },
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Squeeze", description: "Complete your first Kegel session", icon: "💧", unlocked: false },
    { id: 2, name: "Core Control", description: "Complete 5 sessions", icon: "🧘‍♂️", unlocked: false },
    { id: 3, name: "Pelvic Power", description: "Complete 10 sessions", icon: "💎", unlocked: false },
    { id: 4, name: "Diamond Hard", description: "Complete a Hard level workout", icon: "🔥", unlocked: false },
    { id: 5, name: "Endurance Engine", description: "Workout for 10+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Kegel King", description: "Complete 20 Kegel workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Keggle = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('soundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('kegelWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('kegelUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('theme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastKegelWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('soundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('kegelWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('kegelUserAchievements', userAchievements);
    }, [userAchievements]);

    // Audio Effect
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

    // Main Timer Effect
    useEffect(() => {
        if (isRunning && !isResting) {
            intervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, isResting]);

    // Rest Timer Effect
    useEffect(() => {
        if (isResting && restTimer > 0) {
            restIntervalRef.current = setInterval(() => {
                setRestTimer(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
        }
        return () => {
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
        };
    }, [isResting, restTimer]);

    // ======================== HELPER FUNCTIONS ========================
    const checkAchievements = useCallback((workoutData) => {
        const updatedAchievements = [...userAchievements];
        let hasNewAchievement = false;

        if (workoutHistory.length === 0 && !updatedAchievements[0].unlocked) {
            updatedAchievements[0].unlocked = true;
            setNewAchievement(updatedAchievements[0]);
            hasNewAchievement = true;
        }
        if (workoutHistory.length + 1 >= 5 && !updatedAchievements[1].unlocked) {
            updatedAchievements[1].unlocked = true;
            setNewAchievement(updatedAchievements[1]);
            hasNewAchievement = true;
        }
        if (workoutData.level === 'Hard' && !updatedAchievements[3].unlocked) {
            updatedAchievements[3].unlocked = true;
            setNewAchievement(updatedAchievements[3]);
            hasNewAchievement = true;
        }
        if (workoutData.duration >= 600 && !updatedAchievements[4].unlocked) { // 10 minutes
            updatedAchievements[4].unlocked = true;
            setNewAchievement(updatedAchievements[4]);
            hasNewAchievement = true;
        }

        if (hasNewAchievement) {
            setUserAchievements(updatedAchievements);
            setTimeout(() => setNewAchievement(null), 5000);
        }
    }, [userAchievements, workoutHistory]);

    const calculateTotalSets = useCallback(() => {
        if (!workoutType || !level) return 0;
        const workout = kegelWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        setLevel(lvl);
        setCurrentIndex(0);
        setTimer(0);
        setCompletedSets(0);
        setTotalSets(calculateTotalSets());
        setIsRunning(true);
        setIsResting(false);
        setShowInstructions(false);
    };

    const stopWorkout = (completed = false) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (restIntervalRef.current) clearInterval(restIntervalRef.current);
        
        setIsRunning(false);
        setIsResting(false);
        
        const finalTime = timer;
        const completedLevel = level;
        const completedType = workoutType;

        setLevel(null);
        setCurrentIndex(0);
        setTimer(0);
        setRestTimer(0);
        setCompletedSets(0);
        setTotalSets(0);

        if (completed && completedLevel && completedType) {
            const workoutData = {
                type: completedType,
                level: completedLevel,
                duration: finalTime,
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now(),
                setsCompleted: completedSets
            };

            const newHistory = [workoutData, ...workoutHistory.slice(0, 9)];
            setWorkoutHistory(newHistory);
            setLastWorkoutInfo(workoutData);
            setStorageItem("lastKegelWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = kegelWorkouts[workoutType]?.[level];
        if (!currentWorkoutList) return;

        const currentExercise = currentWorkoutList[currentIndex];
        
        if (currentExercise?.reps?.includes('sets')) {
            setCompletedSets(prev => prev + 1);
        }

        if (currentIndex < currentWorkoutList.length - 1) {
            if (currentExercise?.restTime && !currentExercise.name.includes('Warm-up') && !currentExercise.name.includes('Cooldown')) {
                setRestTimer(currentExercise.restTime);
                setIsResting(true);
                setShowRestTimer(true);
                setTimeout(() => setShowRestTimer(false), currentExercise.restTime * 1000);
            }
            setCurrentIndex(prev => prev + 1);
        } else {
            stopWorkout(true);
        }
    };

    const skipRest = () => {
        setIsResting(false);
        setRestTimer(0);
        setShowRestTimer(false);
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    // ======================== UI HELPER FUNCTIONS ========================
    const getDifficultyColor = (difficulty) => {
        const colors = {
            1: 'text-green-400', 2: 'text-yellow-400', 3: 'text-orange-400', 4: 'text-red-400', 5: 'text-purple-400'
        };
        return colors[difficulty] || 'text-gray-400';
    };

    const getDifficultyStars = (difficulty) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

    const getWorkoutStats = () => {
        if (workoutHistory.length === 0) return { totalWorkouts: 0, totalTime: formatTime(0), avgTime: formatTime(0), longestWorkout: formatTime(0) };
        const totalWorkouts = workoutHistory.length;
        const totalTime = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
        const avgTime = totalTime / totalWorkouts;
        const longestWorkout = Math.max(...workoutHistory.map(w => w.duration));
        return { totalWorkouts, totalTime: formatTime(totalTime), avgTime: formatTime(Math.round(avgTime)), longestWorkout: formatTime(longestWorkout) };
    };

    const currentExercise = isRunning && workoutType && level && kegelWorkouts[workoutType]?.[level] ? kegelWorkouts[workoutType][level][currentIndex] : null;
    const stats = getWorkoutStats();

    // ======================== ANIMATION VARIANTS ========================
    const containerVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1 } } };
    const itemVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
    const cardVariants = { initial: { opacity: 0, y: 50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }, exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } } };
    const buttonVariants = { hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } }, tap: { scale: 0.95 } };

    // ======================== RENDER FUNCTIONS ========================
    const renderHeader = () => (
        <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
            <motion.h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className={`bg-gradient-to-r ${theme === 'dark' ? 'from-green-400 to-teal-600' : 'from-green-600 to-teal-800'} bg-clip-text text-transparent`}>
                    💎 Pelvic Power
                </span>
            </motion.h1>
            <div className="flex gap-3">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setShowStats(!showStats)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}>
                    📊 Stats
                </motion.button>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </motion.button>
            </div>
        </motion.div>
    );

    const renderStats = () => {
        if (!showStats) return null;
        return (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-8 backdrop-blur-md rounded-xl p-6 border ${
                    theme === 'dark'
                        ? 'bg-black bg-opacity-30 border-gray-700'
                        : 'bg-white bg-opacity-70 border-gray-300'
                }`}
            >
                <h3
                    className={`text-xl font-bold mb-4 text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    📈 Your Progress
                </h3>
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🏁</div>
                        <div
                            className={`text-xl font-semibold mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Ready to Start?
                        </div>
                        <div
                            className={`${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            Complete your first workout to see statistics here!
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{stats.totalWorkouts}</div>
                            <div
                                className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                Total Sessions
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{stats.totalTime}</div>
                            <div
                                className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                Total Time
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.avgTime}</div>
                            <div
                                className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                Average Time
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{stats.longestWorkout}</div>
                            <div
                                className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                Longest Session
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-6">
                    <h4
                        className={`text-lg font-semibold mb-3 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        🏆 Achievements
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                                    achievement.unlocked
                                        ? theme === 'dark'
                                            ? 'bg-green-600 bg-opacity-30 border-green-500'
                                            : 'bg-green-100 border-green-400'
                                        : theme === 'dark'
                                            ? 'bg-gray-600 bg-opacity-30 border-gray-500'
                                            : 'bg-gray-100 border-gray-400'
                                }`}
                            >
                                <div className="text-2xl mb-1">{achievement.icon}</div>
                                <div
                                    className={`text-xs font-semibold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}
                                >
                                    {achievement.name}
                                </div>
                                <div
                                    className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    {achievement.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };
    
    const renderLevelSelection = () => { if (isRunning || !workoutType) return null; return ( <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"> {Object.keys(kegelWorkouts[workoutType]).map((lvl) => { const exerciseCount = kegelWorkouts[workoutType][lvl].length; const workoutTime = kegelWorkouts[workoutType][lvl].filter(ex => ex.restTime).reduce((sum, ex) => sum + ex.restTime, 0) + (exerciseCount * 45); return ( <motion.button key={`${workoutType}-${lvl}`} variants={itemVariants} whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }} whileTap={{ scale: 0.95 }} onClick={() => startWorkout(lvl)} className={`p-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:shadow-2xl bg-gradient-to-br from-teal-500 via-cyan-600 to-sky-700 hover:from-teal-400 hover:via-cyan-500 hover:to-sky-600`}> <div className="text-2xl mb-2">{lvl === 'Beginner' ? '🌱' : lvl === 'Intermediate' ? '⚡' : '🔥'}</div> <div className="text-xl mb-2">{lvl}</div> <div className="text-sm opacity-80">{exerciseCount} exercises • ~{Math.round(workoutTime / 60)} min</div> </motion.button> ); })} </motion.div> ); };

    // ======================== NEW VIDEO SECTION ========================
    const renderVideoSection = () => {
        if (isRunning) return null; // Hide video during an active workout
        return (
            <motion.div variants={itemVariants} className="my-12">
                <h2 className={`text-3xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Featured Workout Routine
                </h2>
                <div className="rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto border-4 border-teal-500">
                    <video
                        src={workoutVideo}
                        width="100%"
                        controls
                        loop
                        playsInline
                        className="w-full h-auto block"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </motion.div>
        );
    };

    const renderWorkoutDisplay = () => { if (!isRunning || !currentExercise) return null; return ( <motion.div variants={cardVariants} initial="initial" animate="animate" className="relative bg-black bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto" key={`${workoutType}-${level}-${currentIndex}`}> <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-4 py-2 rounded-full text-lg font-mono z-10 shadow-lg">⏱️ {formatTime(timer)}</div> <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-4 py-2 rounded-full text-sm z-10 shadow-lg">{completedSets}/{totalSets} sets</div> <div className="absolute top-16 right-4 z-10"><motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setIsSoundEnabled(!isSoundEnabled)} className={`p-3 rounded-full shadow-lg transition-colors ${isSoundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{isSoundEnabled ? '🔊' : '🔇'}</motion.button></div> <div className="mt-16 mb-6"> <h2 className="text-2xl font-bold mb-2 text-gray-100">{workoutType} - {level} Level</h2> <p className="text-gray-400 mb-4">Exercise {currentIndex + 1} of {kegelWorkouts[workoutType]?.[level]?.length}</p> <div className="w-full bg-gray-700 rounded-full h-2 mb-6"> <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / (kegelWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` }}/> </div> </div> <motion.div className="h-64 w-full rounded-xl mb-6 bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}> {currentExercise.img ? (<img src={currentExercise.img} alt={currentExercise.name} className="h-full w-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="text-gray-500 text-center">Image not available</div>'; }}/>) : (<span className="text-gray-500">No Image Available</span>)} </motion.div> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-100 mb-2">{currentExercise.name}</h3> <p className="text-xl text-yellow-400 font-semibold mb-4">{currentExercise.reps || currentExercise.duration}</p> {currentExercise.difficulty && (<div className="flex items-center justify-center gap-4 mb-4"><span className="text-gray-400">Difficulty:</span><span className={`text-lg ${getDifficultyColor(currentExercise.difficulty)}`}>{getDifficultyStars(currentExercise.difficulty)}</span></div>)} {currentExercise.targetMuscles && (<div className="mb-4"><div className="text-gray-400 mb-2">Target Muscles:</div><div className="flex flex-wrap justify-center gap-2">{currentExercise.targetMuscles.map((muscle, idx) => (<span key={idx} className="bg-cyan-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">{muscle}</span>))}</div></div>)} </div> {currentExercise.instructions && (<motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={toggleInstructions} className="mb-4 bg-blue-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all">{showInstructions ? '📖 Hide Instructions' : '📖 Show Instructions'}</motion.button>)} <AnimatePresence>{showInstructions && currentExercise.instructions && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-left"><h4 className="font-semibold text-yellow-400 mb-2">Instructions:</h4><p className="text-gray-300 text-sm leading-relaxed mb-3">{currentExercise.instructions}</p>{currentExercise.tips && (<><h4 className="font-semibold text-green-400 mb-2">Tips:</h4><p className="text-gray-300 text-sm leading-relaxed">💡 {currentExercise.tips}</p></>)}</motion.div>)}</AnimatePresence> <div className="flex flex-col gap-4"> <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={nextExercise} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 w-full">{currentIndex === (kegelWorkouts[workoutType]?.[level]?.length || 1) - 1 ? "🎉 Finish Workout" : "➡️ Next Exercise"}</motion.button> <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => stopWorkout(false)} className="bg-red-600 bg-opacity-30 hover:bg-opacity-50 text-white px-6 py-2 rounded-lg transition-all">🛑 Stop Workout</motion.button> </div> </motion.div> ); };

    const renderAchievementNotification = () => { if (!newAchievement) return null; return ( <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"> <div className="text-center"> <div className="text-4xl mb-2">{newAchievement.icon}</div> <div className="font-bold text-white mb-1">Achievement Unlocked!</div> <div className="text-sm text-yellow-100">{newAchievement.name}</div> <div className="text-xs text-yellow-200">{newAchievement.description}</div> </div> </motion.div> ); };

    // ======================== MAIN RENDER ========================
    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-cyan-900 to-sky-900 text-white' 
                    : 'bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 text-gray-900'
            }`}
        >
            <div className="max-w-6xl mx-auto">
                {renderHeader()}
                <AnimatePresence>{renderStats()}</AnimatePresence>
                {renderLevelSelection()}
                {/* 2. CALL THE NEW RENDER FUNCTION HERE */}
                {renderVideoSection()} 
                <AnimatePresence>{renderWorkoutDisplay()}</AnimatePresence>
                <AnimatePresence>{renderAchievementNotification()}</AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Keggle;