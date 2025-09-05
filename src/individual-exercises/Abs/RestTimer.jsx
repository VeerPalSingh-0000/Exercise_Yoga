import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants } from './config/animations';
import { formatTime } from './utils/helpers';

const RestTimer = ({ isResting, restTimer, onSkip }) => {
    return (
        <AnimatePresence>
            {isResting && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                >
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-gray-800 to-black border border-gray-700 p-8 rounded-2xl text-center max-w-sm mx-4 shadow-2xl"
                    >
                        <div className="text-6xl mb-4">⏱️</div>
                        <div className="text-4xl font-bold mb-4 text-orange-400">{formatTime(restTimer)}</div>
                        <div className="text-lg mb-6 text-gray-300">Rest Time</div>
                        <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                            onClick={onSkip}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors w-full"
                        >
                            Skip Rest
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RestTimer;