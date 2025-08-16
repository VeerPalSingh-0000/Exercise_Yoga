import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3";

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
        img: "https://cdn.fitimg.in/content_blog_inner_E4B1CDF6.gif", 
        duration: "60 seconds",
        difficulty: 2,
        instructions: "Stand upright with feet together, arms at sides. Jump while spreading legs shoulder-width apart and raising arms overhead. Return to starting position.",
        targetMuscles: ["Full Body", "Cardio"],
        tips: "Keep your core engaged and land softly on your feet."
    },
    { 
        name: "Warm-up: Arm Circles (Forward)", 
        img: "https://cdn.jefit.com/assets/img/exercises/gifs/867.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Extend arms to sides parallel to ground. Make small forward circles, gradually increasing size.",
        targetMuscles: ["Shoulders", "Arms"],
        tips: "Keep your shoulders relaxed and maintain good posture."
    },
    { 
        name: "Warm-up: Arm Circles (Backward)", 
        img: "https://flabfix.com/wp-content/uploads/2019/08/Reverse-Arm-Circles.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Same as forward circles but in reverse direction to activate different muscle fibers.",
        targetMuscles: ["Shoulders", "Arms"],
        tips: "Focus on controlled movements, don't rush."
    },
    { 
        name: "Warm-up: Wrist Curls (Light/No Weight)", 
        img: "https://www.verywellfit.com/thmb/ToOlI6kmhRUNeGqDbvo3tVJK-fQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/wristcurl-1056698feeaa4cf88a7586827ad70895.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Perform light wrist curls to warm up forearms and prepare for bicep exercises.",
        targetMuscles: ["Forearms", "Wrists"],
        tips: "Use very light weight or no weight for warm-up."
    },
];

const cooldownStretches = [
    { 
        name: "Cooldown: Bicep Wall Stretch", 
        img: "https://post.healthline.com/wp-content/uploads/2019/06/Wall-bicep-stretch-.gif", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Place palm against wall, slowly turn body away to stretch bicep and chest.",
        targetMuscles: ["Biceps", "Chest"],
        tips: "Don't force the stretch - go to comfortable tension only."
    },
    { 
        name: "Cooldown: Wrist Extensor Stretch", 
        img: "https://www.spotebi.com/wp-content/uploads/2015/04/wrist-stretch-exercise-illustration.gif", 
        duration: "30 seconds each wrist",
        difficulty: 1,
        instructions: "Extend arm forward, gently pull fingers back with other hand to stretch forearm.",
        targetMuscles: ["Forearms", "Wrists"],
        tips: "Hold gentle tension for 30 seconds on each side."
    },
    { 
        name: "Cooldown: Overhead Triceps Stretch", 
        img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Reach one arm overhead, bend elbow, use other hand to gently pull elbow.",
        targetMuscles: ["Triceps", "Shoulders"],
        tips: "This also helps stretch the bicep indirectly."
    },
    { 
        name: "Cooldown: Child's Pose", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Kneel on floor, sit back on heels, then fold forward extending arms in front.",
        targetMuscles: ["Back", "Shoulders"],
        tips: "Focus on deep breathing and let gravity help you stretch."
    },
];

const bicepsWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Isometric Bicep Contraction", 
                img: "https://www.inspireusafoundation.org/wp-content/uploads/2023/04/wall-push-ups.gif", 
                reps: "3 sets × 15-20 sec hold each arm",
                difficulty: 2,
                instructions: "Press one arm against wall or use other hand to provide resistance. Contract bicep and hold.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Focus on really squeezing the bicep muscle during the hold.",
                restTime: 45
            },
            { 
                name: "Towel Bicep Curls", 
                img: "https://cdn.shopify.com/s/files/1/0618/9462/3460/files/StandingBicepCurl.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Loop towel under foot, hold ends, provide resistance as you curl up against your own force.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Control both the up and down portions of the movement.",
                restTime: 60
            },
            { 
                name: "Door Frame Rows (Underhand Grip)", 
                img: "https://www.nerdfitness.com/wp-content/uploads/2020/04/doorway-row.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Hold door frame with underhand grip, lean back and pull body toward door using biceps.",
                targetMuscles: ["Biceps", "Back", "Rear Delts"],
                tips: "Ensure door frame is sturdy. Focus on bicep contraction.",
                restTime: 75
            },
            { 
                name: "Wall Pulls / Scapular Retraction", 
                img: "https://i.pinimg.com/originals/82/77/25/827725c8e3653c95be7a09d0611523c2.gif", 
                reps: "3 sets × 15 reps",
                difficulty: 2,
                instructions: "Stand facing wall, pull body toward wall focusing on bicep and back activation.",
                targetMuscles: ["Biceps", "Back", "Rear Delts"],
                tips: "Squeeze shoulder blades together and engage biceps.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Chin-Up Negatives", 
                img: "https://i.pinimg.com/originals/82/77/25/827725c8e3653c95be7a09d0611523c2.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 4,
                instructions: "Jump or step up to chin-up position, slowly lower yourself down taking 3-5 seconds.",
                targetMuscles: ["Biceps", "Lats", "Back"],
                tips: "Focus on controlling the descent. This builds strength for full chin-ups.",
                restTime: 90
            },
            { 
                name: "Inverted Rows (Underhand Grip, feet elevated)", 
                img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/03/inverted-row-with-underhand-grip-new.gif?fit=600%2C600&ssl=1", 
                reps: "3 sets × 8-12 reps",
                difficulty: 4,
                instructions: "Lie under table, grip edge with underhand grip, pull chest to table with feet elevated.",
                targetMuscles: ["Biceps", "Back", "Rear Delts"],
                tips: "Elevating feet increases difficulty. Focus on bicep squeeze.",
                restTime: 90
            },
            { 
                name: "Bodyweight Hammer Curls (using towel tension)", 
                img: "https://i.pinimg.com/originals/fe/0a/85/fe0a853605de67a2b6bc33ce1e4ad8a8.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Use towel or band to create resistance for hammer curl motion (neutral grip).",
                targetMuscles: ["Biceps", "Brachialis", "Forearms"],
                tips: "Neutral grip targets different part of bicep and forearms.",
                restTime: 75
            },
            { 
                name: "Concentration Curls (Isometric against leg)", 
                img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Concentration-curl.gif?fit=600%2C600&ssl=1", 
                reps: "3 sets × 10-15 sec hold each arm",
                difficulty: 3,
                instructions: "Sit down, brace elbow against inner thigh, curl up and hold the contraction.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Really focus on the peak contraction and squeeze.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Chin-Ups", 
                img: "https://www.verywellfit.com/thmb/MfbjgOZJaqecnhZSvKl8H2YLfvs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/67-3120735-Pullups-GIF-b08bf524e15c4bb2a70c7fc43e1fe9c0.gif", 
                reps: "3 sets × AMRAP",
                difficulty: 5,
                instructions: "Hang from bar with underhand grip, pull body up until chin clears bar. Lower with control.",
                targetMuscles: ["Biceps", "Lats", "Back"],
                tips: "Underhand grip emphasizes biceps more than overhand pull-ups.",
                restTime: 120
            },
            { 
                name: "Towel Hang (Underhand Grip)", 
                img: "https://barbend.com/wp-content/uploads/2023/12/towel-pullup-barbend-movement-gif-masters.gif", 
                reps: "3 sets × Max Hold Time",
                difficulty: 5,
                instructions: "Hang from towels with underhand grip for maximum time to build grip and bicep strength.",
                targetMuscles: ["Biceps", "Forearms", "Grip Strength"],
                tips: "This is extremely challenging - builds incredible grip and bicep endurance.",
                restTime: 120
            },
            { 
                name: "One-Arm Door Frame Rows (Underhand)", 
                img: "https://i.makeagif.com/media/8-26-2015/yPAHwb.gif", 
                reps: "3 sets × 8-10 reps each side",
                difficulty: 5,
                instructions: "Single-arm door frame rows with underhand grip focusing on bicep isolation.",
                targetMuscles: ["Biceps", "Back", "Core"],
                tips: "Advanced exercise - requires significant unilateral strength.",
                restTime: 120
            },
            { 
                name: "Pelican Curls", 
                img: "https://bodyweighttrainingarena.com/wp-content/uploads/2020/08/Pelican-Curls-Low-Bicep-exercises.gif", 
                reps: "3 sets × 6-10 reps",
                difficulty: 5,
                instructions: "Using rings or suspension trainer, curl your body up focusing on bicep contraction.",
                targetMuscles: ["Biceps", "Core", "Shoulders"],
                tips: "Extremely advanced exercise. Master regular chin-ups first.",
                restTime: 120
            },
            { 
                name: "Commando Pull-Ups (alternating grip)", 
                img: "https://dl.beigi.fit/harakat/Lats-muscles/Alt-commando-pullup.gif", 
                reps: "3 sets × 6-10 reps total",
                difficulty: 5,
                instructions: "Pull-up bringing head to alternate sides of bar, emphasizing unilateral bicep work.",
                targetMuscles: ["Biceps", "Lats", "Core"],
                tips: "Very advanced. Requires mastery of regular chin-ups first.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Machine Bicep Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/123.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Sit at bicep curl machine, adjust seat height, curl weights up focusing on bicep contraction.",
                targetMuscles: ["Biceps"],
                tips: "Machine provides stability - perfect for beginners to learn movement.",
                restTime: 75
            },
            { 
                name: "Seated Dumbbell Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/102.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 2,
                instructions: "Sit on bench, curl dumbbells up with control, focusing on bicep squeeze at top.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Seated position eliminates momentum. Keep elbows at sides.",
                restTime: 75
            },
            { 
                name: "Seated Dumbbell Hammer Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/98.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Seated hammer curls with neutral grip, targets different part of bicep and forearms.",
                targetMuscles: ["Biceps", "Brachialis", "Forearms"],
                tips: "Neutral grip reduces wrist stress and targets brachialis muscle.",
                restTime: 75
            },
            { 
                name: "Standing Cable Curls (EZ Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/114.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Stand at cable machine, curl EZ bar attachment focusing on constant tension.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Cable provides constant tension throughout entire range of motion.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Standing Barbell Curls (EZ Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/100.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 3,
                instructions: "Standing EZ bar curls with proper form, focusing on bicep peak contraction.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "EZ bar is easier on wrists than straight bar. Avoid swinging.",
                restTime: 90
            },
            { 
                name: "Incline Dumbbell Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/104.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Lie on incline bench, curl dumbbells up from stretched position for maximum range.",
                targetMuscles: ["Biceps", "Long Head"],
                tips: "Incline position provides greater stretch and targets long head of bicep.",
                restTime: 90
            },
            { 
                name: "Cable Hammer Curls (Rope)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/106.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Use rope attachment for hammer curls, focus on squeezing at the top.",
                targetMuscles: ["Biceps", "Brachialis", "Forearms"],
                tips: "Rope allows for natural hand position and good forearm activation.",
                restTime: 75
            },
            { 
                name: "Concentration Curls (Dumbbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/103.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Sit on bench, brace elbow against inner thigh, perform isolated bicep curls.",
                targetMuscles: ["Biceps"],
                tips: "Pure isolation exercise. Focus on peak contraction and control.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Standing Barbell Curls (Straight Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/99.gif", 
                reps: "4 sets × 6-8 reps",
                difficulty: 4,
                instructions: "Heavy straight bar curls focusing on strength and progressive overload.",
                targetMuscles: ["Biceps", "Forearms"],
                tips: "Straight bar is harder on wrists but allows heavier weight. Use proper form.",
                restTime: 120
            },
            { 
                name: "Preacher Curls (EZ Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/101.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Use preacher bench to isolate biceps, preventing momentum and ensuring strict form.",
                targetMuscles: ["Biceps", "Short Head"],
                tips: "Preacher position targets short head of bicep. Don't fully extend at bottom.",
                restTime: 90
            },
            { 
                name: "High Cable Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/110.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 4,
                instructions: "Stand between cables set high, curl handles toward head in crucifix position.",
                targetMuscles: ["Biceps", "Peak"],
                tips: "Unique angle targets bicep peak. Great for finishing move.",
                restTime: 75
            },
            { 
                name: "Weighted Chin-Ups", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/229.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Perform chin-ups with additional weight via belt or vest for increased resistance.",
                targetMuscles: ["Biceps", "Lats", "Back"],
                tips: "Master bodyweight chin-ups first. Add weight gradually.",
                restTime: 150
            },
            { 
                name: "Reverse Barbell Curls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/109.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Overhand grip barbell curls targeting brachialis and forearm extensors.",
                targetMuscles: ["Brachialis", "Forearms", "Biceps"],
                tips: "Great for building forearm strength and overall arm size.",
                restTime: 90
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Flex", description: "Complete your first biceps workout", icon: "💪", unlocked: false },
    { id: 2, name: "Curl Master", description: "Complete 5 biceps workouts", icon: "🏋️", unlocked: false },
    { id: 3, name: "Steel Guns", description: "Complete 10 biceps workouts", icon: "🔫", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Bicep King", description: "Complete 20 biceps workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Biceps = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('bicepsSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('bicepsWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('bicepsUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('bicepsTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastBicepsWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('bicepsSoundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('bicepsTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('bicepsWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('bicepsUserAchievements', userAchievements);
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

        // First workout
        if (workoutHistory.length === 0 && !updatedAchievements[0].unlocked) {
            updatedAchievements[0].unlocked = true;
            setNewAchievement(updatedAchievements[0]);
            hasNewAchievement = true;
        }

        // 5 workouts
        if (workoutHistory.length + 1 >= 5 && !updatedAchievements[1].unlocked) {
            updatedAchievements[1].unlocked = true;
            setNewAchievement(updatedAchievements[1]);
            hasNewAchievement = true;
        }

        // Hard level workout
        if (workoutData.level === 'Hard' && !updatedAchievements[3].unlocked) {
            updatedAchievements[3].unlocked = true;
            setNewAchievement(updatedAchievements[3]);
            hasNewAchievement = true;
        }

        // 30+ minute workout
        if (workoutData.duration >= 1800 && !updatedAchievements[4].unlocked) {
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
        const workout = bicepsWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        if (!bicepsWorkouts[workoutType]?.[lvl]?.length) {
            alert(`No ${lvl} biceps workouts available for ${workoutType}.`);
            return;
        }
        
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
            setStorageItem("lastBicepsWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = bicepsWorkouts[workoutType]?.[level];
        if (!currentWorkoutList) return;

        const currentExercise = currentWorkoutList[currentIndex];
        
        // If current exercise has sets, increment completed sets
        if (currentExercise?.reps?.includes('sets')) {
            setCompletedSets(prev => prev + 1);
        }

        if (currentIndex < currentWorkoutList.length - 1) {
            // Start rest timer if current exercise has rest time
            if (currentExercise?.restTime && !currentExercise.name.includes('Warm-up') && !currentExercise.name.includes('Cooldown')) {
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
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    // ======================== UI HELPER FUNCTIONS ========================
    const getDifficultyColor = (difficulty) => {
        const colors = {
            1: 'text-green-400',
            2: 'text-yellow-400', 
            3: 'text-orange-400',
            4: 'text-red-400',
            5: 'text-purple-400'
        };
        return colors[difficulty] || 'text-gray-400';
    };

    const getDifficultyStars = (difficulty) => {
        return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
    };

    const getWorkoutStats = () => {
        if (workoutHistory.length === 0) {
            return {
                totalWorkouts: 0,
                totalTime: formatTime(0),
                avgTime: formatTime(0),
                longestWorkout: formatTime(0)
            };
        }
        
        const totalWorkouts = workoutHistory.length;
        const totalTime = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
        const avgTime = totalTime / totalWorkouts;
        const longestWorkout = Math.max(...workoutHistory.map(w => w.duration));
        
        return {
            totalWorkouts,
            totalTime: formatTime(totalTime),
            avgTime: formatTime(Math.round(avgTime)),
            longestWorkout: formatTime(longestWorkout)
        };
    };

    const currentExercise = isRunning && workoutType && level && bicepsWorkouts[workoutType]?.[level]
        ? bicepsWorkouts[workoutType][level][currentIndex]
        : null;

    const stats = getWorkoutStats();

    // ======================== ANIMATION VARIANTS ========================
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    };

    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", stiffness: 100, damping: 15 } 
        },
        exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
        tap: { scale: 0.95 }
    };

    // ======================== RENDER COMPONENTS ========================
    const renderHeader = () => (
        <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <motion.h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className={`bg-gradient-to-r ${
                    theme === 'dark' 
                        ? 'from-blue-400 to-cyan-600' 
                        : 'from-blue-600 to-cyan-800'
                } bg-clip-text text-transparent`}>
                    💪 Biceps Builder Pro
                </span>
            </motion.h1>
            
            <div className="flex gap-3">
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowStats(!showStats)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    📊 Stats
                </motion.button>
                
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover" 
                    whileTap="tap"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                >
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
                <h3 className={`text-xl font-bold mb-4 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>📈 Your Biceps Progress</h3>
                
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">💪</div>
                        <div className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Ready to Flex?</div>
                        <div className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Complete your first biceps workout to see statistics here!</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{stats.totalWorkouts}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Workouts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-500">{stats.totalTime}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.avgTime}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Average Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{stats.longestWorkout}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Longest Workout</div>
                        </div>
                    </div>
                )}
                
                {/* Achievements */}
                <div className="mt-6">
                    <h4 className={`text-lg font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>🏆 Biceps Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                                    achievement.unlocked 
                                        ? theme === 'dark'
                                            ? 'bg-blue-600 bg-opacity-30 border-blue-500'
                                            : 'bg-blue-100 border-blue-400'
                                        : theme === 'dark'
                                            ? 'bg-gray-600 bg-opacity-30 border-gray-500'
                                            : 'bg-gray-100 border-gray-400'
                                }`}
                            >
                                <div className="text-2xl mb-1">{achievement.icon}</div>
                                <div className={`text-xs font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{achievement.name}</div>
                                <div className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{achievement.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Recent Workouts History */}
                {workoutHistory.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`text-lg font-semibold mb-3 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>📋 Recent Workouts</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {workoutHistory.slice(0, 5).map((workout, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-lg ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 bg-opacity-30' 
                                            : 'bg-gray-200 bg-opacity-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                            {workout.type === 'Home' ? '🏠' : '🏋️‍♂️'}
                                        </div>
                                        <div>
                                            <div className={`font-semibold text-sm ${
                                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>{workout.type} - {workout.level}</div>
                                            <div className={`text-xs ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>{workout.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-500">{formatTime(workout.duration)}</div>
                                        <div className={`text-xs ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>{workout.setsCompleted || 0} sets</div>
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
                className={`mb-8 backdrop-blur-md p-4 rounded-xl border ${
                    theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30'
                        : 'bg-gradient-to-r from-blue-100/70 to-cyan-100/70 border-blue-400/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>🎯 Last Biceps Workout</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
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
            <motion.div
                variants={itemVariants}
                className="flex justify-center gap-4 mb-10"
            >
                {Object.keys(bicepsWorkouts).map((type) => (
                    <motion.button
                        key={type}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            workoutType === type
                                ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg transform scale-105'
                                : theme === 'dark'
                                    ? 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-80'
                                    : 'bg-gray-300 bg-opacity-70 text-gray-700 hover:bg-opacity-90'
                        }`}
                    >
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
                {Object.keys(bicepsWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = bicepsWorkouts[workoutType][lvl].length;
                    const workoutTime = bicepsWorkouts[workoutType][lvl]
                        .filter(ex => ex.restTime)
                        .reduce((sum, ex) => sum + ex.restTime, 0) + (exerciseCount * 45);
                    
                    return (
                        <motion.button
                            key={`${workoutType}-${lvl}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startWorkout(lvl)}
                            className={`p-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:shadow-2xl ${
                                workoutType === 'Home'
                                    ? 'bg-gradient-to-br from-blue-500 via-cyan-600 to-sky-700 hover:from-blue-400 hover:via-cyan-500 hover:to-sky-600'
                                    : 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600'
                            }`}
                        >
                            <div className="text-2xl mb-2">
                                {lvl === 'Beginner' ? '🌱' : lvl === 'Intermediate' ? '⚡' : '🔥'}
                            </div>
                            <div className="text-xl mb-2">{lvl}</div>
                            <div className="text-sm opacity-80">
                                {exerciseCount} exercises • ~{Math.round(workoutTime / 60)} min
                            </div>
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
                <div className="bg-gradient-to-br from-blue-900 to-cyan-900 p-8 rounded-2xl text-center max-w-sm mx-4">
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
                        className={`p-3 rounded-full shadow-lg transition-colors ${
                            isSoundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
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
                        Exercise {currentIndex + 1} of {bicepsWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (bicepsWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
                            }}
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
                            onError={(e) => {
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
                    <p className="text-xl text-yellow-400 font-semibold mb-4">
                        {currentExercise.reps || currentExercise.duration}
                    </p>
                    
                    {currentExercise.difficulty && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-gray-400">Difficulty:</span>
                            <span className={`text-lg ${getDifficultyColor(currentExercise.difficulty)}`}>
                                {getDifficultyStars(currentExercise.difficulty)}
                            </span>
                        </div>
                    )}
                    
                    {currentExercise.targetMuscles && (
                        <div className="mb-4">
                            <div className="text-gray-400 mb-2">Target Muscles:</div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {currentExercise.targetMuscles.map((muscle, idx) => (
                                    <span key={idx} className="bg-blue-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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

                {/* Instructions Display */}
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
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (bicepsWorkouts[workoutType]?.[level]?.length || 1) - 1
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
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"
            >
                <div className="text-center">
                    <div className="text-4xl mb-2">{newAchievement.icon}</div>
                    <div className="font-bold text-white mb-1">Achievement Unlocked!</div>
                    <div className="text-sm text-blue-100">{newAchievement.name}</div>
                    <div className="text-xs text-blue-200">{newAchievement.description}</div>
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
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white' 
                    : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 text-gray-900'
            }`}
        >
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

export default Biceps;
