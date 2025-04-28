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
    { name: "Warm-up: Dynamic Chest Stretch", img: "https://cdn.jefit.com/assets/img/exercises/gifs/846.gif", duration: "30 seconds" },
    { name: "Warm-up: Torso Twists", img: "https://cdn.jefit.com/assets/img/exercises/gifs/677.gif", duration: "30 seconds" },
];

// --- Define Cooldown Stretches ---
const cooldownStretches = [
    { name: "Cooldown: Child's Pose", img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", duration: "30 seconds" },
    { name: "Cooldown: Cobra Stretch", img: "https://cdn.yogajournal.com/wp-content/uploads/2022/06/Upward-Facing-Dog-Mod-1_Andrew-Clark-e1670972827524-1024x598.jpg?width=1200", duration: "30 seconds" },
    { name: "Cooldown: Cat-Cow Stretch", img: "https://www.yogajournal.com/wp-content/uploads/2020/01/cat-cow-1.gif?width=730", duration: "1 minute" },
    { name: "Cooldown: Static Chest Stretch (Doorway)", img: "https://images.squarespace-cdn.com/content/v1/5f5e8592d2b0854b18af6975/bf602891-d983-47a2-bab2-d2e1719b5ffd/Doorway+Chest+Stretch.jpg", duration: "30 seconds each side" },
    { name: "Cooldown: Overhead Triceps Stretch", img: "https://i.ytimg.com/vi/zzvDO56B0HE/maxresdefault.jpg", duration: "30 seconds each arm" },
];

// --- Structure workouts by Type (Home/Gym) ---
const chestWorkouts = {
    Home: {
        Beginner: [
            ...warmupExercises,
            { name: "Wall Push-ups", img: "https://media0.giphy.com/media/oVRVhKRAnNTLME7BGt/200w.gif?cid=6c09b952i81ytlqwjmzqcavb0cvyserx5hrpzkvyddlkfi7t&ep=v1_gifs_search&rid=200w.gif&ct=g", reps: "3 sets × 15 reps" },
            { name: "Incline Push-ups (on bed/sofa)", img: "https://i.pinimg.com/originals/f0/ee/14/f0ee14842e9d923710082d106c2aba52.gif", reps: "3 sets × 10-12 reps" },
            { name: "Kneeling Push-ups", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/GRT-1.17.RegularChestPushupOnKnees.gif", reps: "3 sets × 10 reps" },
            { name: "Chest Squeeze (Bodyweight)", img: "https://media.gq.com/photos/5b75f05eb32f4e4b6699bba7/master/w_1600%2Cc_limit/Scruggs-Chest-GIF5-2.gif", reps: "3 sets × 30 sec" },
            ...cooldownStretches
        ],
        Intermediate: [
             ...warmupExercises,
             { name: "Standard Push-Ups", img: "https://i.pinimg.com/originals/fd/bb/09/fdbb092b58863e5c86fdb8bb1411fcea.gif", reps: "3 sets × 12-15 reps" },
             { name: "Wide Push-Ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2017/10/widegrippushup-1508248881.gif", reps: "3 sets × 10-12 reps" },
             { name: "Decline Push-Ups (feet on bed)", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/feetelevatedpushup-1457047025.gif", reps: "3 sets × 10 reps" },
             { name: "Pike Push-Ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", reps: "3 sets × 8-10 reps" },
             { name: "Push-Up to Plank Hold (30 sec hold)", img: "https://hw.qld.gov.au/wp-content/uploads/2015/07/05_M_WIP03-Plank-push-up.gif", reps: "3 rounds" },
             ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { name: "Decline Push-Ups (feet on chair)", img: "https://media2.giphy.com/media/AY9lSKxSmkWEE/source.gif", reps: "3 sets × 10-12 reps" },
            { name: "Diamond Push-Ups", img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif", reps: "3 sets × 8-10 reps" },
            { name: "Explosive Push-Ups (clap or pop off ground)", img: "https://64.media.tumblr.com/67c840e8945b2e4c36d9f45cc8e12d35/tumblr_ns0byc39Mq1re9gg7o1_1280.gif", reps: "3 sets × 6-8 reps" },
            { name: "Time Under Tension Push-Ups", img: "https://barbend.com/wp-content/uploads/2023/04/pause-pushup-barbend-movement-gif-masters.gif", reps: "3 sets × 6-8 reps (4 sec down + 2 sec hold)" },
            { name: "Archer Push-Ups", img: "https://www.workedoutfitness.com/static/images/archer-push-up.gif", reps: "3 sets × 5-8 reps each side" },
            { name: "Hindu Push-Ups", img: "https://flabfix.com/wp-content/uploads/2019/06/Hindu-Push-Ups.gif", reps: "3 sets × 5-8 reps each side" },
             ...cooldownStretches
        ],
    },
    Gym: {
        Beginner: [
            ...warmupExercises,
            { name: "Dumbbell Bench Press (Flat)", img: " https://i.pinimg.com/originals/f4/72/94/f47294c0af7d4dc0e55b83a6ce56167b.gif", reps: "3 sets × 10-12 reps" },
            { name: "Machine Chest Press", img: "https://149874912.v2.pressablecdn.com/wp-content/uploads/2020/03/machine-chest-press.gif", reps: "3 sets × 12-15 reps" },
            { name: "Dumbbell Flyes (Flat)", img: "https://i.pinimg.com/originals/71/a9/dc/71a9dc965c64d55454ee918bcdfd93fa.gif", reps: "3 sets × 12-15 reps" },
            { name: "Push-ups (on knees or toes)", img: "https://149874912.v2.pressablecdn.com/wp-content/uploads/2020/02/Kneeling-push-ups.gif", reps: "3 sets × AMRAP (As Many Reps As Possible)" },
            ...cooldownStretches
        ],
        Intermediate: [
            ...warmupExercises,
            { name: "Barbell Bench Press (Flat)", img: "https://i.pinimg.com/originals/51/1f/75/511f758a1ef6d337f075b820c4cc49de.gif", reps: "3 sets × 8-10 reps" },
            { name: "Incline Dumbbell Press", img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Incline-Press.gif?fit=600%2C600&ssl=1", reps: "3 sets × 10-12 reps" },
            { name: "Cable Crossovers (Mid Pulley)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/1057.gif", reps: "3 sets × 12-15 reps" },
            { name: "Dips (Assisted or Bodyweight)", img: "https://i.pinimg.com/originals/e7/45/d6/e745d6fcd41963a8a6d36c4b66c009a9.gif", reps: "3 sets × 8-12 reps" },
            { name: "Decline Dumbbell Press", img: "https://cdn.jefit.com/assets/img/exercises/gifs/39.gif", reps: "3 sets × 10-12 reps" },
            ...cooldownStretches
        ],
        Hard: [
            ...warmupExercises,
            { name: "Heavy Barbell Bench Press", img: "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2021/09/Close-grip-bench-press.gif?resize=600%2C600&ssl=1", reps: "4 sets × 5-8 reps" },
            { name: "Weighted Dips", img: "https://burnfit.io/wp-content/uploads/2023/11/WEI_DIPS.gif", reps: "3 sets × 6-10 reps" },
            { name: "Incline Barbell Press", img: "https://i.pinimg.com/originals/4e/09/14/4e0914996800bcabb72a47953339faab.gif", reps: "3 sets × 8-10 reps" },
            { name: "Low Cable Flyes", img: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Low-Cable-Crossover.gif", reps: "3 sets × 12-15 reps" },
            { name: "Decline Barbell Press", img: "https://i.makeagif.com/media/10-08-2018/_cgaL0.gif", reps: "3 sets × 8-10 reps" },
            { name: "Push-ups (Weighted or Advanced Variation)", img: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Weighted-Push-up.gif", reps: "3 sets × AMRAP" },
            ...cooldownStretches
        ],
    }
};


const Chest = () => {
    const [workoutType, setWorkoutType] = useState('Home'); // 'Home' or 'Gym'
    const [level, setLevel] = useState(null); // 'Beginner', 'Intermediate', 'Hard', or null
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(null);

    // --- Load Last Workout Info ---
    useEffect(() => {
        try {
            const savedInfo = localStorage.getItem("lastChestWorkout");
            if (savedInfo) {
                const parsedInfo = JSON.parse(savedInfo);
                if (!parsedInfo.type) parsedInfo.type = 'Home'; // Handle old format
                setLastWorkoutInfo(parsedInfo);
            }
        } catch (error) {
            console.error("Failed to load last workout info:", error);
            localStorage.removeItem("lastChestWorkout");
        }
    }, []);

    // --- Audio Effect ---
    useEffect(() => {
        audio.loop = true;
        if (isRunning && isSoundEnabled) {
            audio.play().catch(error => console.error("Playback failed:", error));
        } else {
            audio.pause();
            // Optional: Reset playback position when paused
            // audio.currentTime = 0;
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
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const startWorkout = (lvl) => {
        setLevel(lvl);
        setCurrentIndex(0);
        setTimer(0);
        setIsRunning(true);
        setLastWorkoutInfo(null); // Clear previous info display
    };

    const stopWorkout = (completed = false) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);

        const finalTime = timer;
        const completedLevel = level;
        const completedType = workoutType;

        // Important: Reset level *after* capturing it
        setLevel(null);
        // Do NOT reset workoutType, keep the user's selection
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
                localStorage.setItem("lastChestWorkout", JSON.stringify(workoutData));
                setLastWorkoutInfo(workoutData); // Update display info
                alert(`${completedType} - ${completedLevel} Workout Complete! 💪\nDuration: ${formatTime(finalTime)}`);
            } catch (error) {
                console.error("Failed to save workout data:", error);
                alert(`${completedType} - ${completedLevel} Workout Complete! 💪\nDuration: ${formatTime(finalTime)}\n(Could not save info)`);
            }
        } else if (!completed && completedLevel) {
            alert("Workout stopped early.");
            // Optionally clear or keep lastWorkoutInfo if stopped early
            // setLastWorkoutInfo(null);
        }
    };

    const nextExercise = () => {
        const currentWorkoutList = chestWorkouts[workoutType]?.[level];
        if (currentWorkoutList && currentIndex < currentWorkoutList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (level) { // Ensure workout was active
            stopWorkout(true); // Mark as completed
        }
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const currentExercise = isRunning && workoutType && level && chestWorkouts[workoutType]?.[level]
        ? chestWorkouts[workoutType][level][currentIndex]
        : null;

    // --- Framer Motion Variants (Keep existing definitions or customize) ---
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
            // Slightly softer gradient background
            className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight" // Increased bottom margin
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    <span role="img" aria-label="muscle">💪</span> Chest Builder
                </motion.h1>

                {/* --- Display Last Workout Info --- */}
                {!isRunning && lastWorkoutInfo && (
                    <motion.div
                        className="mb-8 bg-black bg-opacity-25 p-3 rounded-lg text-sm shadow" // Increased bottom margin
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    >
                        Last Chest Workout ({lastWorkoutInfo.date}): {lastWorkoutInfo.type} - {lastWorkoutInfo.level} - {formatTime(lastWorkoutInfo.duration)}
                    </motion.div>
                )}

                {/* --- Workout Type Toggle --- */}
                {!isRunning && (
                    <motion.div
                        className="flex justify-center gap-4 mb-10" // Increased bottom margin
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    >
                        {Object.keys(chestWorkouts).map((type) => (
                            <motion.button
                                key={type}
                                variants={toggleButtonVariants}
                                initial="initial"
                                animate={workoutType === type ? "animate" : "initial"}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setWorkoutType(type)}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 border-2 border-transparent ${ // Added border for structure
                                    workoutType === type
                                        ? 'bg-white text-indigo-700 scale-105 border-white' // Active style
                                        : 'bg-indigo-600 bg-opacity-60 text-white hover:bg-opacity-80 hover:border-indigo-400' // Inactive style
                                }`}
                            >
                                {type}
                            </motion.button>
                        ))}
                    </motion.div>
                )}


                {/* --- Level Selection (uses workoutType with dynamic colors) --- */}
                {!isRunning && workoutType && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12" // Increased gap and bottom margin
                        variants={levelButtonContainerVariants}
                        initial="initial"
                        animate="animate"
                    >
                        {Object.keys(chestWorkouts[workoutType]).map((lvl) => (
                            <motion.button
                                key={`${workoutType}-${lvl}`}
                                variants={levelButtonVariants} // Apply animation to individual buttons
                                // Removed whileHover/Tap from individual to use variant's definition
                                className={`text-lg px-5 py-4 rounded-xl font-bold shadow-lg transition duration-300 w-full transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 ${ // Added focus styles
                                    workoutType === 'Home'
                                        // Home: Blue/Cyan Gradient
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:ring-blue-500'
                                        // Gym: Orange/Yellow Gradient
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:ring-orange-500'
                                } text-white`} // Common text color
                                onClick={() => startWorkout(lvl)}
                            >
                                {lvl}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* --- Workout Display --- */}
                {isRunning && currentExercise && (
                    <motion.div
                        // Improved contrast and padding
                        className="relative bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl text-center max-w-lg mx-auto"
                        variants={workoutCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={`${workoutType}-${level}-${currentIndex}`}
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
                                 className={`p-2.5 rounded-full shadow-lg transition-colors ${isSoundEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-600 hover:bg-red-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${isSoundEnabled ? 'focus:ring-green-400' : 'focus:ring-red-500'}`}
                                 aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      {isSoundEnabled ? ( /* Speaker Wave Icon */ <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 10.858a2 2 0 112.828 2.828L6.343 16.343A2 2 0 113.515 13.515l2.343-2.657zM11 5.072A6 6 0 0117 11" /> )
                                      : ( /* Speaker X Mark Icon */ <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15.586a2 2 0 112.828 2.828L6.343 20.343A2 2 0 113.515 17.515l2.071-2.071m0 0a2 2 0 012.828 0L11 18.071m0-5.657a2 2 0 00-2.828 0L5.515 15.071m12.97-7.943a9 9 0 010 12.728M15 11a4 4 0 11-8 0 4 4 0 018 0z M21 12a9 9 0 11-18 0 9 9 0 0118 0zM15 12H9m12 0h-3m-4 4l-4-4m0 0l4-4m-4 4h12" /> )}
                                 </svg>
                             </motion.button>
                        </div>

                        {/* --- Exercise Info --- */}
                        <motion.h2 className="text-2xl font-bold mt-12 mb-1 text-gray-100">{workoutType} - {level} Level</motion.h2>
                        <p className="text-sm text-gray-400 mb-5">
                            Item {currentIndex + 1} of {chestWorkouts[workoutType]?.[level]?.length ?? 0}
                        </p>
                        <motion.div className="flex flex-col items-center mb-8">
                             {/* Image with better placeholder styling */}
                             <motion.div
                                className="h-56 md:h-64 w-full rounded-lg mb-5 bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 } }}
                              >
                                {currentExercise.img ? (
                                    <img
                                        src={currentExercise.img}
                                        alt={currentExercise.name}
                                        className="h-full w-full object-contain" // Changed object-cover to object-contain
                                        // Basic error handling (could replace with placeholder image)
                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-gray-500">Image not available</span>'; }}
                                    />
                                ) : (
                                    <span className="text-gray-500 italic">No Image Provided</span>
                                )}
                            </motion.div>
                            <motion.h3 className="text-xl md:text-2xl font-semibold text-gray-100">{currentExercise.name}</motion.h3>
                            <motion.p className="text-lg text-yellow-400 mt-2 font-medium">{currentExercise.reps || currentExercise.duration}</motion.p>
                        </motion.div>

                        {/* --- Next Button --- */}
                        <motion.button
                            variants={nextButtonVariants} initial="initial" whileHover="hover" whileTap="tap"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl px-8 py-4 rounded-lg font-bold shadow-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 w-full transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
                            onClick={nextExercise}
                        >
                            {workoutType && level && chestWorkouts[workoutType]?.[level] && currentIndex === chestWorkouts[workoutType][level].length - 1
                                ? "Finish Workout 🎉"
                                : "Next Exercise →"}
                        </motion.button>

                        {/* --- Stop Button --- */}
                        <button
                            onClick={() => stopWorkout(false)}
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

export default Chest;