import React from 'react';
import { motion } from 'framer-motion';
import { workoutsByPhase } from './data/workoutData';

const PlanOverview = ({ userProfile, currentPhase, onStart, onAdvance }) => {
    const phaseData = workoutsByPhase[currentPhase];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-10 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h2 className="text-3xl font-bold text-orange-400">Your Personalized Plan</h2>
                {userProfile && <p className="text-gray-300 mt-2">Based on your selection, your estimated time to visible abs is <strong className="text-white">{userProfile.timeline}</strong>.</p>}
                <p className="text-gray-400 text-sm mt-1">This requires consistent training and a caloric deficit of 300-500 calories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 p-8 rounded-2xl shadow-2xl text-white">
                    <h3 className="text-2xl font-bold mb-2">Current Focus: Phase {currentPhase}</h3>
                    <h4 className="text-4xl font-extrabold mb-4">{phaseData.title}</h4>
                    <p className="opacity-90 mb-6">This phase is designed to build your core foundation and prepare you for more advanced movements. Consistency is key.</p>
                    <motion.button
                        onClick={onStart}
                        className="w-full bg-white text-red-600 font-bold text-xl py-4 rounded-xl shadow-lg"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        Start Today's Workout
                    </motion.button>
                </div>

                <div className="text-center">
                    {currentPhase < 4 ? (
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-bold mb-2 text-gray-400">Up Next: Phase {currentPhase + 1}</h3>
                            <h4 className="text-2xl font-bold mb-4">{workoutsByPhase[currentPhase + 1].title}</h4>
                            <p className="text-gray-400 mb-4">Complete at least 4 weeks in the current phase to unlock the next level of your training.</p>
                            <motion.button
                                onClick={onAdvance}
                                className="w-full bg-gray-700 hover:bg-gray-600 font-bold py-3 rounded-xl transition"
                            >
                                Advance to Next Phase
                            </motion.button>
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-6 rounded-xl border border-green-500/50">
                            <h3 className="text-2xl font-bold text-green-400">Congratulations! 👑</h3>
                            <p className="text-gray-300 mt-2">You've reached the advanced training phase. Focus on progressive overload and maintaining consistency.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PlanOverview;