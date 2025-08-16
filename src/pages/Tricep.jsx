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
        name: "Warm-up: Dynamic Chest Stretch", 
        img: "https://cdn.jefit.com/assets/img/exercises/gifs/846.gif", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Stand tall, stretch arms across chest and pull back dynamically to open chest muscles.",
        targetMuscles: ["Chest", "Shoulders"],
        tips: "Don't bounce aggressively, use controlled movements."
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
        name: "Cooldown: Cat-Cow Stretch", 
        img: "https://www.yogajournal.com/wp-content/uploads/2020/01/cat-cow-1.gif?width=730", 
        duration: "1 minute",
        difficulty: 1,
        instructions: "On hands and knees, alternate between arching back (cow) and rounding spine (cat).",
        targetMuscles: ["Back", "Core"],
        tips: "Move slowly and coordinate with your breathing."
    },
    { 
        name: "Cooldown: Static Chest Stretch (Doorway)", 
        img: "https://images.squarespace-cdn.com/content/v1/5f5e8592d2b0854b18af6975/bf602891-d983-47a2-bab2-d2e1719b5ffd/Doorway+Chest+Stretch.jpg", 
        duration: "30 seconds each side",
        difficulty: 2,
        instructions: "Place forearm on doorway, step forward to stretch chest. Switch arms.",
        targetMuscles: ["Chest", "Shoulders"],
        tips: "Don't force the stretch, hold comfortably for best results."
    },
    { 
        name: "Cooldown: Overhead Triceps Stretch", 
        img: "https://i.ytimg.com/vi/zzvDO56B0HE/maxresdefault.jpg", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Reach one arm overhead, bend elbow, use other hand to gently pull elbow.",
        targetMuscles: ["Triceps", "Shoulders"],
        tips: "Keep your back straight and don't pull too hard."
    },
];

const tricepsWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Wall Triceps Push-ups", 
                img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Wall-push-up.gif?fit=600%2C600&ssl=1", 
                reps: "3 sets × 15-20 reps",
                difficulty: 1,
                instructions: "Stand arm's length from wall, place hands closer than shoulder-width. Push body toward and away from wall focusing on triceps.",
                targetMuscles: ["Triceps", "Shoulders"],
                tips: "Keep elbows close to your body and focus on squeezing triceps.",
                restTime: 45
            },
            { 
                name: "Kneeling Triceps Push-ups", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/GRT-1.17.RegularChestPushupOnKnees.gif", 
                reps: "3 sets × 10-15 reps",
                difficulty: 2,
                instructions: "Perform push-ups on knees with hands in close grip position to emphasize triceps.",
                targetMuscles: ["Triceps", "Chest", "Shoulders"],
                tips: "Keep hands close together and elbows tucked to sides.",
                restTime: 60
            },
            { 
                name: "Chair Dips (Bent Knees)", 
                img: "https://www.bodybuilding.com/images/2020/xdb/originals/user-626x400-chair-dips-m1.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 2,
                instructions: "Sit on edge of sturdy chair, hands gripping edge. Lower and raise body using triceps, knees bent for easier variation.",
                targetMuscles: ["Triceps", "Shoulders"],
                tips: "Keep your back close to the chair and control the movement.",
                restTime: 60
            },
            { 
                name: "Diamond Push-ups (on knees)", 
                img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 3,
                instructions: "Form diamond shape with hands, perform push-ups on knees. This targets triceps intensely.",
                targetMuscles: ["Triceps", "Inner Chest"],
                tips: "Start slow and focus on perfect form. Progress to full push-ups when ready.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Standard Triceps Push-ups (Close Grip)", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3298_Pullovers_1200x628-facebook.jpg", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Perform standard push-ups with hands placed close together, emphasizing triceps activation.",
                targetMuscles: ["Triceps", "Chest", "Shoulders"],
                tips: "Keep elbows close to body and maintain straight line from head to heels.",
                restTime: 75
            },
            { 
                name: "Chair Dips (Straight Legs)", 
                img: "https://www.bodybuilding.com/images/2020/xdb/partials/user-626x400-chair-dips-m2.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 4,
                instructions: "Same as beginner dips but with legs straight, making it more challenging.",
                targetMuscles: ["Triceps", "Shoulders", "Core"],
                tips: "Extend legs straight out to increase difficulty and core engagement.",
                restTime: 90
            },
            { 
                name: "Diamond Push-ups", 
                img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Full diamond push-ups on toes. Form diamond with hands and perform controlled push-ups.",
                targetMuscles: ["Triceps", "Inner Chest", "Shoulders"],
                tips: "This is challenging - maintain perfect form over speed.",
                restTime: 90
            },
            { 
                name: "Pike Push-ups (Close Hand Position)", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Start in pike position with hands close together. Lower head toward hands focusing on triceps.",
                targetMuscles: ["Triceps", "Shoulders", "Upper Chest"],
                tips: "Keep hips high and focus on triceps rather than shoulders.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Decline Triceps Push-ups (Close Grip)", 
                img: "https://www.fitnessbaddies.com/wp-content/uploads/2021/05/Decline-Push-ups.png", 
                reps: "3 sets × 10-12 reps",
                difficulty: 5,
                instructions: "Elevate feet on chair/bed, perform close-grip push-ups for maximum triceps challenge.",
                targetMuscles: ["Triceps", "Upper Chest", "Shoulders"],
                tips: "The higher your feet, the harder it becomes. Start low and progress.",
                restTime: 120
            },
            { 
                name: "Weighted Chair Dips", 
                img: "https://www.bodybuilding.com/images/2020/xdb/partials/user-626x400-chair-dips-m3.gif", 
                reps: "3 sets × AMRAP",
                difficulty: 5,
                instructions: "Perform dips with additional weight (backpack, books, etc.) for increased resistance.",
                targetMuscles: ["Triceps", "Shoulders", "Core"],
                tips: "Add weight gradually and maintain perfect form. Safety first!",
                restTime: 120
            },
            { 
                name: "Explosive Diamond Push-ups", 
                img: "https://i.makeagif.com/media/10-13-2015/t-c2pD.gif", 
                reps: "3 sets × 6-8 reps",
                difficulty: 5,
                instructions: "Diamond push-ups with explosive upward movement, hands leaving ground if possible.",
                targetMuscles: ["Triceps", "Power", "Core"],
                tips: "Land softly and control the descent. Power and control combined.",
                restTime: 120
            },
            { 
                name: "Pseudo Planche Push-ups", 
                img: "https://bodyweighttrainingarena.com/wp-content/uploads/2013/06/Pseudo_Planche_Push_Up.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Lean forward significantly with hands by lower ribs. Extremely challenging triceps exercise.",
                targetMuscles: ["Triceps", "Shoulders", "Core"],
                tips: "Advanced exercise - start with small lean and build up gradually.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Machine Triceps Extensions", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/424.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Sit on machine, grip handles, extend arms straight down using triceps. Control both up and down.",
                targetMuscles: ["Triceps"],
                tips: "Keep your core tight and elbows stationary throughout the movement.",
                restTime: 75
            },
            { 
                name: "Cable Triceps Pushdowns (Straight Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/143.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Stand at cable machine, grip straight bar. Push down using triceps, control the return.",
                targetMuscles: ["Triceps"],
                tips: "Keep elbows at your sides and focus on squeezing triceps at bottom.",
                restTime: 75
            },
            { 
                name: "Overhead Cable Triceps Extensions (Rope)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/136.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Face away from cable, overhead grip on rope. Extend arms forward using triceps.",
                targetMuscles: ["Triceps", "Long Head"],
                tips: "Keep your elbows pointing forward and extend fully for maximum stretch.",
                restTime: 90
            },
            { 
                name: "Dumbbell Triceps Extensions (Seated, Two Arm)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/132.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Sit with one dumbbell held overhead. Lower behind head and extend back up using triceps.",
                targetMuscles: ["Triceps", "Long Head"],
                tips: "Control the weight and keep your elbows pointing forward throughout.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Cable Triceps Pushdowns (Rope Attachment)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/144.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Use rope attachment, split the rope at bottom for better triceps contraction and stretch.",
                targetMuscles: ["Triceps"],
                tips: "Split the rope at the bottom and squeeze your triceps hard.",
                restTime: 75
            },
            { 
                name: "Lying Dumbbell Triceps Extensions (Skullcrushers)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/134.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Lie on bench, hold dumbbells above chest. Lower toward forehead by bending elbows, extend back up.",
                targetMuscles: ["Triceps", "Long Head"],
                tips: "Keep elbows stationary and control the weight. Don't actually hit your skull!",
                restTime: 90
            },
            { 
                name: "Seated Overhead Dumbbell Extension (One Arm)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/131.gif", 
                reps: "3 sets × 10-12 reps each arm",
                difficulty: 4,
                instructions: "Sit holding one dumbbell overhead. Lower behind head and extend back up, one arm at a time.",
                targetMuscles: ["Triceps", "Core"],
                tips: "Support your working arm with the free hand for stability.",
                restTime: 75
            },
            { 
                name: "Parallel Bar Dips (Bodyweight)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/37.gif", 
                reps: "3 sets × 8-12 reps",
                difficulty: 4,
                instructions: "Use parallel bars or dip station. Lower body and push back up using triceps and chest.",
                targetMuscles: ["Triceps", "Lower Chest", "Shoulders"],
                tips: "Lean slightly forward for chest, keep upright for more triceps focus.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Heavy Cable Triceps Pushdowns", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/143.gif", 
                reps: "4 sets × 6-8 reps",
                difficulty: 5,
                instructions: "Use heavy weight for low reps. Focus on strength and power in the triceps contraction.",
                targetMuscles: ["Triceps"],
                tips: "Use proper form even with heavy weight. Control is key for safety.",
                restTime: 150
            },
            { 
                name: "Lying EZ Bar Triceps Extensions (Skullcrushers)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/135.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 5,
                instructions: "Use EZ curl bar for better wrist position. Lower to forehead and extend back up with control.",
                targetMuscles: ["Triceps", "Long Head"],
                tips: "The EZ bar is easier on wrists than straight bar. Focus on controlled movement.",
                restTime: 120
            },
            { 
                name: "Weighted Parallel Bar Dips", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/38.gif", 
                reps: "3 sets × 6-10 reps",
                difficulty: 5,
                instructions: "Add weight via belt or vest. Perform dips with additional resistance for strength building.",
                targetMuscles: ["Triceps", "Lower Chest", "Shoulders"],
                tips: "Start with small amounts of added weight and progress gradually.",
                restTime: 120
            },
            { 
                name: "Overhead Cable Triceps Extensions (Bar)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/137.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Face away from cable with bar attachment. Extend arms forward keeping elbows high.",
                targetMuscles: ["Triceps", "Long Head"],
                tips: "Keep your elbows high and forward throughout the movement.",
                restTime: 90
            },
            { 
                name: "Close Grip Bench Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/530.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 5,
                instructions: "Bench press with hands placed closer than shoulder-width to emphasize triceps over chest.",
                targetMuscles: ["Triceps", "Inner Chest", "Shoulders"],
                tips: "Keep elbows closer to body and focus on triceps pushing the weight.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Flex", description: "Complete your first triceps workout", icon: "💪", unlocked: false },
    { id: 2, name: "Arm Commander", description: "Complete 5 triceps workouts", icon: "🎖️", unlocked: false },
    { id: 3, name: "Steel Arms", description: "Complete 10 triceps workouts", icon: "🔩", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Triceps Master", description: "Complete 20 triceps workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Triceps = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('tricepsSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('tricepsWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('tricepsUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('tricepsTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastTricepsWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('tricepsSoundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('tricepsTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('tricepsWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('tricepsUserAchievements', userAchievements);
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
        const workout = tricepsWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        if (!tricepsWorkouts[workoutType]?.[lvl]?.length) {
            alert(`No ${lvl} triceps workouts available for ${workoutType}.`);
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
            setStorageItem("lastTricepsWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = tricepsWorkouts[workoutType]?.[level];
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

    const currentExercise = isRunning && workoutType && level && tricepsWorkouts[workoutType]?.[level]
        ? tricepsWorkouts[workoutType][level][currentIndex]
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
                        ? 'from-green-400 to-teal-600' 
                        : 'from-green-600 to-teal-800'
                } bg-clip-text text-transparent`}>
                    💪 Triceps Toner Pro
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
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
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
                }`}>📈 Your Triceps Progress</h3>
                
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">💪</div>
                        <div className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Ready to Build?</div>
                        <div className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Complete your first triceps workout to see statistics here!</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{stats.totalWorkouts}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Workouts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-500">{stats.totalTime}</div>
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
                    }`}>🏆 Triceps Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(achievement => (
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
                                        <div className="font-bold text-green-500">{formatTime(workout.duration)}</div>
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
                        ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30'
                        : 'bg-gradient-to-r from-green-100/70 to-teal-100/70 border-green-400/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>🎯 Last Triceps Workout</h3>
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
                {Object.keys(tricepsWorkouts).map((type) => (
                    <motion.button
                        key={type}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            workoutType === type
                                ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-lg transform scale-105'
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
                {Object.keys(tricepsWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = tricepsWorkouts[workoutType][lvl].length;
                    const workoutTime = tricepsWorkouts[workoutType][lvl]
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
                                    ? 'bg-gradient-to-br from-green-500 via-teal-600 to-emerald-700 hover:from-green-400 hover:via-teal-500 hover:to-emerald-600'
                                    : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 hover:from-indigo-400 hover:via-purple-500 hover:to-pink-600'
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
                <div className="bg-gradient-to-br from-green-900 to-teal-900 p-8 rounded-2xl text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl font-bold mb-4 text-green-400">{formatTime(restTimer)}</div>
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
                        Exercise {currentIndex + 1} of {tricepsWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (tricepsWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
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
                                    <span key={idx} className="bg-green-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">
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
                        className="mb-4 bg-green-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
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
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (tricepsWorkouts[workoutType]?.[level]?.length || 1) - 1
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
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"
            >
                <div className="text-center">
                    <div className="text-4xl mb-2">{newAchievement.icon}</div>
                    <div className="font-bold text-white mb-1">Achievement Unlocked!</div>
                    <div className="text-sm text-green-100">{newAchievement.name}</div>
                    <div className="text-xs text-green-200">{newAchievement.description}</div>
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
                    ? 'bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 text-white' 
                    : 'bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 text-gray-900'
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

export default Triceps;
