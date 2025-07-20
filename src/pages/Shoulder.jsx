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
        name: "Neck Rolls", 
        img: "https://flabfix.com/wp-content/uploads/2019/05/Neck-Rolls.gif", 
        duration: "1 minute",
        difficulty: 1,
        instructions: "Slowly roll neck in circular motion, both directions. Keep movements controlled and gentle.",
        targetMuscles: ["Neck", "Upper Traps"],
        tips: "Never force the movement. Stop if you feel any pain or dizziness."
    },
    { 
        name: "Shoulder Rolls (forward)", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Roll shoulders forward in smooth circular motion to warm up shoulder joints.",
        targetMuscles: ["Shoulders", "Upper Traps"],
        tips: "Make large, smooth circles. Focus on full range of motion."
    },
    { 
        name: "Shoulder Rolls (backward)", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", 
        duration: "30 seconds",
        difficulty: 1,
        instructions: "Roll shoulders backward in smooth circular motion to reverse the forward movement.",
        targetMuscles: ["Shoulders", "Upper Traps"],
        tips: "This helps counteract forward shoulder posture from daily activities."
    },
    { 
        name: "Cross-Body Shoulder Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/400x400_9_Stretches_to_Benefit_Your_Golf_Game_Shoulder_Swing_Stretch.gif", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Pull one arm across body at chest level, hold with opposite hand. Feel stretch in rear shoulder.",
        targetMuscles: ["Rear Delts", "Posterior Capsule"],
        tips: "Keep shoulders level and avoid rotating torso."
    },
    { 
        name: "Overhead Triceps Stretch", 
        img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Reach one arm overhead, bend elbow, use other hand to gently pull elbow back.",
        targetMuscles: ["Triceps", "Shoulders"],
        tips: "Also prepares shoulders for overhead movements in workout."
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
        name: "Cooldown: Cross-Body Shoulder Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3169_shoulder_stretch_1200x628-facebook.jpg", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Pull arm across body at chest level to stretch posterior shoulder muscles.",
        targetMuscles: ["Rear Delts", "Posterior Capsule"],
        tips: "Essential after shoulder workout to maintain flexibility."
    },
    { 
        name: "Cooldown: Triceps Stretch", 
        img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", 
        duration: "30 seconds each arm",
        difficulty: 1,
        instructions: "Overhead triceps stretch also helps stretch shoulder joint capsule.",
        targetMuscles: ["Triceps", "Shoulders"],
        tips: "Hold gentle tension and breathe deeply."
    },
    { 
        name: "Cooldown: Pec Minor Stretch (Doorway)", 
        img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/04/Pec-minor-stretch-in-doorway.gif?fit=600%2C600&ssl=1", 
        duration: "30 seconds each side",
        difficulty: 2,
        instructions: "Place forearm on doorway at shoulder height, step forward to stretch chest and front shoulder.",
        targetMuscles: ["Pec Minor", "Front Delts"],
        tips: "Helps counteract internal rotation after shoulder workout."
    },
];

const shoulderWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Pike Push-ups (Elevated Hands)", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", 
                reps: "3 sets × 10-15 reps",
                difficulty: 3,
                instructions: "Start in downward dog position with hands elevated. Lower head toward hands by bending elbows.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Elevated hands make this easier. Focus on shoulder movement, not triceps.",
                restTime: 75
            },
            { 
                name: "Wall Supported Handstand Hold", 
                img: "https://i.pinimg.com/originals/c4/54/0b/c4540b4a13d7586f733138c05e50a199.gif", 
                reps: "3 sets × 30-60 seconds",
                difficulty: 4,
                instructions: "Face away from wall, walk feet up while walking hands toward wall. Hold inverted position.",
                targetMuscles: ["Front Delts", "Side Delts", "Core"],
                tips: "Start with short holds. This builds shoulder stability and strength.",
                restTime: 90
            },
            { 
                name: "Lean Forward Push-ups", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/927.gif", 
                reps: "3 sets × 10-15 reps",
                difficulty: 3,
                instructions: "Perform push-ups with hands positioned forward of shoulders to target front delts more.",
                targetMuscles: ["Front Delts", "Chest", "Triceps"],
                tips: "Lean forward slightly to shift emphasis to shoulders.",
                restTime: 75
            },
            { 
                name: "Rear Delt Flyes (Band or Towel)", 
                img: "https://redefiningstrength.com/wp-content/uploads/2015/03/band-pull-apart.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 2,
                instructions: "Hold band or towel at chest level, pull apart by squeezing shoulder blades together.",
                targetMuscles: ["Rear Delts", "Middle Traps", "Rhomboids"],
                tips: "Focus on squeezing shoulder blades together, not just moving arms.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Pike Push-ups", 
                img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Full pike push-ups from floor level. Focus on shoulder strength and stability.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Keep hips high and move head toward hands, not down to ground.",
                restTime: 90
            },
            { 
                name: "Decline Pike Push-ups (feet elevated)", 
                img: "https://static.strengthlevel.com/images/illustrations/decline-pike-push-up-1000x1000.jpg", 
                reps: "3 sets × 8-10 reps",
                difficulty: 5,
                instructions: "Pike push-ups with feet elevated on chair or bed for increased difficulty.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "More challenging variation. Ensure you can do regular pike push-ups first.",
                restTime: 90
            },
            { 
                name: "Side Lateral Raises (light objects or resistance band)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Use water bottles, books, or resistance band. Raise arms to sides until parallel to ground.",
                targetMuscles: ["Side Delts", "Supraspinatus"],
                tips: "Light weight only. Focus on form and muscle activation.",
                restTime: 75
            },
            { 
                name: "Face Pulls (Resistance Band)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Pull resistance band to face level, separating handles at your ears.",
                targetMuscles: ["Rear Delts", "Middle Traps", "External Rotators"],
                tips: "Excellent for posture and rear delt development.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Handstand Push-up Negatives (against wall)", 
                img: "https://www.fitkill.com/wp-content/uploads/2020/07/Handstand-Pushup.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Jump or kick up to handstand position, slowly lower to head touching ground.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Extremely advanced. Master wall handstand holds first.",
                restTime: 120
            },
            { 
                name: "Pseudo Planche Push-ups", 
                img: "https://bodyweighttrainingarena.com/wp-content/uploads/2013/06/Pseudo_Planche_Push_Up.gif", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Lean forward significantly with hands by lower ribs. Perform push-ups in this position.",
                targetMuscles: ["Front Delts", "Core", "Triceps"],
                tips: "Start with small lean. This is extremely challenging for shoulders.",
                restTime: 120
            },
            { 
                name: "Assisted Handstand Push-ups", 
                img: "https://www.burnthefatinnercircle.com/members/1274.jpg", 
                reps: "3 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Partial range handstand push-ups with assistance or limited range of motion.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Use assistance to complete the movement. Progress gradually.",
                restTime: 120
            },
            { 
                name: "Single Arm Pike Push-ups (Assisted)", 
                img: "https://www.fitkill.com/wp-content/uploads/2020/07/Assisted-One-Handstand-Pushup.gif", 
                reps: "3 sets × 3-5 reps each side",
                difficulty: 5,
                instructions: "One-arm pike push-ups with assistance from other hand on elevated surface.",
                targetMuscles: ["Front Delts", "Core", "Stabilizers"],
                tips: "Elite level exercise. Master regular pike push-ups first.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Seated Machine Shoulder Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/118.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Sit at shoulder press machine, press handles overhead with controlled movement.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Machine provides stability - perfect for beginners to learn movement pattern.",
                restTime: 90
            },
            { 
                name: "Seated Dumbbell Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/116.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Sit on bench with back support, press dumbbells overhead from shoulder level.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Start light to learn proper path of motion. Keep core tight.",
                restTime: 90
            },
            { 
                name: "Dumbbell Side Lateral Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Stand with dumbbells at sides, raise arms to parallel with slight bend in elbows.",
                targetMuscles: ["Side Delts", "Supraspinatus"],
                tips: "Light weight only. Lead with pinkies, stop at shoulder height.",
                restTime: 75
            },
            { 
                name: "Dumbbell Front Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/119.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Raise dumbbells in front of body to shoulder height with straight or slightly bent arms.",
                targetMuscles: ["Front Delts", "Upper Chest"],
                tips: "Use lighter weight than you think. Focus on control and form.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Standing Barbell Overhead Press (Lighter Weight)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/115.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Stand with barbell at shoulder level, press overhead while maintaining tight core.",
                targetMuscles: ["Front Delts", "Side Delts", "Core"],
                tips: "Start lighter than you think. This exercise requires significant stability.",
                restTime: 120
            },
            { 
                name: "Seated Dumbbell Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/116.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Seated dumbbell press with heavier weight than beginner level.",
                targetMuscles: ["Front Delts", "Side Delts", "Triceps"],
                tips: "Focus on full range of motion and controlled tempo.",
                restTime: 90
            },
            { 
                name: "Cable Side Lateral Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/121.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Use cable machine for lateral raises to provide constant tension throughout movement.",
                targetMuscles: ["Side Delts"],
                tips: "Cable provides better tension curve than dumbbells.",
                restTime: 75
            },
            { 
                name: "Face Pulls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Pull cable rope to face level, separate handles at ears.",
                targetMuscles: ["Rear Delts", "Middle Traps", "External Rotators"],
                tips: "Essential for shoulder health and posture correction.",
                restTime: 75
            },
            { 
                name: "Dumbbell Rear Delt Flyes (Bent-Over)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/122.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 3,
                instructions: "Bend over at hips, raise dumbbells to sides by squeezing shoulder blades together.",
                targetMuscles: ["Rear Delts", "Middle Traps"],
                tips: "Light weight, focus on squeezing shoulder blades together.",
                restTime: 75
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Standing Barbell Overhead Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/115.gif", 
                reps: "4 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Heavy standing overhead press focusing on strength and power development.",
                targetMuscles: ["Front Delts", "Side Delts", "Core"],
                tips: "Master form before adding weight. Use proper warm-up progression.",
                restTime: 150
            },
            { 
                name: "Arnold Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/117.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Start with palms facing you, rotate to palms forward while pressing overhead.",
                targetMuscles: ["Front Delts", "Side Delts", "Rear Delts"],
                tips: "Unique exercise that hits all three heads of deltoid.",
                restTime: 90
            },
            { 
                name: "Cable Face Pulls", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Heavy cable face pulls for rear delt development and shoulder health.",
                targetMuscles: ["Rear Delts", "Middle Traps"],
                tips: "Never skip these - crucial for balanced shoulder development.",
                restTime: 75
            },
            { 
                name: "Heavy Dumbbell Lateral Raises", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Lateral raises with heavier weight for advanced trainees.",
                targetMuscles: ["Side Delts"],
                tips: "Still focus on form over weight. Side delts are small muscles.",
                restTime: 90
            },
            { 
                name: "Landmine Press", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/1021.gif", 
                reps: "3 sets × 8-10 reps each side",
                difficulty: 4,
                instructions: "Press landmine barbell overhead in arc motion, one arm at a time.",
                targetMuscles: ["Front Delts", "Core", "Serratus"],
                tips: "Great for athletes. Mimics many real-world movement patterns.",
                restTime: 90
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Lift", description: "Complete your first shoulder workout", icon: "🏋️", unlocked: false },
    { id: 2, name: "Shoulder Soldier", description: "Complete 5 shoulder workouts", icon: "🎖️", unlocked: false },
    { id: 3, name: "Boulder Shoulders", description: "Complete 10 shoulder workouts", icon: "🗿", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Shoulder King", description: "Complete 20 shoulder workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Shoulder = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('shoulderSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('shoulderWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('shoulderUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('shoulderTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastShoulderWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('shoulderSoundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('shoulderTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('shoulderWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('shoulderUserAchievements', userAchievements);
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
        const workout = shoulderWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        if (!shoulderWorkouts[workoutType]?.[lvl]?.length) {
            alert(`No ${lvl} shoulder workouts available for ${workoutType}.`);
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
            setStorageItem("lastShoulderWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = shoulderWorkouts[workoutType]?.[level];
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

    const currentExercise = isRunning && workoutType && level && shoulderWorkouts[workoutType]?.[level]
        ? shoulderWorkouts[workoutType][level][currentIndex]
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
                        ? 'from-yellow-400 to-orange-600' 
                        : 'from-yellow-600 to-orange-800'
                } bg-clip-text text-transparent`}>
                    🏋️ Shoulder Sculptor Pro
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
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
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
                }`}>📈 Your Shoulder Progress</h3>
                
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🏋️</div>
                        <div className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Ready to Lift?</div>
                        <div className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Complete your first shoulder workout to see statistics here!</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.totalWorkouts}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Workouts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">{stats.totalTime}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-500">{stats.avgTime}</div>
                            <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Average Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{stats.longestWorkout}</div>
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
                    }`}>🏆 Shoulder Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                                    achievement.unlocked 
                                        ? theme === 'dark'
                                            ? 'bg-yellow-600 bg-opacity-30 border-yellow-500'
                                            : 'bg-yellow-100 border-yellow-400'
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
                                        <div className="font-bold text-yellow-500">{formatTime(workout.duration)}</div>
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
                        ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30'
                        : 'bg-gradient-to-r from-yellow-100/70 to-orange-100/70 border-yellow-400/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        }`}>🎯 Last Shoulder Workout</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {lastWorkoutInfo.type} - {lastWorkoutInfo.level} • {formatTime(lastWorkoutInfo.duration)} • {lastWorkoutInfo.date}
                        </p>
                    </div>
                    <div className="text-2xl">🏋️</div>
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
                {Object.keys(shoulderWorkouts).map((type) => (
                    <motion.button
                        key={type}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            workoutType === type
                                ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gradient-to-r from-yellow-600 to-orange-700 text-white shadow-lg transform scale-105'
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
                {Object.keys(shoulderWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = shoulderWorkouts[workoutType][lvl].length;
                    const workoutTime = shoulderWorkouts[workoutType][lvl]
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
                                    ? 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 hover:from-yellow-400 hover:via-orange-500 hover:to-red-600'
                                    : 'bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-700 hover:from-amber-400 hover:via-yellow-500 hover:to-orange-600'
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
                <div className="bg-gradient-to-br from-yellow-900 to-orange-900 p-8 rounded-2xl text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl font-bold mb-4 text-yellow-400">{formatTime(restTimer)}</div>
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
                        Exercise {currentIndex + 1} of {shoulderWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (shoulderWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
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
                                    <span key={idx} className="bg-yellow-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">
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
                        className="mb-4 bg-yellow-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
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
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (shoulderWorkouts[workoutType]?.[level]?.length || 1) - 1
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
                    ? 'bg-gradient-to-br from-gray-900 via-yellow-900 to-orange-900 text-white' 
                    : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 text-gray-900'
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

export default Shoulder;
