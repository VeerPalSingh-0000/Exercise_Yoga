import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3"; // ADJUST PATH IF NEEDED

// --- Helper function to format time (seconds -> MM:SS) ---
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- Define Warm-up Exercises ---
const warmupExercises = [
    { name: "Warm-up: Jumping Jacks", img: "https://cdn.fitimg.in/content_blog_inner_E4B1CDF6.gif", duration: "60 seconds" },
    { name: "Warm-up: Arm Circles (Forward)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/867.gif", duration: "30 seconds" },
    { name: "Warm-up: Arm Circles (Backward)", img: "https://flabfix.com/wp-content/uploads/2019/08/Reverse-Arm-Circles.gif", duration: "30 seconds" },
    { name: "Warm-up: Wrist Curls (Light/No Weight)", img: "https://www.verywellfit.com/thmb/ToOlI6kmhRUNeGqDbvo3tVJK-fQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/wristcurl-1056698feeaa4cf88a7586827ad70895.gif", duration: "30 seconds" },
];

// --- Define Cooldown Stretches ---
const cooldownStretches = [
    { name: "Cooldown: Bicep Wall Stretch", img: "https://post.healthline.com/wp-content/uploads/2019/06/Wall-bicep-stretch-.gif", duration: "30 seconds each arm" },
    { name: "Cooldown: Wrist Extensor Stretch", img: "https://www.spotebi.com/wp-content/uploads/2015/04/wrist-stretch-exercise-illustration.gif", duration: "30 seconds each wrist" },
    { name: "Cooldown: Overhead Triceps Stretch (indirectly stretches bicep)", img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", duration: "30 seconds each arm" },
    { name: "Cooldown: Child's Pose", img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", duration: "30 seconds" },
];

// --- Combine Warm-ups, Main Exercises, and Cooldowns for Biceps ---
// Includes both Home (Bodyweight) and Gym sections.
const bicepsWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { name: "Isometric Bicep Contraction (against wall/other hand)", img: "https://www.inspireusafoundation.org/wp-content/uploads/2023/04/wall-push-ups.gif", reps: "3 sets × 15-20 sec hold each arm" },
            { name: "Towel Bicep Curls (provide resistance yourself)", img: "https://cdn.shopify.com/s/files/1/0618/9462/3460/files/StandingBicepCurl.gif", reps: "3 sets × 12-15 reps" },
            { name: "Door Frame Rows (Underhand Grip)", img: "https://www.nerdfitness.com/wp-content/uploads/2020/04/doorway-row.gif", reps: "3 sets × 10-12 reps" },
            { name: "Wall Pulls / Scapular Retraction", img: "https://i.pinimg.com/originals/82/77/25/827725c8e3653c95be7a09d0611523c2.gif", reps: "3 sets × 15 reps" }, // Engages back but assists
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { name: "Chin-Up Negatives (if bar available)", img: "https://i.pinimg.com/originals/82/77/25/827725c8e3653c95be7a09d0611523c2.gif", reps: "3 sets × 5-8 reps" },
            { name: "Inverted Rows (Underhand Grip, feet elevated)", img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/03/inverted-row-with-underhand-grip-new.gif?fit=600%2C600&ssl=1", reps: "3 sets × 8-12 reps" },
            { name: "Bodyweight Hammer Curls (using towel tension)", img: "https://i.pinimg.com/originals/fe/0a/85/fe0a853605de67a2b6bc33ce1e4ad8a8.gif", reps: "3 sets × 10-12 reps" },
            { name: "Concentration Curls (Isometric against leg)", img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Concentration-curl.gif?fit=600%2C600&ssl=1", reps: "3 sets × 10-15 sec hold each arm" },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { name: "Chin-Ups (if bar available)", img: "https://www.verywellfit.com/thmb/MfbjgOZJaqecnhZSvKl8H2YLfvs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/67-3120735-Pullups-GIF-b08bf524e15c4bb2a70c7fc43e1fe9c0.gif", reps: "3 sets × AMRAP" },
            { name: "Towel Hang (Underhand Grip)", img: "https://barbend.com/wp-content/uploads/2023/12/towel-pullup-barbend-movement-gif-masters.gif", reps: "3 sets × Max Hold Time" },
            { name: "One-Arm Door Frame Rows (Underhand)", img: "https://i.makeagif.com/media/8-26-2015/yPAHwb.gif", reps: "3 sets × 8-10 reps each side" },
            { name: "Pelican Curls (using rings/suspension trainer if available)", img: "https://bodyweighttrainingarena.com/wp-content/uploads/2020/08/Pelican-Curls-Low-Bicep-exercises.gif", reps: "3 sets x 6-10 reps"},
            { name: "Commando Pull-Ups (alternating grip)", img: "https://dl.beigi.fit/harakat/Lats-muscles/Alt-commando-pullup.gif", reps: "3 sets x 6-10 reps total" },
            ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
             ...warmupExercises,
            { name: "Machine Bicep Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/123.gif", reps: "3 sets × 12-15 reps" },
            { name: "Seated Dumbbell Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/102.gif", reps: "3 sets × 10-12 reps" },
            { name: "Seated Dumbbell Hammer Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/98.gif", reps: "3 sets × 12-15 reps" },
            { name: "Standing Cable Curls (EZ Bar)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/114.gif", reps: "3 sets × 12-15 reps" },
             ...cooldownStretches
        ],
        Intermediate: [
             ...warmupExercises,
            { name: "Standing Barbell Curls (EZ Bar)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/100.gif", reps: "3 sets × 8-10 reps" },
            { name: "Incline Dumbbell Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/104.gif", reps: "3 sets × 10-12 reps" },
            { name: "Cable Hammer Curls (Rope)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/106.gif", reps: "3 sets × 12-15 reps" },
            { name: "Concentration Curls (Dumbbell)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/103.gif", reps: "3 sets × 10-12 reps" },
             ...cooldownStretches
        ],
        Hard: [
             ...warmupExercises,
            { name: "Standing Barbell Curls (Straight Bar)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/99.gif", reps: "4 sets × 6-8 reps" },
            { name: "Preacher Curls (EZ Bar)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/101.gif", reps: "3 sets × 8-10 reps" },
            { name: "High Cable Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/110.gif", reps: "3 sets × 12-15 reps" },
             // Added Weighted Chin-Ups as they are often used in gyms for bicep/back
            { name: "Weighted Chin-Ups", img: "https://cdn.jefit.com/assets/img/exercises/gifs/229.gif", reps: "3 sets × 5-8 reps" },
             { name: "Reverse Barbell Curls", img: "https://cdn.jefit.com/assets/img/exercises/gifs/109.gif", reps: "3 sets x 10-12 reps"}, // Good for brachialis/forearm
             ...cooldownStretches
        ],
    }
};


const Biceps = () => {
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
            const savedInfo = localStorage.getItem("lastBicepsWorkout"); // Keep Biceps specific key
            if (savedInfo) {
                const parsedInfo = JSON.parse(savedInfo);
                 // Add type handling for display, default to Home if not present (for compatibility)
                if (!parsedInfo.type) parsedInfo.type = 'Home';
                setLastWorkoutInfo(parsedInfo);
            }
        } catch (error) {
            console.error("Failed to load last biceps workout info:", error);
            localStorage.removeItem("lastBicepsWorkout"); // Keep Biceps specific key
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
         if (!bicepsWorkouts[workoutType]?.[lvl]?.length) {
             alert(`No ${lvl} Biceps workouts available for ${workoutType}.`);
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
        const completedType = workoutType; // Capture workout type

        setLevel(null); // Reset level first
        setCurrentIndex(0);
        setTimer(0); // Reset timer for next run


        if (completed && completedLevel && completedType) {
            const workoutData = {
                type: completedType, // Save workout type
                level: completedLevel,
                duration: finalTime,
                date: new Date().toISOString().split('T')[0]
            };
            try {
                 // Keep Biceps specific localStorage key
                localStorage.setItem("lastBicepsWorkout", JSON.stringify(workoutData));
                setLastWorkoutInfo(workoutData);
                 // Keep Biceps specific alert text, include type
                alert(`${completedType} - ${completedLevel} Biceps Workout Complete! 💪\nDuration: ${formatTime(finalTime)}`);
            } catch (error) {
                console.error("Failed to save biceps workout data:", error);
                 // Keep Biceps specific alert text
                alert(`${completedType} - ${completedLevel} Biceps Workout Complete! 💪\nDuration: ${formatTime(finalTime)}\n(Could not save duration)`);
            }
        } else if (!completed && completedLevel) {
             // Keep Biceps specific alert text
             alert("Biceps workout stopped early.");
        }
    };

    const nextExercise = () => {
        // Use the combined bicepsWorkouts data
        const currentWorkoutList = bicepsWorkouts[workoutType]?.[level];
        if (currentWorkoutList && currentIndex < currentWorkoutList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (level && workoutType) { // Ensure workout was active and type/level selected
            stopWorkout(true);
        }
    };

     const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    // Use the combined bicepsWorkouts data
    const currentExercise = isRunning && workoutType && level && bicepsWorkouts[workoutType]?.[level]
        ? bicepsWorkouts[workoutType][level][currentIndex]
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
                    <span role="img" aria-label="bicep flex">💪</span> Biceps Builder {/* Changed title slightly to be more general */}
                </motion.h1>

                {/* --- Display Last Workout Info --- */}
                {!isRunning && lastWorkoutInfo && (
                    <motion.div
                        // Apply Chest template info box styles
                        className="mb-8 bg-black bg-opacity-25 p-3 rounded-lg text-sm shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    >
                        {/* Keep Biceps info text, handle type display */}
                        Last Biceps Workout ({lastWorkoutInfo.date}): {lastWorkoutInfo.type} - {lastWorkoutInfo.level} - {formatTime(lastWorkoutInfo.duration)}
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
                        {/* Use bicepsWorkouts keys (Home/Gym) for toggles */}
                        {Object.keys(bicepsWorkouts).map((type) => (
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
                        {Object.keys(bicepsWorkouts[workoutType]).map((lvl) => (
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
                            ⏱️ {formatTime(timer)} {/* Keep timer */}
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

                        {/* --- Exercise Info (Uses Biceps data, styled like Chest template) --- */}
                        {/* Apply Chest template text color and size */}
                        <motion.h2 className="text-2xl md:text-2xl font-bold mt-12 mb-1 text-gray-100">{workoutType} - {level} Level</motion.h2> {/* Include workoutType */}
                         {/* Apply Chest template text color and margin */}
                        <p className="text-sm text-gray-400 mb-5">
                             {/* Use combined bicepsWorkouts data */}
                            Item {currentIndex + 1} of {bicepsWorkouts[workoutType]?.[level]?.length ?? 0}
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
                                         src={currentExercise.img} // Use Biceps img src
                                         alt={currentExercise.name} // Use Biceps exercise name
                                         className="h-full w-full object-contain"
                                         onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-gray-500 italic">Image not available</span>'; }}
                                     />
                                 ) : (
                                     <span className="text-gray-500 italic">No Image Provided</span> // Keep placeholder text
                                 )}
                             </motion.div>
                             {/* Apply Chest template text color and size */}
                            <motion.h3 className="text-xl md:text-2xl font-semibold text-gray-100">{currentExercise.name}</motion.h3> {/* Use Biceps exercise name */}
                             {/* Apply Chest template text color and margin */}
                            <motion.p className="text-lg text-yellow-400 mt-2 font-medium">{currentExercise.reps || currentExercise.duration}</motion.p> {/* Use Biceps reps/duration */}
                        </motion.div>

                        {/* --- Next Button (Styled like Chest template) --- */}
                        <motion.button
                            variants={nextButtonVariants} initial="initial" whileHover="hover" whileTap="tap"
                            // Apply Chest template next button gradient colors and styles
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-lg font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 w-full transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
                            onClick={nextExercise}
                        >
                             {/* Use combined bicepsWorkouts data for button text logic */}
                            {workoutType && level && bicepsWorkouts[workoutType]?.[level] && currentIndex === bicepsWorkouts[workoutType][level].length - 1
                                ? "Finish Workout 🎉" // Apply Chest template finish text
                                : "Next Exercise →"} {/* Apply Chest template next text */}
                        </motion.button>

                        {/* --- Stop Button (Styled like Chest template) --- */}
                        <button
                            onClick={() => stopWorkout(false)}
                            // Apply Chest template stop button styles
                            className="mt-5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Stop Early {/* Apply Chest template stop text */}
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Biceps;