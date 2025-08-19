import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import motivationalSound from "../assets/sounds/workout_motivation.mp3";

// Warmup and strecthing
import JumpingJacks from "../assets/images/Warmup and stretch/jumping-jack.gif"
import Armforward from "../assets/images/Warmup and stretch/arm-circle-forward.gif"
import ArmReverse from "../assets/images/Warmup and stretch/Reverse-Arm-Circles.gif"
import DynamicStretch from "../assets/images/Warmup and stretch/dynamic-chest-stretch.gif"

import childPose from "../assets/images/Warmup and stretch/child-pose.jpg"
import cobraPose from "../assets/images/Warmup and stretch/cobra-pose.avif"
import catCowPose from "../assets/images/Warmup and stretch/cat-cow.webp"
import staticChest from "../assets/images/Warmup and stretch/static-chest-stretch.jpg"
import overheadTricep from "../assets/images/Warmup and stretch/tricep-stretch.jpg"

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
        name: "Warm-up: Dynamic Chest Stretch", 
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
    },
    { 
        name: "Cooldown: Static Chest Stretch (Doorway)", 
        img: staticChest, 
        duration: "30 seconds each side",
        difficulty: 2,
        instructions: "Place forearm on doorway, step forward to stretch chest. Switch arms.",
        targetMuscles: ["Chest", "Shoulders"],
        tips: "Don't force the stretch, hold comfortably for best results."
    },
    { 
        name: "Cooldown: Overhead Triceps Stretch", 
        img: overheadTricep, 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Reach one arm overhead, bend elbow, use other hand to gently pull elbow.",
        targetMuscles: ["Triceps", "Shoulders"],
        tips: "Keep your back straight and don't pull too hard."
    },
];

const chestWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Wall Push-ups", 
                img: "https://media0.giphy.com/media/oVRVhKRAnNTLME7BGt/200w.gif?cid=6c09b952i81ytlqwjmzqcavb0cvyserx5hrpzkvyddlkfi7t&ep=v1_gifs_search&rid=200w.gif&ct=g", 
                reps: "3 sets × 15 reps",
                difficulty: 1,
                instructions: "Stand arm's length from wall, place palms flat against wall, push body toward and away from wall.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Keep your body in a straight line and control the movement.",
                restTime: 45
            },
            { 
                name: "Incline Push-ups (on bed/sofa)", 
                img: "https://i.pinimg.com/originals/f0/ee/14/f0ee14842e9d923710082d106c2aba52.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 2,
                instructions: "Place hands on elevated surface, perform push-ups with feet on ground.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "The higher the surface, the easier the exercise.",
                restTime: 60
            },
            { 
                name: "Kneeling Push-ups", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/GRT-1.17.RegularChestPushupOnKnees.gif", 
                reps: "3 sets × 10 reps",
                difficulty: 2,
                instructions: "Perform push-ups on your knees instead of toes to reduce resistance.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Keep your thighs and torso in a straight line.",
                restTime: 60
            },
            { 
                name: "Chest Squeeze (Bodyweight)", 
                img: "https://media.gq.com/photos/5b75f05eb32f4e4b6699bba7/master/w_1600%2Cc_limit/Scruggs-Chest-GIF5-2.gif", 
                reps: "3 sets × 30 sec",
                difficulty: 2,
                instructions: "Press palms together in front of chest, squeeze and hold to activate chest muscles.",
                targetMuscles: ["Chest", "Shoulders"],
                tips: "Focus on really squeezing your chest muscles together.",
                restTime: 30
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Standard Push-Ups", 
                img: "https://i.pinimg.com/originals/fd/bb/09/fdbb092b58863e5c86fdb8bb1411fcea.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Full push-ups on toes, maintaining straight body line from head to heels.",
                targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
                tips: "Don't let your hips sag or pike up.",
                restTime: 60
            },
            { 
                name: "Wide Push-Ups", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2017/10/widegrippushup-1508248881.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Place hands wider than shoulder-width to target outer chest more.",
                targetMuscles: ["Chest", "Shoulders"],
                tips: "Don't go too wide as it can stress your shoulders.",
                restTime: 75
            },
            { 
                name: "Decline Push-Ups (feet on bed)", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/feetelevatedpushup-1457047025.gif", 
                reps: "3 sets × 10 reps",
                difficulty: 4,
                instructions: "Elevate feet on bed or chair to increase difficulty and target upper chest.",
                targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
                tips: "The higher your feet, the harder the exercise becomes.",
                restTime: 75
            },
            { 
                name: "Pike Push-Ups", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Start in downward dog position, lower head toward hands by bending elbows.",
                targetMuscles: ["Shoulders", "Upper Chest", "Triceps"],
                tips: "Focus on moving your head toward your hands, not down.",
                restTime: 75
            },
            { 
                name: "Push-Up to Plank Hold", 
                img: "https://hw.qld.gov.au/wp-content/uploads/2015/07/05_M_WIP03-Plank-push-up.gif", 
                reps: "3 rounds",
                difficulty: 4,
                instructions: "Perform a push-up, then hold plank position for 30 seconds.",
                targetMuscles: ["Chest", "Core", "Shoulders"],
                tips: "Maintain perfect plank form during the hold.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Decline Push-Ups (feet on chair)", 
                img: "https://media2.giphy.com/media/AY9lSKxSmkWEE/source.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Feet elevated higher than intermediate level for maximum difficulty.",
                targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
                tips: "Control the descent and explosive push up.",
                restTime: 90
            },
            { 
                name: "Diamond Push-Ups", 
                img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 5,
                instructions: "Form diamond shape with hands, focuses intensely on triceps and inner chest.",
                targetMuscles: ["Inner Chest", "Triceps", "Shoulders"],
                tips: "Keep elbows close to your body throughout the movement.",
                restTime: 90
            },
            { 
                name: "Explosive Push-Ups", 
                img: "https://64.media.tumblr.com/67c840e8945b2e4c36d9f45cc8e12d35/tumblr_ns0byc39Mq1re9gg7o1_1280.gif", 
                reps: "3 sets × 6-8 reps",
                difficulty: 5,
                instructions: "Push up explosively so hands leave the ground, land softly and repeat.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Land softly to protect your joints.",
                restTime: 120
            },
            { 
                name: "Time Under Tension Push-Ups", 
                img: "https://barbend.com/wp-content/uploads/2023/04/pause-pushup-barbend-movement-gif-masters.gif", 
                reps: "3 sets × 6-8 reps",
                difficulty: 5,
                instructions: "Lower for 4 seconds, pause for 2 seconds, then push up for 2 seconds.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Focus on control and maintaining tension throughout.",
                restTime: 120
            },
            { 
                name: "Archer Push-Ups", 
                img: "https://www.workedoutfitness.com/static/images/archer-push-up.gif", 
                reps: "3 sets × 5-8 reps each side",
                difficulty: 5,
                instructions: "Shift weight to one arm while extending the other, alternate sides.",
                targetMuscles: ["Chest", "Shoulders", "Core"],
                tips: "Start with small range of motion and build up.",
                restTime: 120
            },
            { 
                name: "Hindu Push-Ups", 
                img: "https://flabfix.com/wp-content/uploads/2019/06/Hindu-Push-Ups.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Fluid movement from downward dog to cobra pose and back.",
                targetMuscles: ["Chest", "Shoulders", "Back", "Core"],
                tips: "Focus on the flowing movement pattern.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Dumbbell Bench Press (Flat)", 
                img: "https://i.pinimg.com/originals/f4/72/94/f47294c0af7d4dc0e55b83a6ce56167b.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 2,
                instructions: "Lie on bench, press dumbbells up from chest level, lower with control.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Keep your feet planted and back slightly arched.",
                restTime: 90
            },
            { 
                name: "Machine Chest Press", 
                img: "https://149874912.v2.pressablecdn.com/wp-content/uploads/2020/03/machine-chest-press.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Seated chest press machine, push handles forward and return with control.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Adjust seat height so handles are at chest level.",
                restTime: 75
            },
            { 
                name: "Dumbbell Flyes (Flat)", 
                img: "https://i.pinimg.com/originals/71/a9/dc/71a9dc965c64d55454ee918bcdfd93fa.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Lie on bench, lower dumbbells in wide arc, squeeze chest to bring back up.",
                targetMuscles: ["Chest", "Shoulders"],
                tips: "Keep a slight bend in elbows throughout movement.",
                restTime: 75
            },
            { 
                name: "Push-ups (on knees or toes)", 
                img: "https://149874912.v2.pressablecdn.com/wp-content/uploads/2020/02/Kneeling-push-ups.gif", 
                reps: "3 sets × AMRAP",
                difficulty: 2,
                instructions: "Perform as many push-ups as possible with good form.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Stop when form breaks down, rest and continue.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Barbell Bench Press (Flat)", 
                img: "https://i.pinimg.com/originals/51/1f/75/511f758a1ef6d337f075b820c4cc49de.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Lie on bench, unrack barbell, lower to chest, press up explosively.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Keep shoulder blades pulled back and tight.",
                restTime: 120
            },
            { 
                name: "Incline Dumbbell Press", 
                img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Incline-Press.gif?fit=600%2C600&ssl=1", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "On incline bench, press dumbbells up from upper chest position.",
                targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
                tips: "Set incline between 30-45 degrees for optimal angle.",
                restTime: 90
            },
            { 
                name: "Cable Crossovers (Mid Pulley)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/1057.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Pull cables in arcing motion to meet in front of chest.",
                targetMuscles: ["Chest", "Shoulders"],
                tips: "Keep a slight forward lean and squeeze at the peak.",
                restTime: 75
            },
            { 
                name: "Dips (Assisted or Bodyweight)", 
                img: "https://i.pinimg.com/originals/e7/45/d6/e745d6fcd41963a8a6d36c4b66c009a9.gif", 
                reps: "3 sets × 8-12 reps",
                difficulty: 4,
                instructions: "Lower body by bending elbows, press back up to starting position.",
                targetMuscles: ["Lower Chest", "Triceps", "Shoulders"],
                tips: "Lean slightly forward to emphasize chest activation.",
                restTime: 90
            },
            { 
                name: "Decline Dumbbell Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/39.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "On decline bench, press dumbbells up from lower chest position.",
                targetMuscles: ["Lower Chest", "Shoulders", "Triceps"],
                tips: "Control the weight and don't bounce off your chest.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Heavy Barbell Bench Press", 
                img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2021/09/Close-grip-bench-press.gif?resize=600%2C600&ssl=1", 
                reps: "4 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Heavy barbell bench press with focus on strength and power.",
                targetMuscles: ["Chest", "Shoulders", "Triceps"],
                tips: "Use a spotter for safety with heavy weights.",
                restTime: 180
            },
            { 
                name: "Weighted Dips", 
                img: "https://burnfit.io/wp-content/uploads/2023/11/WEI_DIPS.gif", 
                reps: "3 sets × 6-10 reps",
                difficulty: 5,
                instructions: "Perform dips with additional weight attached via belt or vest.",
                targetMuscles: ["Lower Chest", "Triceps", "Shoulders"],
                tips: "Start with lighter weight and progress gradually.",
                restTime: 150
            },
            { 
                name: "Incline Barbell Press", 
                img: "https://i.pinimg.com/originals/4e/09/14/4e0914996800bcabb72a47953339faab.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Incline barbell press targeting upper chest development.",
                targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
                tips: "Use proper incline angle and controlled movement.",
                restTime: 120
            },
            { 
                name: "Low Cable Flyes", 
                img: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Low-Cable-Crossover.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 4,
                instructions: "Cable flyes from low position to target upper chest fibers.",
                targetMuscles: ["Upper Chest", "Shoulders"],
                tips: "Focus on the stretch and squeeze of chest muscles.",
                restTime: 90
            },
            { 
                name: "Decline Barbell Press", 
                img: "https://i.makeagif.com/media/10-08-2018/_cgaL0.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Decline barbell press for lower chest emphasis.",
                targetMuscles: ["Lower Chest", "Shoulders", "Triceps"],
                tips: "Secure your legs properly on decline bench.",
                restTime: 120
            },
            { 
                name: "Weighted Push-ups", 
                img: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Weighted-Push-up.gif", 
                reps: "3 sets × AMRAP",
                difficulty: 5,
                instructions: "Push-ups with weight plates on back for added resistance.",
                targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
                tips: "Have someone place and remove the weight safely.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first workout", icon: "🏃", unlocked: false },
    { id: 2, name: "Consistent", description: "Complete 5 workouts", icon: "💪", unlocked: false },
    { id: 3, name: "Dedicated", description: "Complete 10 workouts", icon: "🎯", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Chest Master", description: "Complete 20 chest workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Chest = () => {
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
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('workoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('userAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('theme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastChestWorkout', null));
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
        setStorageItem('workoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('userAchievements', userAchievements);
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
        const workout = chestWorkouts[workoutType]?.[level];
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
            setStorageItem("lastChestWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = chestWorkouts[workoutType]?.[level];
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


    const currentExercise = isRunning && workoutType && level && chestWorkouts[workoutType]?.[level]
        ? chestWorkouts[workoutType][level][currentIndex]
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
// ✅ NEW - Header adapts to theme changes
const renderHeader = () => (
    <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
    >
        <motion.h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className={`bg-gradient-to-r ${
                theme === 'dark' 
                    ? 'from-blue-400 to-purple-600' 
                    : 'from-blue-600 to-purple-800'
            } bg-clip-text text-transparent`}>
                💪 Chest Builder Pro
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


// ✅ NEW - Stats panel adapts to theme
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
            }`}>📈 Your Progress</h3>
            
            {workoutHistory.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">🏁</div>
                    <div className={`text-xl font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Ready to Start?</div>
                    <div className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Complete your first workout to see statistics here!</div>
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
                        <div className="text-2xl font-bold text-green-500">{stats.totalTime}</div>
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
                }`}>🏆 Achievements</h4>
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



// ✅ NEW - Last workout adapts to theme
const renderLastWorkout = () => {
    if (!lastWorkoutInfo || isRunning) return null;
    
    return (
        <motion.div
            variants={itemVariants}
            className={`mb-8 backdrop-blur-md p-4 rounded-xl border ${
                theme === 'dark'
                    ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30'
                    : 'bg-gradient-to-r from-green-100/70 to-blue-100/70 border-green-400/50'
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>🎯 Last Workout</h3>
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


// ✅ NEW - Workout type buttons adapt to theme
const renderWorkoutTypeToggle = () => {
    if (isRunning) return null;
    
    return (
        <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4 mb-10"
        >
            {Object.keys(chestWorkouts).map((type) => (
                <motion.button
                    key={type}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setWorkoutType(type)}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                        workoutType === type
                            ? theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg transform scale-105'
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
                {Object.keys(chestWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = chestWorkouts[workoutType][lvl].length;
                    const workoutTime = chestWorkouts[workoutType][lvl]
                        .filter(ex => ex.restTime)
                        .reduce((sum, ex) => sum + ex.restTime, 0) + (exerciseCount * 45); // Estimated time
                    
                    return (
                        <motion.button
                            key={`${workoutType}-${lvl}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startWorkout(lvl)}
                            className={`p-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:shadow-2xl ${
                                workoutType === 'Home'
                                    ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600'
                                    : 'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 hover:from-orange-400 hover:via-red-500 hover:to-pink-600'
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
                        Exercise {currentIndex + 1} of {chestWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (chestWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
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
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (chestWorkouts[workoutType]?.[level]?.length || 1) - 1
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
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white' 
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
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

export default Chest;
