import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import motivationalSound from "../assets/workout_motivation.mp3";

const homeChestWorkouts = {
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
        if (level && currentIndex < homeChestWorkouts[level].length - 1) {
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

    const currentExercise = isRunning && level ? homeChestWorkouts[level][currentIndex] : null;

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
            className="bg-gradient-to-br from-green-800 to-lime-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                    className="text-4xl font-bold text-white mb-8 animate-bounce"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
                >
                    🔥 Home Chest Workout
                </motion.h1>

                {!isRunning && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.4 } }}
                    >
                        {Object.keys(homeChestWorkouts)
                            .filter(key => key !== "Rest & Stretching")
                            .map((lvl) => (
                                <motion.button
                                    key={lvl}
                                    variants={levelButtonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="bg-green-600 text-white text-lg px-6 py-4 rounded-lg font-semibold shadow-md hover:bg-green-500 transition duration-300"
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
                            className="bg-yellow-600 text-white text-lg px-6 py-4 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition duration-300 sm:col-span-2 md:col-span-1"
                            onClick={handleRestAndStretch}
                        >
                            Rest & Stretching
                        </motion.button>
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
                            <motion.p className="text-lg text-gray-300 mt-2">{currentExercise.reps || currentExercise.duration}</motion.p>
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
                            Next {level === "Rest & Stretching" ? "Stretch" : "Exercise"}
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Chest;