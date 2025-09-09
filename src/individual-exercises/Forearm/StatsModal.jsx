import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkoutCalendar from './WorkoutCalendar';

// Define the goal for workouts per phase and the list of phases to track
const WORKOUTS_PER_PHASE_GOAL = [12,16,16,20]; // Example goals for phases 1-4
const PHASES_TO_TRACK = [1, 2, 3, 4];

const StatsModal = ({ show, onClose, stats, userAchievements, workoutHistory }) => {

    // Calculate progress for each phase
    const phaseProgress = PHASES_TO_TRACK.map(phaseNum => {
        const completed = workoutHistory.filter(w => w.phase === phaseNum).length;
        const goal = WORKOUTS_PER_PHASE_GOAL[phaseNum - 1] || 0;
        const percentage = goal > 0 ? Math.min((completed / goal) * 100, 100) : 0;
        return {
            phase: phaseNum,
            completed,
            goal,
            percentage
        };
    });

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-40 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center text-white">📈 Your Core Progress</h3>
                        {workoutHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🔥</div>
                                <div className="text-xl font-semibold mb-2 text-gray-300">Ready to Burn?</div>
                                <p className="text-gray-400">Complete your first workout to see statistics here!</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="text-center bg-gray-800 p-4 rounded-lg">
                                        <div className="text-3xl font-bold text-orange-500">{stats.totalWorkouts}</div>
                                        <div className="text-sm text-gray-400">Total Workouts</div>
                                    </div>
                                    <div className="text-center bg-gray-800 p-4 rounded-lg">
                                        <div className="text-3xl font-bold text-red-500">{stats.totalTime}</div>
                                        <div className="text-sm text-gray-400">Total Time</div>
                                    </div>
                                    <div className="text-center bg-gray-800 p-4 rounded-lg">
                                        <div className="text-3xl font-bold text-yellow-500">{stats.avgTime}</div>
                                        <div className="text-sm text-gray-400">Average Time</div>
                                    </div>
                                </div>
                                
                                {/* =================== NEW SECTION ADDED HERE =================== */}
                                <div className="my-8">
                                    <h4 className="text-lg font-semibold mb-4 text-white">📊 Phase Progress</h4>
                                    <div className="space-y-4">
                                        {phaseProgress.map(progress => (
                                            <div key={progress.phase}>
                                                <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-300">
                                                    <span>Phase {progress.phase}</span>
                                                    <span>{progress.completed} / {progress.goal} Workouts</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                    <motion.div
                                                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2.5 rounded-full"
                                                        initial={{ width: '0%' }}
                                                        animate={{ width: `${progress.percentage}%` }}
                                                        transition={{ duration: 0.8, delay: 0.1 * progress.phase, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* ============================================================= */}

                                <WorkoutCalendar workoutHistory={workoutHistory} />

                                <h4 className="text-lg font-semibold mt-6 mb-3 text-white">🏆 Core Achievements</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {userAchievements.map(ach => (
                                        <div key={ach.id} className={`p-3 rounded-lg text-center transition-all border ${ach.unlocked ? 'bg-orange-600/20 border-orange-500' : 'bg-gray-800 border-gray-700'}`}>
                                            <div className={`text-2xl mb-1 ${!ach.unlocked && 'opacity-30'}`}>{ach.icon}</div>
                                            <div className={`text-xs font-semibold ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatsModal;

