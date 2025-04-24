import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2"; // Import for the graph
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; // Import chart.js components
import { Progress } from "reactstrap"; // You can use this or create your own progress bar

// Categories for exercise selection
const categories = [
    { name: "Chest", path: "/exercises/chest" },
    { name: "Triceps", path: "/exercises/triceps" },
    { name: "Shoulders", path: "/exercises/shoulders" },
    { name: "Back", path: "/exercises/back" },
    { name: "Legs", path: "/exercises/legs" },
    { name: "Abs", path: "/exercises/abs" },
];

const Dashboard = () => {
    const currentDayIndex = new Date().getDay() - 1; // Sunday = 0, Monday = 1, etc.

    const navigate = useNavigate();
    const [fixedWeeklyExercises, setFixedWeeklyExercises] = useState(Array(6).fill(["", ""]));
    const [isFixedExercisesEditable, setIsFixedExercisesEditable] = useState(false);
    const [workoutDuration, setWorkoutDuration] = useState(45); // Example: 45 minutes
    const [steps, setSteps] = useState(7200); // Example: 7200 steps
    const [maxSteps, setMaxSteps] = useState(10000); // Maximum steps goal, e.g., 10,000 steps
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const availableExercises = [
        "chest", "bicep", "tricep", "leg", "shoulder", "back", "abs"
    ];
    const [yogaDuration, setYogaDuration] = useState(30); // Example: 30 minutes of yoga

    useEffect(() => {
        const savedFixedWeeklyExercises = JSON.parse(localStorage.getItem("userFixedWeeklyExercises"));
        if (savedFixedWeeklyExercises) {
            setFixedWeeklyExercises(savedFixedWeeklyExercises);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    const handleExerciseClick = (index, exerciseIndex) => {
        if (isFixedExercisesEditable) return; // Do nothing in edit mode

        const exerciseName = fixedWeeklyExercises[index][exerciseIndex];
        if (exerciseName) {
            navigate(`/exercises/${exerciseName.toLowerCase().replace(/\s+/g, "-")}`);
        }
    };


    const handleSaveFixedExercises = () => {
        localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(fixedWeeklyExercises));
        setIsFixedExercisesEditable(false);
    };

    const toggleFixedExercisesEdit = () => {
        setIsFixedExercisesEditable(!isFixedExercisesEditable);
    };

    const handleExerciseChange = (index, exerciseIndex, selectedExercise) => {
        // Update the exercise for that particular day and slot
        const updatedExercises = [...fixedWeeklyExercises];
        updatedExercises[index][exerciseIndex] = selectedExercise;
        setFixedWeeklyExercises(updatedExercises);
    };

    // ProgressBar Component using Tailwind CSS
    const ProgressBar = ({ percentage }) => (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Progress Bar</h2>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="font-semibold text-sm text-gray-500">Progress: {percentage}%</span>
                    </div>
                    <div className="text-right">
                        <span className="font-semibold text-xs text-gray-500">100%</span>
                    </div>
                </div>
                <div className="flex mb-2">
                    <div className="relative flex flex-grow w-full">
                        <div className="flex mb-2 flex-grow w-full h-2 rounded-full bg-gray-400">
                            <div
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Line chart options for workout progress
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const chartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Workout Duration (mins)",
                data: [45, 50, 40, 55, 60, 48], // Example data, change with actual values
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative px-4 py-4">
            {/* Logout */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-sm px-3 py-1 rounded hover:bg-red-500 transition-all duration-200"
                >
                    Logout
                </button>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-6xl mx-auto mt-16">
                <h1 className="text-3xl font-bold mb-8">🧘‍♂️ Your Fitness Dashboard</h1>

                {/* Fixed Weekly Exercises Table */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-md text-center mb-10">
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={toggleFixedExercisesEdit}
                            className="bg-yellow-500 text-sm px-3 py-1 rounded hover:bg-yellow-400 transition-all duration-200"
                        >
                            {isFixedExercisesEditable ? "Cancel" : "Change"}
                        </button>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">💪 Fixed Weekly Exercises</h2>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 bg-gray-700 text-white">Day</th>
                                <th className="p-2 bg-gray-700 text-white">Exercise 1</th>
                                <th className="p-2 bg-gray-700 text-white">Exercise 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dayNames.map((day, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index === currentDayIndex ? "bg-green-400" : "bg-gray-800"
                                    } hover:bg-gray-700 transition-all`}
                                >
                                    <td className="p-2 text-center">{day}</td>
                                    {[0, 1].map((exerciseIndex) => (
                                        <td
                                            key={exerciseIndex}
                                            className="p-2 text-center cursor-pointer"
                                            onClick={() => handleExerciseClick(index, exerciseIndex)}
                                        >
                                            {isFixedExercisesEditable ? (
                                                <select
                                                    value={fixedWeeklyExercises[index][exerciseIndex]}
                                                    onChange={(e) =>
                                                        handleExerciseChange(index, exerciseIndex, e.target.value)
                                                    }
                                                    className="bg-gray-700 text-white p-1 rounded"
                                                >
                                                    <option value="">Select Exercise</option>
                                                    {availableExercises.map((exercise) => (
                                                        <option key={exercise} value={exercise}>
                                                            {exercise}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                fixedWeeklyExercises[index][exerciseIndex] || "Not Set"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isFixedExercisesEditable && (
                        <button
                            onClick={handleSaveFixedExercises}
                            className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
                        >
                            Save Fixed Exercises
                        </button>
                    )}
                </div>

                {/* Progress Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Workout Progress</h2>
                        <Line data={chartData} />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Workout Duration</h2>
                        <ProgressBar percentage={(workoutDuration / 60) * 100} />
                        <p className="text-gray-400 text-sm">Total: {workoutDuration} mins today</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Step Tracker</h2>
                        <ProgressBar percentage={(steps / maxSteps) * 100} />
                        <p className="text-gray-400 text-sm">Steps: {steps}/{maxSteps}</p>
                    </div>
                </div>

                {/* Yoga Section */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-md text-center mb-10">
                    <h2 className="text-xl font-semibold mb-4">🧘‍♀️ Today's Yoga</h2>
                    <ProgressBar percentage={(yogaDuration / 60) * 100} /> {/* Assuming a 60 min max for yoga for the progress bar */}
                    <p className="text-gray-400 text-sm">Duration: {yogaDuration} minutes</p>
                    <button
                        onClick={() => navigate("/exercises/yoga")} // You'll need to create a Yoga exercises page
                        className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-500 transition"
                    >
                        Explore Yoga Exercises
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;