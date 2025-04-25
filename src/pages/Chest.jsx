import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3";

// --- Helper function to format time (seconds -> MM:SS) ---
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const homeChestWorkouts = {
    // ... (keep your existing workout definitions) ...
    Beginner: [
        { name: "Wall Push-ups", img: "https://media0.giphy.com/media/oVRVhKRAnNTLME7BGt/200w.gif?cid=6c09b952i81ytlqwjmzqcavb0cvyserx5hrpzkvyddlkfi7t&ep=v1_gifs_search&rid=200w.gif&ct=g", reps: "3 sets × 15 reps" },
        { name: "Incline Push-ups (on bed/sofa)", img: "https://i.pinimg.com/originals/f0/ee/14/f0ee14842e9d923710082d106c2aba52.gif", reps: "3 sets × 10-12 reps" },
        { name: "Kneeling Push-ups", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/GRT-1.17.RegularChestPushupOnKnees.gif", reps: "3 sets × 10 reps" },
        { name: "Chest Squeeze (Bodyweight)", img: "https://media.gq.com/photos/5b75f05eb32f4e4b6699bba7/master/w_1600%2Cc_limit/Scruggs-Chest-GIF5-2.gif", reps: "3 sets × 30 sec" },
        { name: "Arm Circles (forward & backward)", img: "https://flabfix.com/wp-content/uploads/2019/08/Reverse-Arm-Circles.gif", reps: "3 sets × 30 sec each direction" },
    ],
    "Rest & Stretching": [
        { name: "Child's Pose", img: "https://media.post.rvohealth.io/wp-content/uploads/2018/07/Childs-Pose-Balasana.gif", duration: "30 seconds" },
        { name: "Cobra Stretch", img: "https://cdn.yogajournal.com/wp-content/uploads/2022/06/Upward-Facing-Dog-Mod-1_Andrew-Clark-e1670972827524-1024x598.jpg?width=1200", duration: "30 seconds" },
        { name: "Cat-Cow Stretch", img: "https://www.yogajournal.com/wp-content/uploads/2020/01/cat-cow-1.gif?width=730", duration: "1 minute" },
        { name: "Arm Stretches", img: "https://artimg.gympik.com/articles/wp-content/uploads/2019/03/BronzeVigilantKillifish-size_restricted.gif", duration: "30 seconds each arm" },
        { name: "Chest Opener", img: "https://cdn.jefit.com/assets/img/exercises/gifs/846.gif", duration: "30 seconds" },
    ],
    Intermediate: [
        { name: "Standard Push-Ups", img: "https://i.pinimg.com/originals/fd/bb/09/fdbb092b58863e5c86fdb8bb1411fcea.gif", reps: "3 sets × 12-15 reps" },
        { name: "Wide Push-Ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2017/10/widegrippushup-1508248881.gif", reps: "3 sets × 10-12 reps" },
        { name: "Incline Push-Ups (feet on bed)", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/feetelevatedpushup-1457047025.gif", reps: "3 sets × 10 reps" },
        { name: "Pike Push-Ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif?resize=640:*", reps: "3 sets × 8-10 reps" },
        { name: "Push-Up to Plank Hold (30 sec hold)", img: "https://hw.qld.gov.au/wp-content/uploads/2015/07/05_M_WIP03-Plank-push-up.gif", reps: "3 rounds" },
    ],
    Hard: [
        { name: "Decline Push-Ups (feet on chair)", img: "https://media2.giphy.com/media/AY9lSKxSmkWEE/source.gif", reps: "3 sets × 10-12 reps" },
        { name: "Diamond Push-Ups", img: "https://images.ctfassets.net/6ilvqec50fal/3hTY3FIEwYdNloN5V3HL7G/26e28de169b01e5e79332e5418803470/Diamond_Push-Up_GIF.gif", reps: "3 sets × 8-10 reps" },
        { name: "Explosive Push-Ups (clap or pop off ground)", img: "https://64.media.tumblr.com/67c840e8945b2e4c36d9f45cc8e12d35/tumblr_ns0byc39Mq1re9gg7o1_1280.gif", reps: "3 sets × 6-8 reps" },
        { name: "Time Under Tension Push-Ups", img: "https://barbend.com/wp-content/uploads/2023/04/pause-pushup-barbend-movement-gif-masters.gif", reps: "3 sets × 6-8 reps (4 sec down + 2 sec hold)" },
        { name: "Archer Push-Ups", img: "https://www.workedoutfitness.com/static/images/archer-push-up.gif", reps: "3 sets × 5-8 reps each side" },
        { name: "Hindu Push-Ups", img: "https://flabfix.com/wp-content/uploads/2019/06/Hindu-Push-Ups.gif", reps: "3 sets × 5-8 reps each side" },
    ],
};


const Chest = () => {
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    // --- Timer State ---
    const [timer, setTimer] = useState(0); // Elapsed time in seconds
    const intervalRef = useRef(null); // To hold the interval ID
    const [lastWorkoutInfo, setLastWorkoutInfo] = useState(null); // To display last saved time

    // --- Load Last Workout Info on Mount ---
    useEffect(() => {
        try {
            const savedInfo = localStorage.getItem("lastChestWorkout");
            if (savedInfo) {
                setLastWorkoutInfo(JSON.parse(savedInfo));
            }
        } catch (error) {
            console.error("Failed to load last workout info:", error);
            localStorage.removeItem("lastChestWorkout"); // Clear corrupted data
        }
    }, []);


    // --- Audio Effect ---
    useEffect(() => {
        audio.loop = true;
        if (isRunning && isSoundEnabled) {
            audio.play().catch(error => console.error("Playback failed:", error));
        } else {
            audio.pause();
            // Don't reset currentTime here if you want pause/resume audio with timer
        }

        // Cleanup audio on component unmount
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [isRunning, isSoundEnabled, audio]);


    // --- Timer Effect ---
    useEffect(() => {
        if (isRunning) {
            // Start the timer interval
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
            // Clear interval if it exists
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup interval on component unmount or when isRunning changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]); // Dependency array includes isRunning


    const startWorkout = (lvl) => {
        setLevel(lvl);
        setCurrentIndex(0);
        setTimer(0); // Reset timer
        setIsRunning(true); // Start running state (triggers timer useEffect)
        setLastWorkoutInfo(null); // Clear last workout info display
    };

    const stopWorkout = (completed = false) => {
         if (intervalRef.current) { // Ensure interval is cleared
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
         setIsRunning(false); // Stop running state
         setLevel(null); // Reset level to go back to selection
         setCurrentIndex(0);
         // Reset timer display, actual value saved below if completed
         const finalTime = timer; // Capture final time *before* resetting state
         setTimer(0);

        if (completed && level) {
            const workoutData = {
                level: level,
                duration: finalTime,
                date: new Date().toISOString().split('T')[0] // Just the date YYYY-MM-DD
            };
            try {
                localStorage.setItem("lastChestWorkout", JSON.stringify(workoutData));
                setLastWorkoutInfo(workoutData); // Update state to display immediately
                 alert(`${level} Workout Complete! 💪\nDuration: ${formatTime(finalTime)}`);
            } catch (error) {
                 console.error("Failed to save workout data:", error);
                 alert(`${level} Workout Complete! 💪\nDuration: ${formatTime(finalTime)}\n(Could not save duration)`);
            }

        } else {
            // Handle cases where workout might be stopped manually later (if you add a stop button)
             alert("Workout stopped.");
        }
    };


    const nextExercise = () => {
        if (level && currentIndex < homeChestWorkouts[level].length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (level) {
             // Last exercise finished, stop the workout and mark as completed
             stopWorkout(true);
        }
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

     // Treat Rest & Stretching like a regular workout level
    const handleRestAndStretch = () => {
        startWorkout("Rest & Stretching");
    };

    const currentExercise = isRunning && level ? homeChestWorkouts[level][currentIndex] : null;

    // --- Framer Motion Variants (keep as they were) ---
    const levelButtonVariants = { /* ... */ };
    const workoutCardVariants = { /* ... */ };
    const nextButtonVariants = { /* ... */ };
    const soundButtonVariants = { /* ... */ };

    return (
        <motion.div
            className="bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white" // Updated gradient
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    className="text-4xl font-extrabold mb-4 tracking-tight" // Bolder font
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    <span role="img" aria-label="muscle">💪</span> Home Chest Builder
                </motion.h1>

                {/* --- Display Last Workout Info --- */}
                 {!isRunning && lastWorkoutInfo && (
                    <motion.div
                        className="mb-6 bg-black bg-opacity-20 p-3 rounded-lg text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    >
                        Last Chest Workout ({lastWorkoutInfo.date}): {lastWorkoutInfo.level} - {formatTime(lastWorkoutInfo.duration)}
                    </motion.div>
                 )}


                {/* --- Level Selection --- */}
                {!isRunning && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8" // Adjusted grid for 4 items
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.4 } }}
                    >
                        {Object.keys(homeChestWorkouts)
                            .filter(key => key !== "Rest & Stretching") // Filter out rest initially
                            .map((lvl) => (
                                <motion.button
                                    key={lvl}
                                    variants={levelButtonVariants}
                                    initial="initial" whileHover="hover" whileTap="tap"
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-5 py-3 rounded-lg font-semibold shadow-md hover:from-cyan-600 hover:to-blue-600 transition duration-300" // New button style
                                    onClick={() => startWorkout(lvl)}
                                >
                                    {lvl}
                                </motion.button>
                            ))}
                         {/* Rest & Stretching Button Separate */}
                          <motion.button
                                variants={levelButtonVariants}
                                initial="initial" whileHover="hover" whileTap="tap"
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg px-5 py-3 rounded-lg font-semibold shadow-md hover:from-yellow-500 hover:to-orange-600 transition duration-300" // Distinct style
                                onClick={handleRestAndStretch}
                            >
                                Rest/Stretch
                            </motion.button>
                    </motion.div>
                )}

                {/* --- Workout Display --- */}
                {currentExercise && (
                    <motion.div
                        className="bg-black bg-opacity-40 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-center max-w-md mx-auto" // Adjusted style
                        variants={workoutCardVariants}
                        initial="initial" animate="animate" exit="exit"
                        key={currentIndex} // Ensures animation runs on exercise change
                    >
                        {/* --- Live Timer --- */}
                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-lg font-mono">
                            ⏱️ {formatTime(timer)}
                        </div>

                        {/* --- Sound Toggle --- */}
                        <div className="absolute top-4 right-4">
                            <motion.button
                                variants={soundButtonVariants} initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={toggleSound}
                                className={`p-2 rounded-full shadow-md transition-colors ${isSoundEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                            >
                                {/* SVG remains the same */}
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isSoundEnabled ? ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586a2 2 0 01-.707-2.928m0-4.142a2 2 0 01.707-2.928m2.1 4.142hA2 2 0 0010 15.07l3.975-3.975a2 2 0 012.828 2.828l-3.975 3.975a2 2 0 01-2.828 0z" /> ) : ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.243-4.243a1.995 1.995 0 010-2.828L16.657 3.343a1.995 1.995 0 012.828 0l4.243 4.243a1.995 1.995 0 010 2.828l-4.243 4.243zM15 11l-6 6m0-6l6 6" /> )}
                                </svg>
                            </motion.button>
                        </div>

                        {/* --- Exercise Info --- */}
                        <motion.h2 className="text-2xl font-bold mt-8 mb-2">{level} Level</motion.h2> {/* Added margin top */}
                         <p className="text-sm text-gray-300 mb-4">Exercise {currentIndex + 1} of {homeChestWorkouts[level].length}</p>
                        <motion.div className="flex flex-col items-center mb-6">
                             {/* Image animation adjusted */}
                            <motion.img
                                src={currentExercise.img} alt={currentExercise.name}
                                className="h-56 md:h-64 w-full object-contain rounded-md mb-4" // Adjusted height
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 } }} // Spring animation
                            />
                            <motion.h3 className="text-xl font-semibold">{currentExercise.name}</motion.h3>
                            <motion.p className="text-lg text-gray-300 mt-1">{currentExercise.reps || currentExercise.duration}</motion.p>
                        </motion.div>

                        {/* --- Next Button --- */}
                        <motion.button
                            variants={nextButtonVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap"
                            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg px-8 py-3 rounded-lg font-bold shadow-lg hover:from-green-500 hover:to-emerald-600 transition duration-300 w-full" // Full width, bolder style
                            onClick={nextExercise}
                        >
                            {currentIndex === homeChestWorkouts[level].length - 1
                                ? "Finish Workout"
                                : `Next ${level === "Rest & Stretching" ? "Stretch" : "Exercise"}`}
                        </motion.button>

                         {/* --- Stop Button (Optional but good practice) --- */}
                         <button
                            onClick={() => stopWorkout(false)} // Stop without marking complete
                            className="mt-4 text-xs text-gray-400 hover:text-red-400 transition-colors"
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