import React from "react";
import { NUTRITION_GOALS } from "./constants";
import { FiX } from "react-icons/fi";

const NutritionGoalsModal = ({ weight, setWeight, closeModal, setGoalsVersion }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-xs border border-gray-700 relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
        onClick={closeModal}
      >
        <FiX size={20} />
      </button>
      <h4 className="text-lg font-semibold mb-4 text-gray-100">Set Nutrition Goals</h4>
      <label className="block mb-2 text-sm text-gray-300">
        Your Weight (kg)
      </label>
      <input
        type="number"
        min="1"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <button
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded"
        onClick={() => {
          // Calculate macros: Protein 1.6g/kg, Carbs 4g/kg, Fats 1g/kg, Calories = 30*kg
          const w = parseFloat(weight);
          if (w > 0) {
            const newGoals = {
              CALORIES: Math.round(w * 30),
              PROTEIN: Math.round(w * 1.6),
              CARBS: Math.round(w * 4),
              FATS: Math.round(w * 1),
            };
            localStorage.setItem("userNutritionGoals", JSON.stringify(newGoals));
            Object.assign(NUTRITION_GOALS, newGoals);
            closeModal();
            setGoalsVersion(v => v + 1); // force re-render
          }
        }}
      >
        Calculate & Save
      </button>
      <p className="text-xs text-gray-400 mt-3">
        Based on common fitness recommendations.<br />
        Protein: 1.6g/kg, Carbs: 4g/kg, Fats: 1g/kg, Calories: 30kcal/kg.
      </p>
    </div>
  </div>
);

export default NutritionGoalsModal;
