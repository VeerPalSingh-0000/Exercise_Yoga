// /src/pages/categories/Tricep.jsx
import React from "react";

const tricepExercises = [
  "Tricep Dips",
  "Skull Crushers",
  "Tricep Pushdown",
  "Overhead Dumbbell Extension",
];

const Tricep = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Tricep Exercises</h1>
      <ul className="space-y-2">
        {tricepExercises.map((exercise, index) => (
          <li
            key={index}
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            {exercise}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tricep;
