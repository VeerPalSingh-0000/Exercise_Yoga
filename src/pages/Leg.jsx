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
    { 
        name: "Warm-up: Bodyweight Squats", 
        img: "https://hips.hearstapps.com/ghk.hmg-prod.s3.amazonaws.com/images/squat-1585330081.gif", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Stand with feet shoulder-width apart, lower into squat position keeping chest up and knees tracking over toes.",
        targetMuscles: ["Quads", "Glutes", "Hamstrings"],
        tips: "Perfect for warming up the legs and hips before training."
    },
    { 
        name: "Warm-up: Lunges (Alternating)", 
        img: "https://hips.hearstapps.com/ghk.hmg-prod.s3.amazonaws.com/images/how-to-do-a-lunge-1553612001.gif", 
        duration: "30 seconds",
        difficulty: 2,
        instructions: "Step forward into lunge position, alternate legs. Keep front knee over ankle and back leg straight.",
        targetMuscles: ["Quads", "Glutes", "Hip Flexors"],
        tips: "Great for activating hip flexors and preparing for single-leg movements."
    },
];

const cooldownStretches = [
    { 
        name: "Cooldown: Hamstring Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3824_Leg_Stretches_1200x628-facebook.jpg", 
        duration: "30 seconds each leg",
        difficulty: 1,
        instructions: "Sit with one leg extended, reach toward toes. Feel stretch in back of thigh.",
        targetMuscles: ["Hamstrings", "Calves"],
        tips: "Don't bounce - hold steady stretch and breathe deeply."
    },
    { 
        name: "Cooldown: Quad Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3824_Leg_Stretches_1200x628-facebook.jpg", 
        duration: "30 seconds each leg",
        difficulty: 1,
        instructions: "Stand on one leg, pull other foot toward glutes. Feel stretch in front of thigh.",
        targetMuscles: ["Quadriceps", "Hip Flexors"],
        tips: "Hold wall or chair for balance. Keep knees close together."
    },
    { 
        name: "Cooldown: Calf Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3824_Leg_Stretches_1200x628-facebook.jpg", 
        duration: "30 seconds each leg",
        difficulty: 1,
        instructions: "Step back into lunge, keep back leg straight and heel down. Feel stretch in calf muscle.",
        targetMuscles: ["Calves", "Achilles"],
        tips: "Press heel firmly into ground for deeper stretch."
    },
    { 
        name: "Cooldown: Hip Flexor Stretch", 
        img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3824_Leg_Stretches_1200x628-facebook.jpg", 
        duration: "30 seconds each side",
        difficulty: 2,
        instructions: "Kneel in lunge position, push hips forward to stretch front of hip.",
        targetMuscles: ["Hip Flexors", "Quads"],
        tips: "Essential after squats and lunges to maintain hip mobility."
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

const legWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Bodyweight Squats", 
                img: "https://hips.hearstapps.com/ghk.hmg-prod.s3.amazonaws.com/images/squat-1585330081.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 2,
                instructions: "Stand with feet shoulder-width apart. Lower hips back and down as if sitting in chair. Keep chest up and knees tracking over toes.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                tips: "Focus on sitting back with hips, not just bending knees forward.",
                restTime: 60
            },
            { 
                name: "Lunges (Alternating)", 
                img: "https://hips.hearstapps.com/ghk.hmg-prod.s3.amazonaws.com/images/how-to-do-a-lunge-1553612001.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 3,
                instructions: "Step forward into lunge position, lower back knee toward ground. Push through front heel to return to standing.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
                tips: "Keep front knee over ankle and torso upright throughout movement.",
                restTime: 75
            },
            { 
                name: "Glute Bridges", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.12.GluteBridge.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 2,
                instructions: "Lie on back with knees bent. Lift hips up by squeezing glutes. Lower with control.",
                targetMuscles: ["Glutes", "Hamstrings", "Core"],
                tips: "Squeeze glutes at top and avoid arching lower back excessively.",
                restTime: 60
            },
            { 
                name: "Calf Raises (Bodyweight)", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.8.StandingCalfRaise.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 1,
                instructions: "Stand tall, rise up onto toes by contracting calf muscles. Lower with control.",
                targetMuscles: ["Calves", "Achilles"],
                tips: "Hold onto wall for balance if needed. Focus on full range of motion.",
                restTime: 45
            },
            { 
                name: "Wall Sit", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.13.WallSit.gif", 
                reps: "3 sets × 30-60 seconds",
                difficulty: 3,
                instructions: "Lean back against wall, slide down until thighs parallel to ground. Hold position.",
                targetMuscles: ["Quadriceps", "Glutes", "Core"],
                tips: "Keep knees at 90 degrees and resist sliding down the wall.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Bulgarian Split Squats (Bodyweight)", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.4.BulgarianSplitSquat.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 4,
                instructions: "Rear foot elevated on chair or couch. Lower into lunge position on front leg. Push through front heel to return.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Stabilizers"],
                tips: "Most of weight should be on front leg. Use rear foot only for balance.",
                restTime: 90
            },
            { 
                name: "Pistol Squat (Assisted)", 
                img: "https://www.bodybuilding.com/images/2020/xdb/partials/user-626x400-assisted-pistol-squats-m1.gif", 
                reps: "3 sets × 8-10 reps per leg",
                difficulty: 5,
                instructions: "Single-leg squat with opposite leg extended forward. Use chair or wall for assistance.",
                targetMuscles: ["Quadriceps", "Glutes", "Core", "Balance"],
                tips: "Advanced exercise - use assistance until you build strength and balance.",
                restTime: 120
            },
            { 
                name: "Single Leg Glute Bridges", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.14.SingleLegGluteBridge.gif", 
                reps: "3 sets × 15 reps per leg",
                difficulty: 4,
                instructions: "Glute bridge with one leg extended. Lift hips using only one leg while keeping other leg straight.",
                targetMuscles: ["Glutes", "Hamstrings", "Core"],
                tips: "Keep hips level and avoid rotating during movement.",
                restTime: 75
            },
            { 
                name: "Skater Squats", 
                img: "https://www.bodybuilding.com/images/2020/xdb/originals/user-626x400-skater-squat-m1.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 4,
                instructions: "Single-leg squat with free leg behind and across the body. Touch toe behind supporting leg.",
                targetMuscles: ["Quadriceps", "Glutes", "Core", "Balance"],
                tips: "Focus on control and balance. Start with partial range of motion.",
                restTime: 90
            },
            { 
                name: "Standing Calf Raises (Elevated)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/240.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Stand on edge of step with heels hanging off. Rise up onto toes, then lower below step level.",
                targetMuscles: ["Calves", "Achilles"],
                tips: "Greater range of motion than floor version. Control the movement.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Pistol Squats (Unassisted)", 
                img: "https://www.bodybuilding.com/images/2020/xdb/originals/user-626x400-pistol-squats-m1.gif", 
                reps: "3 sets × 5-8 reps per leg",
                difficulty: 5,
                instructions: "Full single-leg squat without assistance. Lower until thigh parallel to ground, return to standing.",
                targetMuscles: ["Quadriceps", "Glutes", "Core", "Balance"],
                tips: "Elite bodyweight exercise. Master assisted version first.",
                restTime: 120
            },
            { 
                name: "Jump Squats", 
                img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/GRT-1.11.JumpSquat.gif", 
                reps: "3 sets × 10-15 reps",
                difficulty: 4,
                instructions: "Perform squat, then explode upward jumping as high as possible. Land softly and immediately into next rep.",
                targetMuscles: ["Quadriceps", "Glutes", "Calves", "Power"],
                tips: "Land softly to protect knees. Focus on explosive upward movement.",
                restTime: 90
            },
            { 
                name: "Single Leg Romanian Deadlifts (Bodyweight)", 
                img: "https://www.bodybuilding.com/images/2020/xdb/partials/user-626x400-bodyweight-single-leg-deadlift-m1.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 4,
                instructions: "Stand on one leg, hinge at hip and reach toward ground while lifting opposite leg behind you.",
                targetMuscles: ["Hamstrings", "Glutes", "Core", "Balance"],
                tips: "Keep back straight and focus on hip hinge movement.",
                restTime: 90
            },
            { 
                name: "Lateral Lunges", 
                img: "https://www.bodybuilding.com/images/2020/xdb/partials/user-626x400-bodyweight-side-lunge-m1.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 3,
                instructions: "Step out to side and sit back into lunge position. Push off to return to center.",
                targetMuscles: ["Quadriceps", "Glutes", "Adductors", "Abductors"],
                tips: "Great for lateral movement patterns. Keep chest up throughout.",
                restTime: 75
            },
            { 
                name: "Explosive Step-Ups", 
                img: "https://www.bodybuilding.com/images/2020/xdb/originals/user-626x400-plyo-step-ups-m1.gif", 
                reps: "3 sets × 8-10 reps per leg",
                difficulty: 5,
                instructions: "Step up explosively onto box or chair, drive knee up forcefully. Step down with control.",
                targetMuscles: ["Quadriceps", "Glutes", "Calves", "Power"],
                tips: "Use sturdy surface. Focus on explosive upward drive.",
                restTime: 120
            },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { 
                name: "Leg Press (Machine)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/397.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Sit on leg press machine, place feet shoulder-width apart. Press weight up, lower with control.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
                tips: "Great beginner exercise - machine provides stability and safety.",
                restTime: 90
            },
            { 
                name: "Goblet Squats (Dumbbell/Kettlebell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/396.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Hold dumbbell or kettlebell at chest level. Perform squat while keeping weight close to body.",
                targetMuscles: ["Quadriceps", "Glutes", "Core"],
                tips: "Weight helps with balance and teaches proper squat form.",
                restTime: 90
            },
            { 
                name: "Hamstring Curls (Machine, Seated/Lying)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/303.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Curl weight by bending knees, focus on squeezing hamstrings. Lower with control.",
                targetMuscles: ["Hamstrings"],
                tips: "Perfect isolation exercise for hamstrings. Adjust machine to fit your body.",
                restTime: 75
            },
            { 
                name: "Quad Extensions (Machine)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/304.gif", 
                reps: "3 sets × 12-15 reps",
                difficulty: 2,
                instructions: "Extend legs by straightening knees against resistance. Lower with control.",
                targetMuscles: ["Quadriceps"],
                tips: "Isolation exercise for quadriceps. Don't use excessive weight.",
                restTime: 75
            },
            { 
                name: "Seated Calf Raises (Machine)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/242.gif", 
                reps: "3 sets × 15-20 reps",
                difficulty: 2,
                instructions: "Sit with weight on thighs, rise up onto toes. Lower heels below starting position.",
                targetMuscles: ["Calves"],
                tips: "Full range of motion is key. Feel the stretch at bottom.",
                restTime: 60
            },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { 
                name: "Barbell Back Squats", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/11.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Barbell on upper back, squat down until thighs parallel to ground. Drive through heels to stand.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                tips: "King of leg exercises. Proper form is crucial - consider using a spotter.",
                restTime: 120
            },
            { 
                name: "Romanian Deadlifts (Barbell/Dumbbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/45.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 4,
                instructions: "Hip hinge movement, lower weight by pushing hips back. Feel stretch in hamstrings.",
                targetMuscles: ["Hamstrings", "Glutes", "Lower Back"],
                tips: "Focus on hip hinge, not knee bend. Keep weight close to body.",
                restTime: 90
            },
            { 
                name: "Walking Lunges (Dumbbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/42.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 3,
                instructions: "Hold dumbbells, step forward into lunge, bring back leg to meet front leg. Continue walking.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Stabilizers"],
                tips: "Great functional movement. Keep torso upright throughout.",
                restTime: 90
            },
            { 
                name: "Hack Squat (Machine)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/398.gif", 
                reps: "3 sets × 10-12 reps",
                difficulty: 3,
                instructions: "Stand on hack squat machine, lower weight by squatting down. Press through heels to return.",
                targetMuscles: ["Quadriceps", "Glutes"],
                tips: "Machine allows for heavier weight while maintaining safety.",
                restTime: 90
            },
            { 
                name: "Leg Press (Single Leg)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/400.gif", 
                reps: "3 sets × 10-12 reps per leg",
                difficulty: 4,
                instructions: "Single-leg leg press for unilateral strength and to address imbalances.",
                targetMuscles: ["Quadriceps", "Glutes", "Stabilizers"],
                tips: "Use lighter weight than bilateral version. Focus on control.",
                restTime: 90
            },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { 
                name: "Heavy Barbell Back Squats", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/11.gif", 
                reps: "4 sets × 5-8 reps",
                difficulty: 5,
                instructions: "Heavy squats focusing on strength development. Use proper warm-up and spotter.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                tips: "Advanced exercise. Proper form is critical with heavy weight.",
                restTime: 180
            },
            { 
                name: "Stiff-Leg Deadlifts (Barbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/48.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "More intense hamstring exercise with straighter legs throughout movement.",
                targetMuscles: ["Hamstrings", "Glutes", "Lower Back"],
                tips: "Feel deep stretch in hamstrings. Keep slight knee bend for safety.",
                restTime: 120
            },
            { 
                name: "Leg Press (Heavy)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/397.gif", 
                reps: "3 sets × 8-10 reps",
                difficulty: 4,
                instructions: "Heavy leg press for maximum strength development in safe environment.",
                targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
                tips: "Machine allows for very heavy weights. Control the descent.",
                restTime: 120
            },
            { 
                name: "Bulgarian Split Squats (Dumbbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/36.gif", 
                reps: "3 sets × 8-10 reps per leg",
                difficulty: 4,
                instructions: "Weighted Bulgarian split squats for advanced unilateral leg development.",
                targetMuscles: ["Quadriceps", "Glutes", "Stabilizers"],
                tips: "Challenging exercise even with light weight. Focus on front leg.",
                restTime: 90
            },
            { 
                name: "Hip Thrusts (Barbell)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/237.gif", 
                reps: "3 sets × 10-15 reps",
                difficulty: 4,
                instructions: "Upper back on bench, barbell across hips. Drive hips up by squeezing glutes.",
                targetMuscles: ["Glutes", "Hamstrings", "Core"],
                tips: "Excellent for glute development. Squeeze glutes hard at top.",
                restTime: 90
            },
            { 
                name: "Standing Calf Raises (Smith Machine)", 
                img: "https://cdn.jefit.com/assets/img/exercises/gifs/241.gif", 
                reps: "4 sets × 15-20 reps",
                difficulty: 3,
                instructions: "Heavy calf raises using Smith machine for additional resistance.",
                targetMuscles: ["Calves"],
                tips: "Full range of motion with heavy weight. Squeeze at top.",
                restTime: 75
            },
            ...cooldownStretches
        ],
    }
};

