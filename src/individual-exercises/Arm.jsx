import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import motivationalSound from "../assets/sounds/workout_motivation.mp3";

// Warmup and stretching images
import JumpingJacks from "../assets/images/Warmup and stretch/jumping-jack.gif";
import Armforward from "../assets/images/Warmup and stretch/arm-circle-forward.gif";
import ArmReverse from "../assets/images/Warmup and stretch/Reverse-Arm-Circles.gif";
import DynamicStretch from "../assets/images/Warmup and stretch/dynamic-chest-stretch.gif";
import childPose from "../assets/images/Warmup and stretch/child-pose.jpg";
import cobraPose from "../assets/images/Warmup and stretch/cobra-pose.avif";
import catCowPose from "../assets/images/Warmup and stretch/cat-cow.webp";

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
        name: "Warm-up: Jumping Jacks", 
        img: JumpingJacks, 
        duration: "60 seconds",
        difficulty: 2,
        instructions: "Stand upright with feet together, arms at sides. Jump while spreading legs shoulder-width apart and raising arms overhead. Return to starting position.",
        targetMuscles: ["Full Body", "Cardio"],
        tips: "Keep your core engaged and land softly on your feet."
    },
    { 
        name: "Warm-up: Arm Circles (Forward)", 
        img: Armforward, 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Extend arms to sides parallel to ground. Make small forward circles, gradually increasing size.",
        targetMuscles: ["Shoulders", "Arms"],
        tips: "Keep your shoulders relaxed and maintain good posture."
    },
    { 
        name: "Warm-up: Arm Circles (Backward)", 
        img: ArmReverse, 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Same as forward circles but in reverse direction to activate different muscle fibers.",
        targetMuscles: ["Shoulders", "Arms"],
        tips: "Focus on controlled movements, don't rush."
    },
    { 
        name: "Warm-up: Dynamic Stretch", 
        img: DynamicStretch, 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Stand tall, stretch arms across chest and pull back dynamically to open chest muscles.",
        targetMuscles: ["Chest", "Shoulders"],
        tips: "Don't bounce aggressively, use controlled movements."
    },
];

const cooldownStretches = [
    { 
        name: "Cooldown: Child's Pose", 
        img: childPose, 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Kneel on floor, sit back on heels, then fold forward extending arms in front.",
        targetMuscles: ["Back", "Shoulders"],
        tips: "Focus on deep breathing and let gravity help you stretch."
    },
    { 
        name: "Cooldown: Cobra Stretch", 
        img: cobraPose, 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Lie face down, place palms under shoulders, slowly push up arching your back.",
        targetMuscles: ["Chest", "Hip Flexors"],
        tips: "Keep hips on ground and don't overextend your back."
    },
    { 
        name: "Cooldown: Cat-Cow Stretch", 
        img: catCowPose, 
        duration: "1 minute",
        difficulty: 1,
        instructions: "On hands and knees, alternate between arching back (cow) and rounding spine (cat).",
        targetMuscles: ["Back", "Core"],
        tips: "Move slowly and coordinate with your breathing."
    }
];

// EXERCISE DB

