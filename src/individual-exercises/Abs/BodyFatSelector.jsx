import React from 'react';
import { motion } from 'framer-motion';
import { bodyFatData } from './data/workoutData';

const BodyFatSelector = ({ onSelect }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center mb-2">Welcome to Your Science-Based Abs Plan</h2>
            <p className="text-center text-gray-400 mb-8">To create your plan, please select the image that best represents your current body fat percentage.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {bodyFatData.map(bf => (
                        <motion.button
                            key={bf.range}
                            type="button"
                            onClick={() => onSelect(bf)}
                            className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center transition-all hover:border-orange-500 hover:scale-105 overflow-hidden"
                            whileHover={{ y: -5 }}
                        >
                            <img src={bf.image} alt={`Body fat ${bf.range}`} className="rounded-lg mb-3 mx-auto w-full h-auto aspect-[3/4] object-cover" />
                            <h3 className="text-lg font-semibold">{bf.range}</h3>
                            <p className="text-sm text-gray-400">Est. Timeline: {bf.timeline}</p>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default BodyFatSelector;