// ======================== ACHIEVEMENTS SYSTEM ========================
const achievements = [
    { id: 1, name: "First Step", description: "Complete your first leg workout", icon: "👟", unlocked: false },
    { id: 2, name: "Leg Day Warrior", description: "Complete 5 leg workouts", icon: "🦵", unlocked: false },
    { id: 3, name: "Tree Trunks", description: "Complete 10 leg workouts", icon: "🌳", unlocked: false },
    { id: 4, name: "Beast Mode", description: "Complete a Hard level workout", icon: "🦍", unlocked: false },
    { id: 5, name: "Iron Will", description: "Workout for 30+ minutes", icon: "⚡", unlocked: false },
    { id: 6, name: "Leg Master", description: "Complete 20 leg workouts", icon: "👑", unlocked: false },
];

// ======================== MAIN COMPONENT ========================
const Leg = () => {
    // ======================== STATE MANAGEMENT ========================
    const [workoutType, setWorkoutType] = useState('Home');
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => getStorageItem('legSoundEnabled', true));
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState(() => getStorageItem('legWorkoutHistory', []));
    const [userAchievements, setUserAchievements] = useState(() => getStorageItem('legUserAchievements', achievements));
    const [theme, setTheme] = useState(() => getStorageItem('legTheme', 'dark'));
    const [showStats, setShowStats] = useState(false);
    const [completedSets, setCompletedSets] = useState(0);
    const [totalSets, setTotalSets] = useState(0);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(() => getStorageItem('lastLegWorkout', null));
    const [newAchievement, setNewAchievement] = useState(null);

    const intervalRef = useRef(null);
    const restIntervalRef = useRef(null);

    // ======================== EFFECTS ========================
    useEffect(() => {
        setStorageItem('legSoundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    useEffect(() => {
        setStorageItem('legTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        setStorageItem('legWorkoutHistory', workoutHistory);
    }, [workoutHistory]);

    useEffect(() => {
        setStorageItem('legUserAchievements', userAchievements);
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
        const workout = legWorkouts[workoutType]?.[level];
        if (!workout) return 0;
        
        return workout.filter(exercise => exercise.reps && exercise.reps.includes('sets')).length;
    }, [workoutType, level]);

    // ======================== WORKOUT FUNCTIONS ========================
    const startWorkout = (lvl) => {
        if (!legWorkouts[workoutType]?.[lvl]?.length) {
            alert(`No ${lvl} leg workouts available for ${workoutType}.`);
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
            setStorageItem("lastLegWorkout", workoutData);
            
            checkAchievements(workoutData);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = legWorkouts[workoutType]?.[level];
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

    const currentExercise = isRunning && workoutType && level && legWorkouts[workoutType]?.[level]
        ? legWorkouts[workoutType][level][currentIndex]
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
                        ? 'from-emerald-400 to-green-600' 
                        : 'from-emerald-600 to-green-800'
                } bg-clip-text text-transparent`}>
                    🦵 Leg Crusher Pro
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
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
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
                }`}>📈 Your Leg Progress</h3>
                
                {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🦵</div>
                        <div className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Ready to Crush?</div>
                        <div className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Complete your first leg workout to see statistics here!</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-500">{stats.totalWorkouts}</div>
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
                            <div className="text-2xl font-bold text-lime-500">{stats.longestWorkout}</div>
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
                    }`}>🏆 Leg Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {userAchievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                                    achievement.unlocked 
                                        ? theme === 'dark'
                                            ? 'bg-emerald-600 bg-opacity-30 border-emerald-500'
                                            : 'bg-emerald-100 border-emerald-400'
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
                                        <div className="font-bold text-emerald-500">{formatTime(workout.duration)}</div>
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
                        ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-100/70 to-green-100/70 border-emerald-400/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>🎯 Last Leg Workout</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {lastWorkoutInfo.type} - {lastWorkoutInfo.level} • {formatTime(lastWorkoutInfo.duration)} • {lastWorkoutInfo.date}
                        </p>
                    </div>
                    <div className="text-2xl">🦵</div>
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
                {Object.keys(legWorkouts).map((type) => (
                    <motion.button
                        key={type}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setWorkoutType(type)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            workoutType === type
                                ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg transform scale-105'
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
                {Object.keys(legWorkouts[workoutType]).map((lvl) => {
                    const exerciseCount = legWorkouts[workoutType][lvl].length;
                    const workoutTime = legWorkouts[workoutType][lvl]
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
                                    ? 'bg-gradient-to-br from-emerald-500 via-green-600 to-lime-700 hover:from-emerald-400 hover:via-green-500 hover:to-lime-600'
                                    : 'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 hover:from-teal-400 hover:via-emerald-500 hover:to-green-600'
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
                <div className="bg-gradient-to-br from-emerald-900 to-green-900 p-8 rounded-2xl text-center max-w-sm mx-4">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl font-bold mb-4 text-emerald-400">{formatTime(restTimer)}</div>
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
                        Exercise {currentIndex + 1} of {legWorkouts[workoutType]?.[level]?.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                        <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${((currentIndex + 1) / (legWorkouts[workoutType]?.[level]?.length || 1)) * 100}%` 
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
                                    <span key={idx} className="bg-emerald-600 bg-opacity-30 px-3 py-1 rounded-full text-sm">
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
                        className="mb-4 bg-emerald-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
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
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 w-full"
                    >
                        {currentIndex === (legWorkouts[workoutType]?.[level]?.length || 1) - 1
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
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-xl shadow-2xl z-50 max-w-sm mx-4"
            >
                <div className="text-center">
                    <div className="text-4xl mb-2">{newAchievement.icon}</div>
                    <div className="font-bold text-white mb-1">Achievement Unlocked!</div>
                    <div className="text-sm text-emerald-100">{newAchievement.name}</div>
                    <div className="text-xs text-emerald-200">{newAchievement.description}</div>
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
                    ? 'bg-gradient-to-br from-gray-900 via-emerald-900 to-green-900 text-white' 
                    : 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 text-gray-900'
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

export default Leg;
