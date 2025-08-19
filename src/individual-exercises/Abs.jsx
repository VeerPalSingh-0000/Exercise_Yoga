import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import motivationalSound from "../assets/sounds/workout_motivation.mp3";

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
        name: "Warm-up: Torso Twists", 
        img: "https://cdn.jefit.com/assets/img/exercises/gifs/677.gif", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Stand with feet shoulder-width apart, hands on hips. Rotate torso left and right while keeping hips stable.",
        targetMuscles: ["Core", "Back"],
        tips: "Keep your core engaged throughout the movement."
    },
    { 
        name: "Warm-up: Cat-Cow Stretch", 
        img: "https://www.yogajournal.com/wp-content/uploads/2020/01/cat-cow-1.gif?width=730", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "On hands and knees, alternate between arching back (cow) and rounding spine (cat).",
        targetMuscles: ["Back", "Core"],
        tips: "Move slowly and coordinate with your breathing."
    },
];

const cooldownStretches = [
    { 
        name: "Cooldown: Child's Pose", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Kneel on floor, sit back on heels, then fold forward extending arms in front.",
        targetMuscles: ["Back", "Shoulders"],
        tips: "Focus on deep breathing and let gravity help you stretch."
    },
    { 
        name: "Cooldown: Cobra Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3824-Cobra_Stretch-1200x628-facebook.jpg", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Lie face down, place palms under shoulders, slowly push up arching your back.",
        targetMuscles: ["Chest", "Hip Flexors"],
        tips: "Keep hips on ground and don't overextend your back."
    },
    { 
        name: "Cooldown: Knees-to-Chest Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/8245-Knees_To_Chest_Stretch-1200x628-facebook.jpg", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Lie on back, pull both knees toward chest and hold gently.",
        targetMuscles: ["Lower Back", "Hips"],
        tips: "Rock gently side to side for added benefit."
    },
    { 
        name: "Cooldown: Standing Forward Bend", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/8250_Standing_Forward_Bend-1200x628-facebook.jpg", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Stand with feet hip-width apart, fold forward letting arms hang naturally.",
        targetMuscles: ["Hamstrings", "Calves", "Back"],
        tips: "Bend knees slightly if hamstrings are tight."
    },
];

const absWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Crunches", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/crunch-1457102356.gif?resize=640:*", 
                reps: "3 sets × 15 reps",
                difficulty: 2,
                instructions: "Lie on back, knees bent, feet flat. Place hands behind head, lift shoulders off ground using core muscles.",
                targetMuscles: ["Upper Abs", "Core"],
                tips: "Don't pull on your neck. Focus on lifting with your core.",
                restTime: 45
            },
            { 
                name: "Leg Raises", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/legraise-1472054568.gif", 
                reps: "3 sets × 12 reps",
                difficulty: 3,
                instructions: "Lie on back, legs straight. Lift legs to 90 degrees, lower slowly without touching ground.",
                targetMuscles: ["Lower Abs", "Hip Flexors"],
                tips: "Press lower back into floor and control the movement.",
                restTime: 60
            },
            { 
                name: "Dead Bug", 
                img: "https://media2.giphy.com/media/aIyZ9Ra6pyo5ZOHQsm/giphy.gif", 
                reps: "3 sets × 10 reps each side",
                difficulty: 2,
                instructions: "Lie on back, arms up, knees at 90 degrees. Lower opposite arm and leg, return to start.",
                targetMuscles: ["Core", "Stability"],
                tips: "Keep lower back pressed to floor throughout movement.",
                restTime: 45
            },
            { 
                name: "Russian Twists (no weight)", 
                img: "https://hw.qld.gov.au/wp-content/uploads/2015/07/25_M_WIP02.gif", 
                reps: "3 sets × 20 twists",
                difficulty: 2,
                instructions: "Sit with knees bent, lean back slightly. Rotate torso side to side, touching ground alternately.",
                targetMuscles: ["Obliques", "Core"],
                tips: "Keep chest up and core engaged throughout.",
                restTime: 45
            },
            { 
                name: "Plank", 
                img: "https://hips.hearstapps.com/hmg-prod/images/hdm119918mh15842-1545237096.png", 
                reps: "3 sets × 30 sec hold",
                difficulty: 3,
                instructions: "Hold push-up position on forearms, body in straight line from head to heels.",
                targetMuscles: ["Core", "Shoulders", "Glutes"],
                tips: "Don't let hips sag or pike up. Breathe normally.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Bicycle Crunches", 
                img: "https://i.pinimg.com/originals/fc/4b/07/fc4b07092d4233d268d43c40dec321d0.gif", 
                reps: "3 sets × 20 reps",
                difficulty: 3,
                instructions: "Lie on back, hands behind head. Bring knee to opposite elbow in cycling motion.",
                targetMuscles: ["Obliques", "Upper Abs"],
                tips: "Focus on rotation, not speed. Control the movement.",
                restTime: 60
            },
            { 
                name: "Reverse Crunches", 
                img: "https://images.ctfassets.net/6ilvqec50fal/60HBk95X0A7Yh2xfHBkIGE/bbf8f4c8cf49827a7e91836351419792/reverse-crunch-andy-speer.gif", 
                reps: "3 sets × 15 reps",
                difficulty: 3,
                instructions: "Lie on back, knees bent. Pull knees toward chest, lifting hips off ground.",
                targetMuscles: ["Lower Abs", "Core"],
                tips: "Use core to lift hips, not momentum.",
                restTime: 60
            },
            { 
                name: "Plank to Shoulder Taps", 
                img: "https://i.pinimg.com/originals/08/b1/f8/08b1f8a8de39bc33916af4547dc04b5a.gif", 
                reps: "3 sets × 20 taps",
                difficulty: 4,
                instructions: "Hold plank position, alternate tapping opposite shoulder while maintaining stability.",
                targetMuscles: ["Core", "Shoulders", "Stability"],
                tips: "Keep hips level and minimize body rotation.",
                restTime: 75
            },
            { 
                name: "Flutter Kicks", 
                img: "https://i.pinimg.com/originals/26/a7/50/26a750b15b8e6f3b05976b406d52f7b1.gif", 
                reps: "3 sets × 30 seconds",
                difficulty: 3,
                instructions: "Lie on back, lift legs slightly. Alternate small up and down leg movements.",
                targetMuscles: ["Lower Abs", "Hip Flexors"],
                tips: "Keep movements small and controlled. Press back into floor.",
                restTime: 60
            },
            { 
                name: "Side Plank (Left)", 
                img: "https://experiencelife.lifetime.life/wp-content/uploads/2021/07/bid-side-plank.jpg", 
                reps: "3 sets × 30 sec",
                difficulty: 4,
                instructions: "Lie on side, prop up on forearm. Lift hips creating straight line from head to feet.",
                targetMuscles: ["Obliques", "Core", "Shoulders"],
                tips: "Keep hips up and body in straight line.",
                restTime: 45
            },
            { 
                name: "Side Plank (Right)", 
                img: "https://ik.imagekit.io/02fmeo4exvw/exercise-library/large/101-2.jpg", 
                reps: "3 sets × 30 sec",
                difficulty: 4,
                instructions: "Same as left side plank but on right side.",
                targetMuscles: ["Obliques", "Core", "Shoulders"],
                tips: "Keep hips up and body in straight line.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "V-Ups", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/vupmodifiedwithhands-1472155234.gif", 
                reps: "3 sets × 20 reps",
                difficulty: 5,
                instructions: "Lie flat, simultaneously lift legs and torso to meet in V-shape. Lower with control.",
                targetMuscles: ["Full Core", "Hip Flexors"],
                tips: "Use core strength, not momentum. Control both up and down.",
                restTime: 90
            },
            { 
                name: "Mountain Climbers", 
                img: "https://i.pinimg.com/originals/32/a7/d0/32a7d00d6123dd416e459ba67cf1691b.gif", 
                reps: "3 sets × 30 sec",
                difficulty: 4,
                instructions: "Start in plank, alternate bringing knees to chest in running motion.",
                targetMuscles: ["Core", "Cardio", "Shoulders"],
                tips: "Keep hips level and core tight throughout.",
                restTime: 75
            },
            { 
                name: "Toe Touches (Legs Up)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/76.gif", 
                reps: "3 sets × 15 reps",
                difficulty: 4,
                instructions: "Lie on back, legs straight up. Reach hands toward toes, lifting shoulders off ground.",
                targetMuscles: ["Upper Abs", "Core"],
                tips: "Lift with core, not neck. Keep legs straight.",
                restTime: 75
            },
            { 
                name: "Russian Twists (with weight)", 
                img: "https://hips.hearstapps.com/hmg-prod/images/108-weighted-russian-twists-1579279935.gif", 
                reps: "3 sets × 20 twists",
                difficulty: 5,
                instructions: "Hold weight, lean back slightly. Rotate torso side to side touching ground.",
                targetMuscles: ["Obliques", "Core"],
                tips: "Control the weight, don't let it control you.",
                restTime: 90
            },
            { 
                name: "Plank to Elbow + Reach Out", 
                img: "https://cdn.shopify.com/s/files/1/0330/6521/files/1.gif?v=1597238005", 
                reps: "3 sets × 12 reps each arm",
                difficulty: 5,
                instructions: "Start in plank, lower to elbows one at a time, then extend one arm forward.",
                targetMuscles: ["Core", "Shoulders", "Stability"],
                tips: "Minimize hip movement and maintain core tension.",
                restTime: 90
            },
            { 
                name: "Side Plank with Hip Dips", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/hipup-1472221358.gif", 
                reps: "3 sets × 15 dips each side",
                difficulty: 5,
                instructions: "Hold side plank, lower hip toward ground then lift back up repeatedly.",
                targetMuscles: ["Obliques", "Core", "Glutes"],
                tips: "Control the movement and keep body aligned.",
                restTime: 90
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Cable Crunches", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/30.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Kneel facing cable machine, hold rope attachment, crunch down bringing elbows to knees.",
                targetMuscles: ["Upper Abs", "Core"],
                tips: "Focus on core flexion, not arm pull.",
                restTime: 60
            },
            { 
                name: "Hanging Knee Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/398.gif", 
                reps: "3 sets × 8-12 reps",
                difficulty: 3,
                instructions: "Hang from pull-up bar, raise knees toward chest, lower with control.",
                targetMuscles: ["Lower Abs", "Hip Flexors"],
                tips: "Don't swing. Use core to lift knees.",
                restTime: 90
            },
            { 
                name: "Ab Wheel Rollouts (Assisted)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/142.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Kneel holding ab wheel, roll forward maintaining straight line, return to start.",
                targetMuscles: ["Full Core", "Shoulders"],
                tips: "Start with partial range of motion.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Weighted Crunches", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/31.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Hold weight plate on chest, perform crunches with added resistance.",
                targetMuscles: ["Upper Abs", "Core"],
                tips: "Control the weight and focus on core contraction.",
                restTime: 75
            },
            { 
                name: "Cable Wood Chops", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/450.gif", 
                reps: "3 sets × 12 reps each side",
                difficulty: 4,
                instructions: "Stand sideways to cable, pull across body from high to low in chopping motion.",
                targetMuscles: ["Obliques", "Core", "Rotation"],
                tips: "Rotate through core, not just arms.",
                restTime: 75
            },
            { 
                name: "Decline Sit-ups", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/26.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 4,
                instructions: "On decline bench, perform sit-ups against gravity for increased difficulty.",
                targetMuscles: ["Full Core", "Hip Flexors"],
                tips: "Control the movement, don't use momentum.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Dragon Flags", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/188.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Lie on bench, hold behind head, lift entire body keeping it straight, lower slowly.",
                targetMuscles: ["Full Core", "Lower Abs"],
                tips: "Extremely advanced. Start with negatives only.",
                restTime: 120
            },
            { 
                name: "Weighted Hanging Leg Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/399.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 5,
                instructions: "Hang from bar with ankle weights, raise legs to 90 degrees.",
                targetMuscles: ["Lower Abs", "Hip Flexors"],
                tips: "Control the swing and use core strength.",
                restTime: 120
            },
            { 
                name: "Ab Wheel Rollouts (Full)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/143.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 5,
                instructions: "Full range ab wheel rollouts from knees or standing position.",
                targetMuscles: ["Full Core", "Shoulders", "Back"],
                tips: "Master kneeling version before attempting standing.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Burn", description: "Complete your first abs workout", icon: "🔥", unlocked: false },
    { id: 2, name: "Core Warrior", description: "Complete 5 abs workouts", icon: "⚡", unlocked: false },
    { id: 3, name: "Steel Core", description: "Complete 10 abs workouts", icon: "🛡️", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "💪", unlocked: false },
    { id: 6, name: "Core Master", description: "Complete 20 abs workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Abs = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('absSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('absWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('absUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('absTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastAbsWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('absSoundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('absTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('absWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('absUserAchievements', userAchievements);
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
        const workout = absWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        if (!absWorkouts[workoutType]?.[lvl]?.length) {
            alert(`No ${lvl} abs workouts available for ${workoutType}.`);
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
            setStorageItem("lastAbsWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = absWorkouts[workoutType]?.[level];
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

    const currentExercise = isRunning && workoutType && level && absWorkouts[workoutType]?.[level]
        ? absWorkouts[workoutType][level][currentIndex]
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
                        ? 'from-orange-400 to-red-600' 
                        : 'from-orange-600 to-red-800'
                } bg-clip-text text-transparent`}>
                    🔥 Core Sculptor Pro
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
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
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
                }`}>📈 Your Core Progress</h3>
                
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🔥</div>
                        <div className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Ready to Burn?</div>
                        <div className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Complete your first abs workout to see statistics here!</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">{stats.totalWorkouts}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Workouts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{stats.totalTime}</div>
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
                    }`}>🏆 Core Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                                    achievement.unlocked 
                                        ? theme === 'dark'
                                            ? 'bg-orange-600 bg-opacity-30 border-orange-500'
                                            : 'bg-orange-100 border-orange-400'
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
                                        <div className="font-bold text-orange-500">{formatTime(workout.duration)}</div>
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
                        ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30'
                        : 'bg-gradient-to-r from-orange-100/70 to-red-100/70 border-orange-400/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                        }`}>🎯 Last Abs Workout</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {lastWorkoutInfo.type} - {lastWorkoutInfo.level} • {formatTime(lastWorkoutInfo.duration)} • {lastWorkoutInfo.date}
                        </p>
                    </div>
                    <div className="text-2xl">🔥</div>
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
                {Object.keys(absWorkouts).map((type) => (
                    <motion.button
                        key={type}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            workoutType === type
                                ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg transform scale-105'
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
                {Object.keys(absWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = absWorkouts[workoutType][lvl].length;
                    const workoutTime = absWorkouts[workoutType][lvl]
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
                                    ? 'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 hover:from-orange-400 hover:via-red-500 hover:to-pink-600'
                                    : 'bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 hover:from-purple-400 hover:via-indigo-500 hover:to-blue-600'
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
                <div className="bg-gradient-to-br from-orange-900 to-red-900 p-8 rounded-2xl text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl font-bold mb-4 text-orange-400">{formatTime(restTimer)}</div>
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
                        Exercise {currentIndex + 1} of {absWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (absWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
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
                                    <span key={idx} className="bg-orange-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">
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
                        className="mb-4 bg-orange-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
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
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (absWorkouts[workoutType]?.[level]?.length || 1) - 1
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
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"
            >
                <div className="text-center">
                    <div className="text-4xl mb-2">{newAchievement.icon}</div>
                    <div className="font-bold text-white mb-1">Achievement Unlocked!</div>
                    <div className="text-sm text-orange-100">{newAchievement.name}</div>
                    <div className="text-xs text-orange-200">{newAchievement.description}</div>
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
                    ? 'bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 text-white' 
                    : 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 text-gray-900'
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

export default Abs;
