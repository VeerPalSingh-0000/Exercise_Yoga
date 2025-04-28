import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3"; // ADJUST PATH IF NEEDED

// --- Helper function to format time (seconds -> MM:SS) ---
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- Define Warm-up Exercises (using the general Chest template warmups) ---
const warmupExercises = [
    { name: "Neck Rolls", img: "https://flabfix.com/wp-content/uploads/2019/05/Neck-Rolls.gif", duration: "1 minute" },
    { name: "Shoulder Rolls (forward)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", duration: "30 seconds" },
    { name: "Shoulder Rolls (backward)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", duration: "30 seconds" },
    { name: "Cross-Body Shoulder Stretch(both hands)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/400x400_9_Stretches_to_Benefit_Your_Golf_Game_Shoulder_Swing_Stretch.gif", duration: "30 seconds each arm" },
    { name: "Overhead Triceps Stretch (both hands)", img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", duration: "30 seconds each arm" },
];

// --- Define Cooldown Stretches (using the general Chest template cooldowns, adjusted for shoulders) ---
const cooldownStretches = [
    { name: "Cooldown: Child's Pose", img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", duration: "30 seconds" },
    { name: "Cooldown: Cross-Body Shoulder Stretch", img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/3169_shoulder_stretch_1200x628-facebook.jpg", duration: "30 seconds each arm" },
    { name: "Cooldown: Triceps Stretch (also hits shoulder)", img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", duration: "30 seconds each arm" },
     { name: "Cooldown: Pec Minor Stretch (Doorway)", img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/04/Pec-minor-stretch-in-doorway.gif?fit=600%2C600&ssl=1", duration: "30 seconds each side" },
];

// --- Shoulder Workouts by Type (Home/Gym) and Level ---
const shoulderWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { name: "Pike Push-ups (Elevated Hands)", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", reps: "3 sets × 10-15 reps" },
            { name: "Wall Supported Handstand Hold", img: "https://i.pinimg.com/originals/c4/54/0b/c4540b4a13d7586f733138c05e50a199.gif", duration: "3 sets × 30-60 seconds" },
             { name: "Lean Forward Push-ups (targets front delt)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/927.gif", reps: "3 sets x 10-15 reps"},
            { name: "Rear Delt Flyes (Band or Towel)", img: "https://redefiningstrength.com/wp-content/uploads/2015/03/band-pull-apart.gif", reps: "3 sets × 15-20 reps" }, // Band pull-aparts are good for rear delts/upper back
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { name: "Pike Push-ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", reps: "3 sets × 10-12 reps" },
            { name: "Decline Pike Push-ups (feet elevated)", img: "https://static.strengthlevel.com/images/illustrations/decline-pike-push-up-1000x1000.jpg", reps: "3 sets × 8-10 reps" },
             { name: "Side Lateral Raises (light objects or resistance band)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", reps: "3 sets x 15-20 reps"},
            { name: "Face Pulls (Resistance Band)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", reps: "3 sets × 15-20 reps" },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { name: "Handstand Push-up Negatives (against wall)", img: "https://www.fitkill.com/wp-content/uploads/2020/07/Handstand-Pushup.gif", reps: "3 sets × 5-8 reps" },
            { name: "Pseudo Planche Push-ups", img: "https://bodyweighttrainingarena.com/wp-content/uploads/2013/06/Pseudo_Planche_Push_Up.gif", reps: "3 sets x 5-8 reps" },
             { name: "Assisted Handstand Push-ups (partial range)", img: "https://www.burnthefatinnercircle.com/members/1274.jpg", reps: "3 sets x 5-8 reps"},
            { name: "Single Arm Pike Push-ups (Assisted)", img: "https://www.fitkill.com/wp-content/uploads/2020/07/Assisted-One-Handstand-Pushup.gif", reps: "3 sets x 3-5 reps each side" },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
             ...warmupExercises,
            { name: "Seated Machine Shoulder Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/118.gif", reps: "3 sets × 12-15 reps" },
            { name: "Seated Dumbbell Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/116.gif", reps: "3 sets × 10-12 reps" },
            { name: "Dumbbell Side Lateral Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", reps: "3 sets × 12-15 reps" },
            { name: "Dumbbell Front Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/119.gif", reps: "3 sets × 12-15 reps" },
             ...cooldownStretches
        ],
        Intermediate: [
             ...warmupExercises,
            { name: "Standing Barbell Overhead Press (Lighter Weight)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/115.gif", reps: "3 sets × 8-10 reps" },
            { name: "Seated Dumbbell Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/116.gif", reps: "3 sets × 10-12 reps" },
            { name: "Cable Side Lateral Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/121.gif", reps: "3 sets × 12-15 reps" },
            { name: "Face Pulls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", reps: "3 sets × 15-20 reps" },
            { name: "Dumbbell Rear Delt Flyes (Bent-Over)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/122.gif", reps: "3 sets x 12-15 reps"},
             ...cooldownStretches
        ],
        Hard: [
             ...warmupExercises,
            { name: "Standing Barbell Overhead Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/115.gif", reps: "4 sets × 5-8 reps" },
            { name: "Arnold Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/117.gif", reps: "3 sets × 8-10 reps" },
            { name: "Cable Face Pulls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/883.gif", reps: "3 sets x 15-20 reps" },
            { name: "Heavy Dumbbell Lateral Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/120.gif", reps: "3 sets × 10-12 reps" },
             { name: "Landmine Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/1021.gif", reps: "3 sets x 8-10 reps each side"},
             ...cooldownStretches
        ],
    }
};


const Shoulder = () => { // Component name changed to Shoulder
    const [workoutType, setWorkoutType] = useState('Home'); // 'Home' or 'Gym'
    const [level, setLevel] = useState(null); // 'Beginner', 'Intermediate', 'Hard', or null
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    // --- Timer State ---
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(null);

    // --- Load Last Workout Info on Mount ---
    useEffect(() => {
        try {
            const savedInfo = localStorage.getItem("lastShoulderWorkout"); // Updated key
            if (savedInfo) {
                const parsedInfo = JSON.parse(savedInfo);
                 if (!parsedInfo.type) parsedInfo.type = 'Home';
                setLastWorkoutInfo(parsedInfo);
            }
        } catch (error) {
            console.error("Failed to load last shoulder workout info:", error); // Updated console log
            localStorage.removeItem("lastShoulderWorkout"); // Updated key
        }
    }, []);


    // --- Audio Effect ---
    useEffect(() => {
       audio.loop = true;
        if (isRunning && isSoundEnabled) {
            audio.play().catch(error => console.error("Playback failed:", error));
        } else {
            audio.pause();
        }
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [isRunning, isSoundEnabled, audio]);


    // --- Timer Effect ---
     useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
             if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
         return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]);


    const startWorkout = (lvl) => {
         // Prevent starting if the selected type/level has no exercises
         if (!shoulderWorkouts[workoutType]?.[lvl]?.length) { // Use shoulderWorkouts
             alert(`No ${lvl} Shoulder workouts available for ${workoutType}.`); // Updated alert
             return;
         }
        setLevel(lvl);
        setCurrentIndex(0);
        setTimer(0);
        setIsRunning(true);
        setLastWorkoutInfo(null); // Clear previous info display
    };

    const stopWorkout = (completed = false) => {
       if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
        const finalTime = timer;
        const completedLevel = level;
        const completedType = workoutType;

        setLevel(null); // Reset level first
        setCurrentIndex(0);
        setTimer(0); // Reset timer for next run


        if (completed && completedLevel && completedType) {
            const workoutData = {
                type: completedType,
                level: completedLevel,
                duration: finalTime,
                date: new Date().toISOString().split('T')[0]
            };
            try {
                 localStorage.setItem("lastShoulderWorkout", JSON.stringify(workoutData)); // Updated key
                setLastWorkoutInfo(workoutData);
                 alert(`${completedType} - ${completedLevel} Shoulder Workout Complete! 💪\nDuration: ${formatTime(finalTime)}`); // Updated alert
            } catch (error) {
                console.error("Failed to save shoulder workout data:", error); // Updated console log
                 alert(`${completedType} - ${completedLevel} Shoulder Workout Complete! 💪\nDuration: ${formatTime(finalTime)}\n(Could not save duration)`); // Updated alert
            }
        } else if (!completed && completedLevel) {
             alert("Shoulder workout stopped early."); // Updated alert
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = shoulderWorkouts[workoutType]?.[level]; // Use shoulderWorkouts
        if (currentWorkoutList && currentIndex < currentWorkoutList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (level && workoutType) { // Ensure workout was active and type/level selected
            stopWorkout(true);
        }
    };

     const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const currentExercise = isRunning && workoutType && level && shoulderWorkouts[workoutType]?.[level] // Use shoulderWorkouts
        ? shoulderWorkouts[workoutType][level][currentIndex]
        : null;

    // --- Framer Motion Variants (Copied directly from Chest template) ---
    const levelButtonContainerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.08 } }
    };
    const levelButtonVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
        tap: { scale: 0.95 }
    };
    const workoutCardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 } },
        exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } }
    };
    const nextButtonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.03 },
        tap: { scale: 0.97 }
    };
    const soundButtonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.9 }
    };
     const toggleButtonVariants = {
        initial: { opacity: 0.7, scale: 1 },
        animate: { opacity: 1, scale: 1.05 }, // Slightly larger when active
        hover: { scale: 1.08 }, // Slightly larger hover overall
        tap: { scale: 0.95 }
    };


    return (
        <motion.div
            // Apply Chest template background gradient
            className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    // Apply Chest template heading styles
                    className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    <span role="img" aria-label="shoulder">💪</span> Shoulder Sculptor {/* Updated title and emoji */}
                </motion.h1>

                {/* --- Display Last Workout Info --- */}
                {!isRunning && lastWorkoutInfo && (
                    <motion.div
                        // Apply Chest template info box styles
                        className="mb-8 bg-black bg-opacity-25 p-3 rounded-lg text-sm shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    >
                        {/* Updated info text */}
                        Last Shoulder Workout ({lastWorkoutInfo.date}): {lastWorkoutInfo.type} - {lastWorkoutInfo.level} - {formatTime(lastWorkoutInfo.duration)}
                    </motion.div>
                )}

                {/* --- Workout Type Toggle (Styled like Chest template) --- */}
                 {/* Only show if workout is not running and no level is selected */}
                {!isRunning && !level && (
                    <motion.div
                        className="flex justify-center gap-4 mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    >
                        {/* Use shoulderWorkouts keys (Home/Gym) for toggles */}
                        {Object.keys(shoulderWorkouts).map((type) => (
                            <motion.button
                                key={type}
                                variants={toggleButtonVariants}
                                initial="initial"
                                animate={workoutType === type ? "animate" : "initial"}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setWorkoutType(type)}
                                // Apply Chest template toggle button styling
                                className={`px-6 py-2.5 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 border-2 border-transparent ${
                                     workoutType === type
                                        ? 'bg-white text-indigo-700 scale-105 border-white' // Active style
                                        : 'bg-indigo-600 bg-opacity-60 text-white hover:bg-opacity-80 hover:border-indigo-400' // Inactive style
                                }`}
                            >
                                {type} {/* Display workout type (Home/Gym) */}
                            </motion.button>
                        ))}
                    </motion.div>
                )}


                {/* --- Level Selection (Styled like Chest template, uses workoutType) --- */}
                 {/* Only show if workout is not running AND workoutType is selected */}
                {!isRunning && workoutType && !level && (
                    <motion.div
                        // Apply Chest template level button container styles
                        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12"
                        variants={levelButtonContainerVariants}
                        initial="initial"
                        animate="animate"
                    >
                         {/* Map over levels for the currently selected workoutType */}
                        {Object.keys(shoulderWorkouts[workoutType]).map((lvl) => (
                            <motion.button
                                key={`${workoutType}-${lvl}`}
                                variants={levelButtonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                // Apply Chest template dynamic button gradient colors based on workoutType
                                className={`text-lg px-5 py-4 rounded-xl font-bold shadow-lg transition duration-300 w-full transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 ${
                                     workoutType === 'Home'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:ring-blue-500'
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:ring-orange-500' // Gym colors from Chest template
                                } text-white`}
                                onClick={() => startWorkout(lvl)}
                            >
                                {lvl} {/* Display level (Beginner/Intermediate/Hard) */}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* --- Workout Display (Styled like Chest template) --- */}
                {/* Only show if workout is running and currentExercise exists */}
                {isRunning && currentExercise && (
                    <motion.div
                        // Apply Chest template workout card styles
                        className="relative bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl text-center max-w-lg mx-auto"
                        variants={workoutCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                         key={`${workoutType}-${level}-${currentIndex}`} // Key includes type, level, index
                    >
                        {/* --- Live Timer --- */}
                        <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-4 py-1.5 rounded-full text-lg font-mono z-10 shadow-md">
                            ⏱️ {formatTime(timer)}
                        </div>

                        {/* --- Sound Toggle --- */}
                        <div className="absolute top-4 right-4 z-10">
                             <motion.button
                                variants={soundButtonVariants} whileHover="hover" whileTap="tap"
                                onClick={toggleSound}
                                // Apply Chest template sound button colors and styles
                                className={`p-2.5 rounded-full shadow-lg transition-colors ${isSoundEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-600 hover:bg-red-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${isSoundEnabled ? 'focus:ring-green-400' : 'focus:ring-red-500'}`}
                                aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                     {isSoundEnabled ? ( /* Speaker Wave Icon */ <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 10.858a2 2 0 112.828 2.828L6.343 16.343A2 2 0 113.515 13.515l2.343-2.657zM11 5.072A6 6 0 0117 11" /> )
                                     : ( /* Speaker X Mark Icon */ <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15.586a2 2 0 112.828 2.828L6.343 20.343A2 2 0 113.515 17.515l2.071-2.071m0 0a2 2 0 012.828 0L11 18.071m0-5.657a2 2 0 00-2.828 0L5.515 15.071m12.97-7.943a9 9 0 010 12.728M15 11a4 4 0 11-8 0 4 4 0 018 0z M21 12a9 9 0 11-18 0 9 9 0 0118 0zM15 12H9m12 0h-3m-4 4l-4-4m0 0l4-4m-4 4h12" /> )}
                                 </svg>
                             </motion.button>
                        </div>

                        {/* --- Exercise Info (Uses Shoulder data, styled like Chest template) --- */}
                        {/* Apply Chest template text color and size */}
                        <motion.h2 className="text-2xl md:text-2xl font-bold mt-12 mb-1 text-gray-100">{workoutType} - {level} Level</motion.h2> {/* Include workoutType */}
                         {/* Apply Chest template text color and margin */}
                        <p className="text-sm text-gray-400 mb-5">
                             {/* Use shoulderWorkouts data */}
                            Item {currentIndex + 1} of {shoulderWorkouts[workoutType]?.[level]?.length ?? 0}
                        </p>
                         {/* Apply Chest template margin */}
                        <motion.div className="flex flex-col items-center mb-8">
                             {/* Apply Chest template image container styles and keep Biceps image handling */}
                             <motion.div
                                className="h-56 md:h-64 w-full rounded-lg mb-5 bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 } }}
                             >
                                {currentExercise.img ? (
                                     <img
                                         src={currentExercise.img}
                                         alt={currentExercise.name}
                                         className="h-full w-full object-contain"
                                         onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-gray-500 italic">Image not available</span>'; }}
                                     />
                                 ) : (
                                     <span className="text-gray-500 italic">No Image Provided</span> // Keep placeholder text
                                 )}
                             </motion.div>
                             {/* Apply Chest template text color and size */}
                            <motion.h3 className="text-xl md:text-2xl font-semibold text-gray-100">{currentExercise.name}</motion.h3>
                             {/* Apply Chest template text color and margin */}
                            <motion.p className="text-lg text-yellow-400 mt-2 font-medium">{currentExercise.reps || currentExercise.duration}</motion.p>
                        </motion.div>

                        {/* --- Next Button (Styled like Chest template) --- */}
                        <motion.button
                            variants={nextButtonVariants} initial="initial" whileHover="hover" whileTap="tap"
                            // Apply Chest template next button gradient colors and styles
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-lg font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 w-full transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
                            onClick={nextExercise}
                        >
                             {/* Use shoulderWorkouts data for button text logic */}
                            {workoutType && level && shoulderWorkouts[workoutType]?.[level] && currentIndex === shoulderWorkouts[workoutType][level].length - 1
                                ? "Finish Workout 🎉"
                                : "Next Exercise →"}
                        </motion.button>

                        {/* --- Stop Button (Styled like Chest template) --- */}
                        <button
                            onClick={() => stopWorkout(false)}
                            // Apply Chest template stop button styles
                            className="mt-5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Stop Early
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Shoulder;