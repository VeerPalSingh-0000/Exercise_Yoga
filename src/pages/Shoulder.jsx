import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3";

const homeShoulderWorkouts = {
    Beginner: [
        { name: "Arm Circles (forward)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/867.gif", reps: "3 sets × 15 reps" },
        { name: "Arm Circles (backward)", img: "https://flabfix.com/wp-content/uploads/2019/08/Reverse-Arm-Circles.gif", reps: "3 sets × 15 reps" },
        { name: "Wall Slides", img: "https://www.verywellfit.com/thmb/gcAIsENlzZAgPLhZa8Q4dKfu2Jk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48-2696607-Wall-Slides-GIF-5b32e58f09f74ace8be6c314d59b7b0b.gif", reps: "3 sets × 10 reps" },
        { name: "Scapular Retractions", img: "https://i.makeagif.com/media/1-13-2024/K4PpOk.gif", reps: "3 sets × 15 reps" },
        { name: "Doorway Chest Stretch", img: "https://cdn-life.dailyburn.com/life/wp-content/uploads/2014/01/10050516/Chest-Stretch1.gif", duration: "3 sets × 30 sec hold" },
    ],
    "Rest & Stretching": [
        { name: "Neck Rolls", img: "https://flabfix.com/wp-content/uploads/2019/05/Neck-Rolls.gif", duration: "1 minute" },
        { name: "Shoulder Rolls (forward)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", duration: "30 seconds" },
        { name: "Shoulder Rolls (backward)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/Shoulder-roll.gif", duration: "30 seconds" },
        { name: "Cross-Body Shoulder Stretch(both hands)", img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/400x400_9_Stretches_to_Benefit_Your_Golf_Game_Shoulder_Swing_Stretch.gif", duration: "30 seconds each arm" },
        { name: "Overhead Triceps Stretch (both hands)", img: "https://www.vissco.com/wp-content/uploads/animation/sub/triceps-stretch.gif", duration: "30 seconds each arm" },
    ],
    Intermediate: [
        { name: "Standing Dumbbell Lateral Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/32.gif", reps: "3 sets × 12-15 reps" },
        { name: "Standing Dumbbell Front Raises", img: "https://cdn.jefit.com/assets/img/exercises/gifs/413.gif", reps: "3 sets × 10-12 reps" },
        { name: "Arnold Press", img: "https://barbend.com/wp-content/uploads/2023/12/arnold-press-barbend-movement-gif-masters.gif", reps: "3 sets × 10 reps" },
        { name: "Bent-Over Dumbbell Reverse Flyes", img: "https://cdn.jefit.com/assets/img/exercises/gifs/1108.gif", reps: "3 sets × 10-12 reps" },
        { name: "Push-ups (focus on controlled descent)", img: "https://downloads.ctfassets.net/6ilvqec50fal/5uu7dusmhGaiShn5t7fUOd/685b4c1672bc6d5a15057aece20d38fa/negative-push-up.gif", reps: "3 sets × 10-12 reps" },

    ],
    Hard: [
        { name: "Overhead Press (with dumbbells or resistance band)", img: "https://barbend.com/wp-content/uploads/2023/10/seated-dumbbell-shoulder-press-barbend-movement-gif-masters-2.gif", reps: "3 sets × 8-10 reps" },
        { name: "Lateral Raises (single arm, controlled)", img: "https://newlife.com.cy/wp-content/uploads/2019/11/03551301-Dumbbell-One-Arm-Lateral-Raise_shoulder_360.gif", reps: "3 sets × 8-10 reps each arm" },
        { name: "Front Raises (with pause at the top)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/6.gif", reps: "3 sets × 8-10 reps" },
        { name: "Face Pulls (with resistance band)", img: "https://static.wixstatic.com/media/11c3fa_24f6c6f573724e02ab2d32e6726d8a7d~mv2.gif", reps: "3 sets × 12-15 reps" },
        { name: "Handstand Push-ups (or pike push-ups)", img: "https://i.pinimg.com/originals/77/8f/2f/778f2fc352c4e0e623037825c5594202.gif", reps: "3 sets × as many as possible" },
    ],
};

const Shoulder = () => {
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    useEffect(() => {
        audio.loop = true;
        if (isRunning && isSoundEnabled) {
            audio.play().catch(error => console.error("Playback failed:", error));
        } else {
            audio.pause();
            audio.currentTime = 0;
        }

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [isRunning, isSoundEnabled, audio]);

    const startWorkout = (lvl) => {
        setLevel(lvl);
        setCurrentIndex(0);
        setIsRunning(true);
    };

    const nextExercise = () => {
        if (level && currentIndex < homeShoulderWorkouts[level].length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (level) {
            alert(`${level} Workout Complete! 💪`);
            setIsRunning(false);
            setLevel(null); // Reset level to go back to selection
        }
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const handleRestAndStretch = () => {
        setLevel("Rest & Stretching");
        setCurrentIndex(0);
        setIsRunning(true);
    };

    const currentExercise = isRunning && level ? homeShoulderWorkouts[level][currentIndex] : null;

    const levelButtonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 },
    };

    const workoutCardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const nextButtonVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.2 } },
        hover: { backgroundColor: "#a7f3d0", scale: 1.05 }, // Light green hover
        tap: { scale: 0.95 },
    };

    const soundButtonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9 },
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-teal-200 to-lime-200 min-h-screen py-12 px-4 sm:px-6 lg:px-8" // Lighter gradient
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    className="text-4xl font-bold text-gray-800 mb-8 animate-bounce" // Darker text for contrast
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    💪 Home Shoulder Workout
                </motion.h1>

                {!isRunning && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.4 } }}
                    >
                        {Object.keys(homeShoulderWorkouts)
                            .filter(key => key !== "Rest & Stretching")
                            .map((lvl) => (
                                <motion.button
                                    key={lvl}
                                    variants={levelButtonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="bg-teal-300 text-gray-800 text-lg px-6 py-4 rounded-lg font-semibold shadow-md hover:bg-teal-200 transition duration-300" // Lighter button
                                    onClick={() => startWorkout(lvl)}
                                >
                                    {lvl}
                                </motion.button>
                            ))}
                        <motion.button
                            variants={levelButtonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-lime-300 text-gray-800 text-lg px-6 py-4 rounded-lg font-semibold shadow-md hover:bg-lime-200 transition duration-300 sm:col-span-2 md:col-span-1" // Lighter rest button
                            onClick={handleRestAndStretch}
                        >
                            Rest & Stretching
                        </motion.button>
                    </motion.div>
                )}

                {currentExercise && (
                    <motion.div
                        className="bg-gray-100 bg-opacity-75 p-8 rounded-xl shadow-lg text-center max-w-md mx-auto" // Light gray card
                        variants={workoutCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={currentIndex}
                    >
                        <div className="flex justify-end mb-4">
                            <motion.button
                                variants={soundButtonVariants}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleSound}
                                className={`p-2 rounded-full shadow-md ${isSoundEnabled ? 'bg-teal-300 text-gray-800' : 'bg-red-300 text-gray-800'}`} // Lighter sound button
                                aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isSoundEnabled ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586a2 2 0 01-.707-2.928m0-4.142a2 2 0 01.707-2.928m2.1 4.142hA2 2 0 0010 15.07l3.975-3.975a2 2 0 012.828 2.828l-3.975 3.975a2 2 0 01-2.828 0z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.243-4.243a1.995 1.995 0 010-2.828L16.657 3.343a1.995 1.995 0 012.828 0l4.243 4.243a1.995 1.995 0 010 2.828l-4.243 4.243zM15 11l-6 6m0-6l6 6" />
                                    )}
                                </svg>
                            </motion.button>
                        </div>
                        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4">{level} Level</motion.h2>
                        <motion.div className="flex flex-col items-center mb-6">
                            <motion.img
                                src={currentExercise.img}
                                alt={currentExercise.name}
                                className="h-64 w-full object-contain rounded-md shadow-md"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                onError={(e) => {
                                    // Optional: Handle image loading errors, e.g., display a fallback image
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = "URL_TO_YOUR_FALLBACK_IMAGE";
                                }}
                            />
                            <motion.h3 className="text-xl font-semibold text-gray-800 mt-4">{currentExercise.name}</motion.h3>
                            <motion.p className="text-lg text-gray-600 mt-2">{currentExercise.reps || currentExercise.duration}</motion.p>
                        </motion.div>

                        <motion.button
                            variants={nextButtonVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-teal-300 text-gray-800 text-lg px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-200 transition duration-300" // Lighter next button
                            onClick={nextExercise}
                        >
                            Next {level === "Rest & Stretching" ? "Stretch" : "Exercise"}
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Shoulder;