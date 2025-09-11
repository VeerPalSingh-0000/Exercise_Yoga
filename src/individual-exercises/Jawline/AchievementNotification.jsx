import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementNotification = ({ achievement }) => {
    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 20, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                    exit={{ opacity: 0, y: -100 }}
                    className="fixed top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl shadow-2xl z-50 w-full max-w-sm"
                >
                    <div className="text-center text-white">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="font-bold mb-1">Achievement Unlocked!</div>
                        <div className="text-sm text-orange-100">{achievement.name}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementNotification;