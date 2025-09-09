import React from 'react';
import { motion } from 'framer-motion';
import { armSizeData } from './data/workoutData';

const ArmSizeSelector = ({ onSelect }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-center mb-2">Welcome to Your Science-Based Forearm Plan</h2>
      <p className="text-center text-gray-400 mb-8">
        To personalize your plan, select the image that best matches your current forearm size.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {armSizeData.map(size => (
          <motion.button
            key={size.size}
            type="button"
            onClick={() => onSelect(size)}
            className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center transition-all hover:border-purple-500 hover:scale-105 overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <img
              src={size.image}
              alt={`Forearm size ${size.size}`}
              className="rounded-lg mb-3 mx-auto w-full h-56 object-cover"
            />
            <h3 className="text-lg font-semibold">{size.size}</h3>
            <p className="text-sm text-gray-400">Est. Timeline: {size.goal}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ArmSizeSelector;
