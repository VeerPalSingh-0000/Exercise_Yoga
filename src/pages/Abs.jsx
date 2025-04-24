import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3"; // Import your sound file

const workouts = {
    Beginner: [
        { name: "Crunches", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/crunch-1457102356.gif?resize=640:*", reps: "15 reps" },
        { name: "Leg Raises", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/legraise-1472054568.gif", reps: "12 reps" },
        { name: "Dead Bug", img: "https://media2.giphy.com/media/aIyZ9Ra6pyo5ZOHQsm/giphy.gif", reps: "10 reps each side" },
        { name: "Russian Twists (no weight)", img: "https://hw.qld.gov.au/wp-content/uploads/2015/07/25_M_WIP02.gif", reps: "20 twists" },
        { name: "Plank (30 sec hold)", img: "https://hips.hearstapps.com/hmg-prod/images/hdm119918mh15842-1545237096.png", reps: "30 sec hold" },
    ],
    Intermediate: [
        { name: "Bicycle Crunches", img: "https://i.pinimg.com/originals/fc/4b/07/fc4b07092d4233d268d43c40dec321d0.gif", reps: "20 reps" },
        { name: "Reverse Crunches", img: "https://images.ctfassets.net/6ilvqec50fal/60HBk95X0A7Yh2xfHBkIGE/bbf8f4c8cf49827a7e91836351419792/reverse-crunch-andy-speer.gif", reps: "15 reps" },
        { name: "Plank to Shoulder Taps", img: "https://i.pinimg.com/originals/08/b1/f8/08b1f8a8de39bc33916af4547dc04b5a.gif", reps: "20 taps" },
        { name: "Flutter Kicks", img: "https://i.pinimg.com/originals/26/a7/50/26a750b15b8e6f3b05976b406d52f7b1.gif", reps: "20 kicks" },
        { name: "Side Plank Left", img: "https://experiencelife.lifetime.life/wp-content/uploads/2021/07/bid-side-plank.jpg", reps: "15 sec" },
        { name: "Side Plank Right", img: "https://ik.imagekit.io/02fmeo4exvw/exercise-library/large/101-2.jpg", reps: "15 sec" },
    ],
    Hard: [
        { name: "V-Ups", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/vupmodifiedwithhands-1472155234.gif", reps: "20 reps" },
        { name: "Mountain Climbers", img: "https://i.pinimg.com/originals/32/a7/d0/32a7d00d6123dd416e459ba67cf1691b.gif", reps: "30 sec" },
        { name: "Toe Touches (Legs Up)", img: "https://cdn.jefit.com/assets/img/exercises/gifs/76.gif", reps: "15 reps" },
        { name: "Russian Twists (with weight)", img: "https://hips.hearstapps.com/hmg-prod/images/108-weighted-russian-twists-1579279935.gif", reps: "20 twists" },
        { name: "Plank to Elbow + Reach Out", img: "https://cdn.shopify.com/s/files/1/0330/6521/files/1.gif?v=1597238005", reps: "12 reps each arm" },
        { name: "Side Plank with Hip Dips", img: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/08/hipup-1472221358.gif", reps: "15 dips" },
    ]
};

const Abs = () => {
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audio] = useState(new Audio(motivationalSound));
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    useEffect(() => {
        audio.loop = true; // Loop the sound
        if (isRunning && isSoundEnabled) {
            audio.play().catch(error => console.error("Playback failed:", error));
        } else {
            audio.pause();
            audio.currentTime = 0; // Reset playback to the start
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
        if (currentIndex < workouts[level].length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("Workout Complete! 🎉");
            setIsRunning(false);
        }
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const currentExercise = isRunning && level ? workouts[level][currentIndex] : null;

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
        hover: { backgroundColor: "#28a745", scale: 1.05 },
        tap: { scale: 0.95 },
    };

    const soundButtonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.9 },
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    className="text-4xl font-bold text-white mb-8 animate-bounce"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    🔥 Sculpt Your Core
                </motion.h1>

                {!isRunning && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.4 } }}
                    >
                        {Object.keys(workouts).map((lvl) => (
                            <motion.button
                                key={lvl}
                                variants={levelButtonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-indigo-600 text-white text-lg px-6 py-4 rounded-lg font-semibold shadow-md hover:bg-indigo-500 transition duration-300"
                                onClick={() => startWorkout(lvl)}
                            >
                                {lvl}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {currentExercise && (
                    <motion.div
                        className="bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-lg text-center max-w-md mx-auto"
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
                                className={`p-2 rounded-full shadow-md ${isSoundEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
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
                        <motion.h2 className="text-2xl font-bold text-white mb-4">{level} Level</motion.h2>
                        <motion.div className="flex flex-col items-center mb-6">
                            <motion.img
                                src={currentExercise.img}
                                alt={currentExercise.name}
                                className="h-64 w-full object-contain rounded-md shadow-md"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } }}
                            />
                            <motion.h3 className="text-xl font-semibold text-white mt-4">{currentExercise.name}</motion.h3>
                            <motion.p className="text-lg text-gray-300 mt-2">{currentExercise.reps}</motion.p>
                        </motion.div>

                        <motion.button
                            variants={nextButtonVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            whileTap="tap"
                            className="bg-green-500 text-white text-lg px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-400 transition duration-300"
                            onClick={nextExercise}
                        >
                            Next Exercise
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Abs;