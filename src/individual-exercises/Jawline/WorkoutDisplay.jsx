import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, cardVariants } from './config/animations';
import { formatTime, getDifficultyColor, getDifficultyStars } from './utils/helpers';
import { workoutsByPhase } from './data/workoutData';

const WorkoutDisplay = ({ currentPhase, currentIndex, timer, isSoundEnabled, onToggleSound, onNext, onStop }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const workout = workoutsByPhase[currentPhase];
    const currentExercise = workout.exercises[currentIndex];

    return (
        <motion.div
            key={`${currentPhase}-${currentIndex}`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className="relative bg-black bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto"
        >
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-4 py-2 rounded-full text-lg font-mono z-10 shadow-lg">
                ⏱️ {formatTime(timer)}
            </div>

            <motion.button
                variants={buttonVariants} whileHover="hover" whileTap="tap"
                onClick={onToggleSound}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors z-10 ${isSoundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
                {isSoundEnabled ? '🔊' : '🔇'}
            </motion.button>

            <div className="mt-16 mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-100">Phase {currentPhase}: {workout.title}</h2>
                <p className="text-gray-400 mb-4">Exercise {currentIndex + 1} of {workout.exercises.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                    <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                        initial={{ width: `${(currentIndex / workout.exercises.length) * 100}%` }}
                        animate={{ width: `${((currentIndex + 1) / workout.exercises.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <motion.div
                className="h-64 w-full rounded-xl mb-6 bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
            >
                <img
                    src={currentExercise.img} alt={currentExercise.name} className="h-full w-full object-contain"
                    onError={(e) => { e.target.parentElement.innerHTML = '<div class="text-gray-500">Image not available</div>'; }}
                />
            </motion.div>

            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{currentExercise.name}</h3>
                <p className="text-xl text-yellow-400 font-semibold mb-4">{currentExercise.reps || currentExercise.duration}</p>
                <div className={`flex items-center justify-center gap-4 mb-4 text-lg ${getDifficultyColor(currentExercise.difficulty)}`}>
                    <span className="text-gray-400 text-base">Difficulty:</span>
                    <span>{getDifficultyStars(currentExercise.difficulty)}</span>
                </div>
            </div>

            {currentExercise.instructions && (
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="mb-4 bg-orange-600 bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-lg transition-all"
                >
                    {showInstructions ? '📖 Hide Instructions' : '📖 Show Instructions'}
                </motion.button>
            )}

            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-left overflow-hidden"
                    >
                        <h4 className="font-semibold text-yellow-400 mb-2">Instructions:</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">{currentExercise.instructions}</p>
                        {currentExercise.tips && (
                            <>
                                <h4 className="font-semibold text-green-400 mb-2">Tips:</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">💡 {currentExercise.tips}</p>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-4">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={onNext}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl px-8 py-4 rounded-xl font-bold shadow-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 w-full"
                >
                    {currentIndex === workout.exercises.length - 1 ? "🎉 Finish Workout" : "➡️ Next Exercise"}
                </motion.button>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={() => onStop(false)}
                    className="bg-red-600 bg-opacity-30 hover:bg-opacity-50 text-white px-6 py-2 rounded-lg transition-all"
                >
                    🛑 Stop Workout
                </motion.button>
            </div>
        </motion.div>
    );
};

export default WorkoutDisplay;