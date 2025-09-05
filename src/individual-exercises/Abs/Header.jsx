import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from './config/animations';

const Header = ({ onShowStats, onReset, appState }) => {
    return (
        <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                    🔥 Core Sculptor Pro
                </span>
            </h1>
            <div className="flex gap-3">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                    onClick={onShowStats}
                    className="px-4 py-2 rounded-lg font-semibold transition-colors bg-orange-600 hover:bg-orange-700 text-white"
                >
                    📊 Stats
                </motion.button>
                {appState !== 'selection' && (
                    <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap"
                        onClick={onReset}
                        className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        🔄 Reset
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default Header;