// You can update these GIFs for Arm-specific ones from your assets directory!
const armWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            {
                name: "Wall Push-Ups",
                img: "https://media0.giphy.com/media/oVRVhKRAnNTLME7BGt/200w.gif",
                reps: "3 sets × 15 reps",
                difficulty: 1,
                instructions: "Stand arm's length from wall, place palms flat against wall, push body toward and away from wall.",
                targetMuscles: ["Triceps", "Biceps", "Shoulders"],
                tips: "Keep your elbows close to your body.",
                restTime: 45
            },
            {
                name: "Triceps Dips (Chair/Bench)",
                img: "https://i.pinimg.com/originals/e3/84/ed/e384eda806c7b5a88be278b833de034a.gif",
                reps: "3 sets × 10-12 reps",
                difficulty: 2,
                instructions: "Place hands behind on chair, feet forward, lower body then push up.",
                targetMuscles: ["Triceps", "Shoulders"],
                tips: "Keep your back close to the chair.",
                restTime: 60
            },
            {
                name: "Incline Push-Ups (on bed/sofa)",
                img: "https://i.pinimg.com/originals/f0/ee/14/f0ee14842e9d923710082d106c2aba52.gif",
                reps: "3 sets × 10 reps",
                difficulty: 2,
                instructions: "Place hands on elevated surface, perform push-ups with feet on ground.",
                targetMuscles: ["Arms", "Chest"],
                tips: "The higher the surface, the easier the exercise.",
                restTime: 60
            },
            {
                name: "Bicep Wall Curl Isometric Hold",
                img: "https://media.giphy.com/media/R2gpT7evoXnWw/giphy.gif",
                reps: "3 sets × 30 sec",
                difficulty: 2,
                instructions: "Stand against wall, press fists into wall as if curling upward and hold.",
                targetMuscles: ["Biceps"],
                tips: "Focus on squeezing your biceps.",
                restTime: 30
            },
            ...cooldownStretches,
        ],
        Intermediate: [
            ...warmupExercises,
            {
                name: "Diamond Push-Ups",
                img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif",
                reps: "3 sets × 10 reps",
                difficulty: 3,
                instructions: "Form diamond shape with hands and perform push-ups.",
                targetMuscles: ["Triceps", "Chest"],
                tips: "Keep your elbows close.",
                restTime: 75
            },
            {
                name: "Close-Grip Push-Ups",
                img: "https://i.pinimg.com/originals/28/ff/6a/28ff6a3f9c5db520624fdde52a0e3f3e.gif",
                reps: "3 sets × 12 reps",
                difficulty: 3,
                instructions: "Place hands close together, elbows tucked in, perform push-ups.",
                targetMuscles: ["Triceps", "Shoulders"],
                tips: "Don't let elbows flare out.",
                restTime: 75
            },
            {
                name: "Triceps Bench Dips",
                img: "https://media1.giphy.com/media/81r6Wj3opEjesrUOXn/giphy.gif",
                reps: "3 sets × 12 reps",
                difficulty: 3,
                instructions: "Dip body between two chairs/benches, lower and lift.",
                targetMuscles: ["Triceps", "Shoulders"],
                tips: "Lower with control.",
                restTime: 75
            },
            {
                name: "Isometric Bicep Hold",
                img: "https://media.giphy.com/media/R2gpT7evoXnWw/giphy.gif",
                reps: "3 sets × 40 sec",
                difficulty: 3,
                instructions: "Tighten arm as if curling and hold.",
                targetMuscles: ["Biceps"],
                tips: "Keep muscle under tension.",
                restTime: 60
            },
            ...cooldownStretches,
        ],
        Hard: [
            ...warmupExercises,
            {
                name: "Decline Push-Ups (feet elevated)",
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/feetelevatedpushup-1457047025.gif",
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Feet on higher surface, push-ups for more intensity.",
                targetMuscles: ["Triceps", "Shoulders", "Chest"],
                tips: "Control the descent and explosive push.",
                restTime: 90
            },
            {
                name: "One-Arm Push-Ups (progression)",
                img: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2p6YXpheHZ0eDZoMmhuaGR0aTZpamI3dDlyYXg4OXpmanM4Z3FpMCZjdD1z/p3E2b4ZQW1GaQ/giphy.gif",
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Try with wide stance and shift more weight to one arm.",
                targetMuscles: ["Arms", "Chest", "Shoulders"],
                tips: "Start with support, progessively increase load.",
                restTime: 120
            },
            {
                name: "L-sit Hold (on chairs)",
                img: "https://fitnessprogramer.com/wp-content/uploads/2021/05/L-Sit.gif",
                reps: "3 × 20-40 sec",
                difficulty: 5,
                instructions: "Hold body with arms locked at sides, legs extended.",
                targetMuscles: ["Triceps", "Shoulders", "Core"],
                tips: "Lock out elbows and keep legs up.",
                restTime: 90
            },
            ...cooldownStretches,
        ]
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            {
                name: "Dumbbell Bicep Curls",
                img: "https://i.pinimg.com/originals/8a/49/06/8a4906ded7ccdc0330e8ec2bcfb31fde.gif",
                reps: "3 sets × 15 reps",
                difficulty: 2,
                instructions: "Alternating curls, standing. Keep elbows pinned.",
                targetMuscles: ["Biceps"],
                tips: "No swinging.",
                restTime: 90
            },
            {
                name: "Triceps Rope Pushdown",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/295.gif",
                reps: "3 × 15 reps",
                difficulty: 2,
                instructions: "Pull rope down, split at the bottom.",
                targetMuscles: ["Triceps"],
                tips: "Don't let elbows move.",
                restTime: 75
            },
            {
                name: "Machine Seated Curl",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/319.gif",
                reps: "3 × 12 reps",
                difficulty: 2,
                instructions: "Use arm curl machine as per instructions.",
                targetMuscles: ["Biceps"],
                tips: "Control the movement.",
                restTime: 75
            },
            ...cooldownStretches,
        ],
        Intermediate: [
            ...warmupExercises,
            {
                name: "EZ Bar Curl",
                img: "https://i.pinimg.com/originals/f1/60/65/f160655be7077ba701fba3628392227d.gif",
                reps: "3 × 12 reps",
                difficulty: 4,
                instructions: "Curl barbell with underhand grip.",
                targetMuscles: ["Biceps"],
                tips: "Keep elbows fixed.",
                restTime: 90
            },
            {
                name: "Cable Overhead Triceps Extension",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/130.gif",
                reps: "3 × 12 reps",
                difficulty: 3,
                instructions: "Extend cable overhead.",
                targetMuscles: ["Triceps"],
                tips: "No arching of back.",
                restTime: 90
            },
            {
                name: "Reverse Grip Barbell Curl",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/33.gif",
                reps: "3 × 10 reps",
                difficulty: 4,
                instructions: "Curl with palms down for forearms.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Don't swing.",
                restTime: 90
            },
            ...cooldownStretches,
        ],
        Hard: [
            ...warmupExercises,
            {
                name: "Heavy Barbell Curl",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/31.gif",
                reps: "4 × 8-10 reps",
                difficulty: 5,
                instructions: "Go heavy with strict form.",
                targetMuscles: ["Biceps"],
                tips: "Use spotter if needed.",
                restTime: 120
            },
            {
                name: "Dumbbell Skullcrushers",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/198.gif",
                reps: "4 × 10 reps",
                difficulty: 5,
                instructions: "Lie on bench, extend dumbbells from forehead.",
                targetMuscles: ["Triceps"],
                tips: "Don't move upper arm.",
                restTime: 120
            },
            {
                name: "Cable Hammer Curl",
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/229.gif",
                reps: "4 × 12 reps",
                difficulty: 5,
                instructions: "Cable curls with rope for forearms and biceps.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Control weight.",
                restTime: 120
            },
            ...cooldownStretches,
        ]
    }
};

// ======================== ACHIEVEMENTS ========================

const achievements = [
    {id: 1, name: "Armed & Ready", description: "Complete your first arm workout", icon: "🦾", unlocked: false},
    {id: 2, name: "Persistent", description: "Complete 5 arm workouts", icon: "🏅", unlocked: false},
    {id: 3, name: "Arm Master", description: "Complete 15 arm workouts", icon: "🥇", unlocked: false},
    {id: 4, name: "Triceps Slayer", description: "Do 100 triceps reps total", icon: "💪", unlocked: false},
    {id: 5, name: "Biceps King", description: "Do 100 biceps reps total", icon: "👑", unlocked: false},
    {id: 6, name: "Hard Mode Crusher", description: "Complete a Hard level arm workout", icon: "🔥", unlocked: false},
];

// ======================== MAIN COMPONENT ========================

const Arm = () => {
    // USESTATEs
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('armSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('armWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('armUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('armTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastArmWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // EFFECTS
    useEffect(() => { setStorageItem('armSoundEnabled', isSoundEnabled); }, [isSoundEnabled]);
    useEffect(() => { setStorageItem('armTheme', theme); document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
    useEffect(() => { setStorageItem('armWorkoutHistory', workoutHistory); }, [workoutHistory]);
    useEffect(() => { setStorageItem('armUserAchievements', userAchievements); }, [userAchievements]);

    useEffect(() => {
        audio.loop = true;
        audio.volume = 0.3;
        if (isRunning && isSoundEnabled && !isResting) {
            audio.play().catch(error => console.error("Audio playback failed:", error));
        } else {
            audio.pause();
        }
        return () => { audio.pause(); audio.currentTime = 0; };
    }, [isRunning, isSoundEnabled, isResting, audio]);

    useEffect(() => {
        if (isRunning && !isResting) {
            intervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
        } else { if (intervalRef.current) clearInterval(intervalRef.current); }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, isResting]);

    useEffect(() => {
        if (isResting && restTimer > 0) {
            restIntervalRef.current = setInterval(() => setRestTimer(prev => {
                if (prev <= 1) { setIsResting(false); return 0; }
                return prev - 1;
            }), 1000);
        } else { if (restIntervalRef.current) clearInterval(restIntervalRef.current); }
        return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); };
    }, [isResting, restTimer]);

    // ACHIEVEMENT SYSTEM AND STATS
    const checkAchievements = useCallback((workoutData) => {
        const updated = [...userAchievements];
        let hasNew = false;

        if (workoutHistory.length === 0 && !updated[0].unlocked) { updated.unlocked = true; setNewAchievement(updated); hasNew = true; }
        if (workoutHistory.length + 1 >= 5 && !updated[1].unlocked) { updated[1].unlocked = true; setNewAchievement(updated[1]); hasNew = true; }
        if (workoutHistory.length + 1 >= 15 && !updated.unlocked) { updated.unlocked = true; setNewAchievement(updated); hasNew = true; }
        // Count triceps and biceps reps
        const allWorkouts = [workoutData, ...workoutHistory];
        let tricepsReps = 0; let bicepsReps = 0;
        allWorkouts.forEach(w => {
            const arr = armWorkouts[w.type]?.[w.level] || [];
            arr.forEach(ex => {
                let reps = 0;
                if (ex.reps && /\d+/.test(ex.reps)) {
                    const sets = ex.reps.match(/(\d+)\s*sets?/i); const rep = ex.reps.match(/(\d+)\s*reps?/i);
                    reps = (sets ? parseInt(sets[1]) : 1) * (rep ? parseInt(rep[1]) : 0);
                }
                if (ex.targetMuscles?.includes('Triceps')) tricepsReps += reps;
                if (ex.targetMuscles?.includes('Biceps')) bicepsReps += reps;
            });
        });
        if (tricepsReps >= 100 && !updated.unlocked) { updated.unlocked = true; setNewAchievement(updated); hasNew = true; }
        if (bicepsReps >= 100 && !updated.unlocked) { updated.unlocked = true; setNewAchievement(updated); hasNew = true; }

        // Hard workout
        if (workoutData.level === "Hard" && !updated.unlocked) { updated.unlocked = true; setNewAchievement(updated); hasNew = true; }

        if (hasNew) {
            setUserAchievements(updated);
            setTimeout(() => setNewAchievement(null), 5000);
        }
    }, [userAchievements, workoutHistory]);

    const calculateTotalSets = useCallback(() => {
        if (!workoutType || !level) return 0;
        const workout = armWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        return workout.filter(ex => ex.reps && ex.reps.includes('sets')).length;
    }, [workoutType, level]);

    // MAIN WORKOUT FUNCTIONS
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

        const finalTime = timer, completedLevel = level, completedType = workoutType;

        setLevel(null); setCurrentIndex(0); setTimer(0); setRestTimer(0); setCompletedSets(0); setTotalSets(0);
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
            setStorageItem("lastArmWorkout", workoutData);
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentList = armWorkouts[workoutType]?.[level];
        if (!currentList) return;
        const currentEx = currentList[currentIndex];
        if (currentEx?.reps?.includes('sets')) setCompletedSets(prev => prev + 1);

        if (currentIndex < currentList.length - 1) {
            if (currentEx?.restTime && !currentEx.name.includes('Warm-up') && !currentEx.name.includes('Cooldown')) {
                setRestTimer(currentEx.restTime); setIsResting(true); setShowRestTimer(true);
                setTimeout(() => setShowRestTimer(false), currentEx.restTime * 1000);
            }
            setCurrentIndex(prev => prev + 1);
        } else stopWorkout(true);
    };

    const skipRest = () => { setIsResting(false); setRestTimer(0); setShowRestTimer(false); };
    const toggleInstructions = () => { setShowInstructions(!showInstructions); };

    // UI HELPERS
    const getDifficultyColor = d => {
        const colors = { 1: 'text-green-400', 2: 'text-yellow-400', 3: 'text-orange-400', 4: 'text-red-400', 5: 'text-purple-400' };
        return colors[d] || 'text-gray-400';
    };
    const getDifficultyStars = d => '★'.repeat(d) + '☆'.repeat(5 - d);

    const getWorkoutStats = () => {
        if (workoutHistory.length === 0) {
            return { totalWorkouts: 0, totalTime: formatTime(0), avgTime: formatTime(0), longestWorkout: formatTime(0) };
        }
        const totalWorkouts = workoutHistory.length;
        const totalTime = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
        const avgTime = totalTime / totalWorkouts;
        const longestWorkout = Math.max(...workoutHistory.map(w => w.duration));
        return { totalWorkouts, totalTime: formatTime(totalTime), avgTime: formatTime(Math.round(avgTime)), longestWorkout: formatTime(longestWorkout) };
    };
    const stats = getWorkoutStats();

    // CURRENT EXERCISE
    const currentExercise = isRunning && workoutType && level && armWorkouts[workoutType]?.[level]
        ? armWorkouts[workoutType][level][currentIndex]
        : null;

    // ======================== ANIMATION VARIANTS (SAME AS CHEST.JSX, KEEP) ========================

    const containerVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1 } } };
    const itemVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
        exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } }
    };
    const buttonVariants = { hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } }, tap: { scale: 0.95 } };

    // UI Render helpers (Header, Stats, LastWorkout, Buttons, LevelSelection, RestTimer, WorkoutDisplay, AchievementNotification)
    // COPY ALL STRUCTURE FROM Chest.jsx AND REPLACE "Chest" BY "Arm" WHERE RELEVANT

    const renderHeader = () => (
        <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
            <motion.h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className={`bg-gradient-to-r ${theme === 'dark'
                    ? 'from-blue-400 to-purple-600'
                    : 'from-blue-600 to-purple-800'
                    } bg-clip-text text-transparent`}>
                    💪 Arm Builder Pro
                </span>
            </motion.h1>
            <div className="flex gap-3">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={() => setShowStats(!showStats)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                    📊 Stats
                </motion.button>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-gray-500 hover:bg-gray-600 text-white'}`}>
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
                className={`mb-8 backdrop-blur-md rounded-xl p-6 border ${theme === 'dark'
                    ? "bg-black bg-opacity-30 border-gray-700"
                    : "bg-white bg-opacity-70 border-gray-300"
                    }`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📈 Your Progress</h3>
                {workoutHistory.length === 0 ?
                    (<div className="text-center py-8">
                        <div className="text-6xl mb-4">🏁</div>
                        <div className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Ready to Start?</div>
                        <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Complete your first workout to see statistics here!</div>
                    </div>) :
                    (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{stats.totalWorkouts}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Workouts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{stats.totalTime}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.avgTime}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{stats.longestWorkout}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Longest Workout</div>
                        </div>
                    </div>)
                }
                {/* Achievements */}
                <div className="mt-6">
                    <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🏆 Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(a =>
                            <div key={a.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${a.unlocked
                                    ? theme === 'dark'
                                        ? 'bg-green-600 bg-opacity-30 border-green-500'
                                        : 'bg-green-100 border-green-400'
                                    : theme === 'dark'
                                        ? 'bg-gray-600 bg-opacity-30 border-gray-500'
                                        : 'bg-gray-100 border-gray-400'
                                    }`}>
                                <div className="text-2xl mb-1">{a.icon}</div>
                                <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{a.name}</div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{a.description}</div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Recent Workouts */}
                {workoutHistory.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📋 Recent Workouts</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {workoutHistory.slice(0, 5).map((w, idx) => (
                                <div key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark'
                                        ? 'bg-gray-700 bg-opacity-30'
                                        : 'bg-gray-200 bg-opacity-50'
                                        }`}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                            {w.type === 'Home' ? "🏠" : "🏋️‍♂️"}
                                        </div>
                                        <div>
                                            <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {w.type} - {w.level}
                                            </div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{w.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-500">{formatTime(w.duration)}</div>
                                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{w.setsCompleted || 0} sets</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    const renderLastWorkout = () => {
        if (!lastWorkoutInfo || isRunning) return null;
        return (
            <motion.div
                variants={itemVariants}
                className={`mb-8 backdrop-blur-md p-4 rounded-xl border ${theme === 'dark'
                    ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30'
                    : 'bg-gradient-to-r from-green-100/70 to-blue-100/70 border-green-400/50'
                    }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>🎯 Last Workout</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {lastWorkoutInfo.type} - {lastWorkoutInfo.level} • {formatTime(lastWorkoutInfo.duration)} • {lastWorkoutInfo.date}
                        </p>
                    </div>
                    <div className="text-2xl">💪</div>
                </div>
            </motion.div>
        );
    };

    const renderWorkoutTypeToggle = () => {
        if (isRunning) return null;
        return (
            <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-10">
                {Object.keys(armWorkouts).map(type => (
                    <motion.button key={type} variants={buttonVariants} whileHover="hover" whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${workoutType === type
                            ? theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg transform scale-105'
                            : theme === 'dark'
                                ? 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-80'
                                : 'bg-gray-300 bg-opacity-70 text-gray-700 hover:bg-opacity-90'
                            }`}>
                        {type === 'Home' ? '🏠' : '🏋️‍♂️'} {type}
                    </motion.button>
                ))}
            </motion.div>
        );
    };

    const renderLevelSelection = () => {
        if (isRunning || !workoutType) return null;
        return (
            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
            >
                {Object.keys(armWorkouts[workoutType]).map(lvl => {
                    const exerciseCount = armWorkouts[workoutType][lvl].length;
                    const workoutTime = armWorkouts[workoutType][lvl].filter(ex => ex.restTime).reduce((sum, ex) => sum + ex.restTime, 0) + (exerciseCount * 45);
                    return (
                        <motion.button
                            key={`${workoutType}-${lvl}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startWorkout(lvl)}
                            className={`p-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:shadow-2xl ${workoutType === 'Home'
                                ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600'
                                : 'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 hover:from-orange-400 hover:via-red-500 hover:to-pink-600'
                                }`}
                        >
                            <div className="text-2xl mb-2">{lvl === 'Beginner' ? '🌱' : lvl === 'Intermediate' ? '⚡' : '🔥'}</div>
                            <div className="text-xl mb-2">{lvl}</div>
                            <div className="text-sm opacity-80">{exerciseCount} exercises • ~{Math.round(workoutTime / 60)} min</div>
                        </motion.button>
                    );
                })}
            </motion.div>
        );
    };

    const renderRestTimer = () => {
        if (!isResting) return null;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            >
                <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-2xl text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl font-bold mb-4 text-blue-400">{formatTime(restTimer)}</div>
                    <div className="text-lg mb-6 text-gray-300">Rest Time</div>
                    <div className="flex gap-4">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={skipRest}
                            className="flex-1 bg-green-600 hover:bg-green-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                        >
                            Skip Rest
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderWorkoutDisplay = () => {
        if (!isRunning || !currentExercise) return null;
        return (
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="relative bg-black bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto"
                key={`${workoutType}-${level}-${currentIndex}`}
            >
                {/* Timer and Progress */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-4 py-2 rounded-full text-lg font-mono z-10 shadow-lg">
                    ⏱️ {formatTime(timer)}
                </div>

                <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-4 py-2 rounded-full text-sm z-10 shadow-lg">
                    {completedSets}/{totalSets} sets
                </div>

                {/* Sound Toggle */}
                <div className="absolute top-16 right-4 z-10">
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className={`p-3 rounded-full shadow-lg transition-colors ${isSoundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {isSoundEnabled ? '🔊' : '🔇'}
                    </motion.button>
                </div>

                {/* Exercise Info */}
                <div className="mt-16 mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-100">
                        {workoutType} - {level} Level
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Exercise {currentIndex + 1} of {armWorkouts[workoutType]?.[level]?.length}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((currentIndex + 1) / (armWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Exercise Image */}
                <motion.div
                    className="h-64 w-full rounded-xl mb-6 bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                >
                    {currentExercise.img ? (
                        <img
                            src={currentExercise.img}
                            alt={currentExercise.name}
                            className="h-full w-full object-contain"
                            onError={e => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="text-gray-500 text-center">Image not available</div>';
                            }}
                        />
                    ) : (
                        <span className="text-gray-500">No Image Available</span>
                    )}
                </motion.div>

                {/* Exercise Details */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">{currentExercise.name}</h3>
                    <p className="text-xl text-yellow-400 font-semibold mb-4">{currentExercise.reps || currentExercise.duration}</p>
                    {currentExercise.difficulty &&
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-gray-400">Difficulty:</span>
                            <span className={`text-lg ${getDifficultyColor(currentExercise.difficulty)}`}>{getDifficultyStars(currentExercise.difficulty)}</span>
                        </div>
                    }
                    {currentExercise.targetMuscles &&
                        <div className="mb-4">
                            <div className="text-gray-400 mb-2">Target Muscles:</div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {currentExercise.targetMuscles.map((muscle, idx) => (
                                    <span key={idx} className="bg-blue-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">{muscle}</span>
                                ))}
                            </div>
                        </div>
                    }
                </div>

                {/* Instructions Toggle */}
                {currentExercise.instructions && (
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={toggleInstructions}
                        className="mb-4 bg-blue-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
                    >
                        {showInstructions ? '📖 Hide Instructions' : '📖 Show Instructions'}
                    </motion.button>
                )}

                <AnimatePresence>
                    {showInstructions && currentExercise.instructions && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-left"
                        >
                            <h4 className="font-semibold text-yellow-400 mb-2">Instructions:</h4>
                            <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                {currentExercise.instructions}
                            </p>
                            {currentExercise.tips && (
                                <>
                                    <h4 className="font-semibold text-green-400 mb-2">Tips:</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        💡 {currentExercise.tips}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={nextExercise}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (armWorkouts[workoutType]?.[level]?.length || 1) - 1
                            ? "🎉 Finish Workout"
                            : "➡️ Next Exercise"}
                    </motion.button>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => stopWorkout(false)}
                        className="bg-red-600 bg-opacity-30 hover:bg-opacity-50 text-white px-6 py-2 rounded-lg transition-all"
                    >
                        🛑 Stop Workout
                    </motion.button>
                </div>
            </motion.div>
        );
    };

    const renderAchievementNotification = () => {
        if (!newAchievement) return null;
        return (
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"
            >
                <div className="text-center">
                    <div className="text-4xl mb-2">{newAchievement.icon}</div>
                    <div className="font-bold text-white mb-1">Achievement Unlocked!</div>
                    <div className="text-sm text-yellow-100">{newAchievement.name}</div>
                    <div className="text-xs text-yellow-200">{newAchievement.description}</div>
                </div>
            </motion.div>
        );
    };

    // ======================== MAIN RENDER ========================

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'
                : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
                }`}>
            <div className="max-w-6xl mx-auto">
                {renderHeader()}
                <AnimatePresence>{renderStats()}</AnimatePresence>
                {renderLastWorkout()}
                {renderWorkoutTypeToggle()}
                {renderLevelSelection()}
                <AnimatePresence>{renderWorkoutDisplay()}</AnimatePresence>
                <AnimatePresence>{renderRestTimer()}</AnimatePresence>
                <AnimatePresence>{renderAchievementNotification()}</AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Arm;
