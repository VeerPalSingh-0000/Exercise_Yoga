import React from 'react';
import { motion } from 'framer-motion';
import { jawlineProgressData } from './data/workoutData'; // Or './data/jawlineWorkoutData' if that’s your filename

const JawlineStageSelector = ({ onSelect }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-center mb-2">
        Welcome to Your Science-Based Jawline Plan
      </h2>
      <p className="text-center text-gray-400 mb-8">
        To personalize your plan, select the image that best matches your current jawline definition or facial stage.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {jawlineProgressData.map(stage => (
          <motion.button
            key={stage.stage}
            type="button"
            onClick={() => onSelect(stage)}
            className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center transition-all hover:border-blue-500 hover:scale-105 overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <img
              src={stage.image}
              alt={`Jawline progress: ${stage.stage}`}
              className="rounded-lg mb-3 mx-auto w-full h-56 object-cover"
            />
            <h3 className="text-lg font-semibold">{stage.stage}</h3>
            <p className="text-sm text-gray-400">Est. Timeline: {stage.goal}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default JawlineStageSelector;
