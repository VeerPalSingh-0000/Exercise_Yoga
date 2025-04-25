// src/pages/Dashboard.js

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import auth
import { db } from "../firebase"; // --- NEW: Import db for Firestore
// --- NEW: Import Firestore functions for adding data ---
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Define a default weekly exercise schedule
const defaultWeeklySchedule = [
  ["chest", "tricep"], // Monday: Classic Push day start (Chest focus)
  ["back", "bicep"], // Tuesday: Classic Pull day
  ["leg", "shoulder"], // Wednesday: Lower body + Upper body push (Shoulder focus)
  ["chest", "abs"], // Thursday: Second chest day paired with core work
  ["back", "tricep"], // Friday: Second back day, paired with triceps (common pairing)
  ["leg", "bicep"], // Saturday: Second leg day, paired with biceps
];

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ Initialize state with the default schedule
  const [fixedWeeklyExercises, setFixedWeeklyExercises] = useState(
    defaultWeeklySchedule
  );
  const [isFixedExercisesEditable, setIsFixedExercisesEditable] =
    useState(false);
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const availableExercises = [
    "chest",
    "bicep",
    "tricep",
    "leg",
    "shoulder",
    "back",
    "abs",
    "yoga" // Added yoga to selectable list if needed
  ];

  // --- REMOVE: pastWorkouts state is no longer needed for saving/loading here ---
  // This state was used for localStorage, but we're now using Firestore for logs.
  // const [pastWorkouts, setPastWorkouts] = useState({});

  // State for the manual workout logging form
  const [logDate, setLogDate] = useState(formatDate(new Date())); // Default to today
  const [logDuration, setLogDuration] = useState(0);
  const [logSteps, setLogSteps] = useState(0);
  const [logExercises, setLogExercises] = useState([]); // Selected exercises for log

  // --- Keep the useEffect to load FIXED weekly schedule from localStorage ---
  // This is separate from workout logs and can still be stored locally per browser.
  useEffect(() => {
    const savedFixedWeeklyExercises = localStorage.getItem(
      "userFixedWeeklyExercises"
    );
    if (savedFixedWeeklyExercises) {
      try {
        const parsedExercises = JSON.parse(savedFixedWeeklyExercises);
        // Basic validation: check if it's an array of the correct length
        if (Array.isArray(parsedExercises) && parsedExercises.length === 6) {
          setFixedWeeklyExercises(parsedExercises);
        } else {
          console.warn(
            "Invalid exercise data found in localStorage. Using default schedule."
          );
          // Optionally clear invalid data: localStorage.removeItem("userFixedWeeklyExercises");
        }
      } catch (error) {
        console.error(
          "Failed to parse saved exercises from localStorage:",
          error
        );
        // Optionally clear corrupted data: localStorage.removeItem("userFixedWeeklyExercises");
      }
    }
    // If nothing is saved, the state remains as the 'defaultWeeklySchedule' set in useState
  }, []); // Empty dependency array means this runs once on mount

  // --- REMOVE: The useEffect that SAVED pastWorkouts to localStorage ---
  // This is no longer needed as we save directly to Firestore in handleLogWorkout.
  // useEffect(() => {
  //     localStorage.setItem("pastWorkouts", JSON.stringify(pastWorkouts));
  // }, [pastWorkouts]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally clear local storage on logout if desired (e.g., fixed schedule)
      // localStorage.removeItem("userFixedWeeklyExercises");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleExerciseClick = (index, exerciseIndex) => {
    if (isFixedExercisesEditable) return; // Do nothing in edit mode

    const exerciseName = fixedWeeklyExercises[index]?.[exerciseIndex]; // Use optional chaining for safety
    if (exerciseName) { // Check if an exercise is actually set
      // Navigate to the corresponding exercise page (ensure paths match App.js)
      navigate(`/exercises/${exerciseName}`);
    } else {
      console.log("No exercise set for this slot.");
      // Optionally navigate somewhere else or show a message
    }
  };

  // Handles saving the *fixed weekly plan* to localStorage
  const handleSaveFixedExercises = () => {
    localStorage.setItem(
      "userFixedWeeklyExercises",
      JSON.stringify(fixedWeeklyExercises)
    );
    setIsFixedExercisesEditable(false);
  };

  const toggleFixedExercisesEdit = () => {
    setIsFixedExercisesEditable(!isFixedExercisesEditable);
  };

  const handleExerciseChange = (index, exerciseIndex, selectedExercise) => {
    const updatedExercises = fixedWeeklyExercises.map((dayExercises, i) =>
      i === index
        ? dayExercises.map((ex, j) => (j === exerciseIndex ? selectedExercise : ex))
        : dayExercises
    );
    setFixedWeeklyExercises(updatedExercises);
  };

  // --- NEW: Handle Log Workout - Save to Firestore ---
  // This function is now asynchronous because Firestore operations are promises.
  const handleLogWorkout = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation
    if (!logDate) {
      alert("Please select a date.");
      return;
    }

    const user = auth.currentUser; // Get the currently logged-in user

    // Ensure user is logged in before attempting to save
    if (!user) {
        alert("You must be logged in to log a workout.");
        navigate("/login"); // Redirect to login if somehow not logged in
        return;
    }

    // Prepare the workout data object to be saved to Firestore
    const workoutData = {
      userId: user.uid, // Store the user's ID - CRUCIAL for querying later
      date: new Date(logDate), // Store date as a Date object (Firestore converts to Timestamp)
      duration: parseInt(logDuration, 10) || 0, // Ensure duration is a number
      steps: parseInt(logSteps, 10) || 0, // Ensure steps is a number
      exercises: logExercises, // Array of selected exercises
      createdAt: serverTimestamp(), // Optional: Add a timestamp for when the log was created
    };

    try {
      // Add a new document to the "workoutLogs" collection in Firestore.
      // Firestore will automatically create the collection if it doesn't exist.
      // addDoc returns a Promise that resolves with a DocumentReference.
      const docRef = await addDoc(collection(db, "workoutLogs"), workoutData);
      console.log("Workout log successfully written with ID: ", docRef.id); // Log the new document ID

      // Provide user feedback
      alert(`Workout logged for ${logDate} successfully!`);

      // Optionally reset form fields after successful logging
      // setLogDate(formatDate(new Date())); // Keep today's date or reset
      setLogDuration(0);
      setLogSteps(0);
      setLogExercises([]);

    } catch (error) {
      // Handle errors during the Firestore write operation
      console.error("Error adding workout document to Firestore: ", error);
      alert("Failed to log workout. Please try again.");
    }
  };


  // --- Update getWorkoutDataForChart ---
  // This function currently uses static/example data or data from the old localStorage state.
  // To make it dynamic based on data saved in Firestore, you would need to:
  // 1. Fetch the current week's data from Firestore when the Dashboard loads.
  // 2. Store that fetched weekly data in a new state variable.
  // 3. Update this function to use that state variable for the chart data.
  // This is a more advanced step and requires fetching logic similar to the history page,
  // but filtering for the current week. Keeping it with example data for now to focus on saving/fetching history.
  const getWorkoutDataForChart = () => {
     // Example data, change with actual values fetched from Firestore for the week
     const exampleData = [45, 50, 40, 55, 60, 48]; // Replace with fetched data for the week

     // Use day names as labels
     const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Corresponds to dayNames indices 0-5

     return {
         labels: chartLabels, // Use the defined labels
         datasets: [
             {
                 label: "Workout Duration (mins)",
                 data: exampleData, // Use fetched data here
                 borderColor: "rgb(52, 211, 153)", // Emerald green
                 backgroundColor: "rgba(52, 211, 153, 0.2)",
                 tension: 0.1,
                 fill: true, // Fill area under the line
             },
         ],
     };
  };

  const chartData = getWorkoutDataForChart(); // Generate chart data (currently based on example)

  // Chart options (using existing ones)
  const chartOptions = {
     responsive: true, // Make chart responsive
     maintainAspectRatio: false, // Allow chart to fill container height
     plugins: {
          legend: {
              labels: {
                  color: 'rgb(209, 213, 219)', // gray-300 for legend text
              }
          },
          title: {
              display: false, // Hide default title if h2 is used
          }
     },
     scales: {
          y: {
              ticks: { color: 'rgb(156, 163, 175)' }, // gray-400 for Y-axis labels
              grid: { color: 'rgba(107, 114, 128, 0.3)' }, // gray-500 for grid lines
              beginAtZero: true, // Start Y-axis at 0
          },
          x: {
              ticks: { color: 'rgb(156, 163, 175)' }, // gray-400 for X-axis labels
              grid: { color: 'rgba(107, 114, 128, 0.3)' }, // gray-500 for grid lines
          }
     }
  };

  // ProgressBar Component using Tailwind CSS (using existing one)
  const ProgressBar = ({ label, percentage, valueText }) => (
      <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">{label}</h3>
          <div className="relative pt-1">
              <div className="flex mb-1 items-center justify-between">
                  <div>
                      <span className="text-xs font-semibold text-gray-400">{valueText}</span>
                  </div>
                  <div className="text-right">
                      <span className="text-xs font-semibold text-gray-400">{percentage.toFixed(0)}%</span>
                  </div>
              </div>
              <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-600">
                  <div
                      style={{ width: `${percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300 ease-in-out"
                  ></div>
              </div>
          </div>
      </div>
  );

  // --- Update Today's Progress Bars ---
  // These progress bars currently use the values from the manual log form state (logDuration, logSteps)
  // for simplicity. To make them dynamic based on today's *saved* data from Firestore,
  // you would need to fetch today's log specifically from Firestore when the dashboard loads
  // and use those fetched values.
  const todaysWorkoutDuration = parseInt(logDuration, 10) || 0; // Using form state value
  const todaysSteps = parseInt(logSteps, 10) || 0; // Using form state value
  const yogaGoal = 45; // Example goal for yoga
  const workoutGoal = 60; // Example goal for workout duration
  const stepsGoal = 10000; // Example goal for steps


  // --- REMOVE: getRecentWorkouts and recentWorkouts state ---
  // This logic was for displaying recent logs from localStorage.
  // The dedicated history page will now handle displaying logs fetched from Firestore.
  // const getRecentWorkouts = (numDays = 7) => { ... };
  // const recentWorkouts = getRecentWorkouts(7);

  // Calculate highlight index for the weekly plan
  // new Date().getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
  // We want Monday=0, Tuesday=1, ..., Saturday=5.
  // So, if getDay() is 0 (Sunday), we don't highlight. If it's 1-6, subtract 1.
  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const highlightIndex = todayIndex === 0 ? -1 : todayIndex - 1; // Map Mon-Sat to 0-5, Sun to -1


  return (
    <div className="min-h-screen bg-gray-900 text-white relative px-4 py-4">
      {/* History Button - Navigate to the history page */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate("/history")} // Navigate to the /history route
          className="bg-blue-600 text-sm px-3 py-1 rounded hover:bg-blue-500 transition-all duration-200 shadow"
        >
          View All Data
        </button>
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-sm px-3 py-1 rounded hover:bg-red-500 transition-all duration-200 shadow"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Main Content */}
      <div className="max-w-6xl mx-auto mt-12 md:mt-16">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          🧘‍♂️ Your Fitness Dashboard
        </h1>

        {/* Fixed Weekly Exercises Table */}
        {/* This section remains the same, using localStorage for the fixed plan */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg text-center mb-10 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-left">
              💪 Weekly Workout Plan
            </h2>
            <button
              onClick={toggleFixedExercisesEdit}
              className="bg-yellow-500 text-sm px-3 py-1 rounded hover:bg-yellow-400 transition-all duration-200 text-gray-900 font-medium"
            >
              {isFixedExercisesEditable ? "Cancel" : "Change Plan"}
            </button>
          </div>
          <table className="min-w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 md:p-3 border border-gray-600 text-sm md:text-base">
                  Day
                </th>
                <th className="p-2 md:p-3 border border-gray-600 text-sm md:text-base">
                  Exercise 1
                </th>
                <th className="p-2 md:p-3 border border-gray-600 text-sm md:text-base">
                  Exercise 2
                </th>
              </tr>
            </thead>
            <tbody>
              {dayNames.map((day, index) => (
                <tr
                  key={index}
                  className={` ${
                    index === highlightIndex
                      ? "bg-emerald-600 bg-opacity-40" // Highlight today's row
                      : "bg-gray-800 hover:bg-gray-700"
                  } transition-colors duration-150`}
                >
                  <td className="p-2 border border-gray-600 text-center font-medium">
                    {day}
                  </td>
                  {[0, 1].map((exerciseIndex) => (
                    <td
                      key={exerciseIndex}
                      className={`p-2 border border-gray-600 text-center ${
                        !isFixedExercisesEditable &&
                        fixedWeeklyExercises[index]?.[exerciseIndex]
                          ? "cursor-pointer hover:text-blue-400"
                          : ""
                      }`}
                      onClick={() =>
                        !isFixedExercisesEditable &&
                        handleExerciseClick(index, exerciseIndex)
                      } // Only allow click if not editing
                      title={
                        !isFixedExercisesEditable &&
                        fixedWeeklyExercises[index]?.[exerciseIndex]
                          ? `Go to ${fixedWeeklyExercises[index][
                               exerciseIndex
                            ].replace("-", " ")} exercises`
                          : ""
                      }
                    >
                      {isFixedExercisesEditable ? (
                        <select
                          value={fixedWeeklyExercises[index]?.[exerciseIndex] || ""} // Handle potential undefined value
                          onChange={(e) =>
                            handleExerciseChange(
                              index,
                              exerciseIndex,
                              e.target.value
                            )
                          }
                          className="bg-gray-700 text-white p-1 rounded w-full text-sm md:text-base"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking select
                        >
                          <option value="">-- Select --</option>
                          {availableExercises.map((exercise) => (
                            <option
                              key={exercise}
                              value={exercise}
                              className="capitalize"
                            >
                              {exercise.charAt(0).toUpperCase() +
                                exercise.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="capitalize">
                          {fixedWeeklyExercises[index]?.[exerciseIndex]
                            ? fixedWeeklyExercises[index][exerciseIndex].replace(
                                "-",
                                " "
                              ) // Display hyphenated names nicely
                            : <span className="text-gray-500">Not Set</span>} {/* Handle empty/undefined */}
                        </span>
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
              className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition shadow"
            >
              Save Plan
            </button>
          )}
        </div>

        {/* Workout Logging Section - Now Saves to Firestore */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">✍️ Log Your Workout</h2>
            <form onSubmit={handleLogWorkout} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="logDate" className="block text-sm font-medium text-gray-400">Date</label>
                    <input
                        type="date"
                        id="logDate"
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        max={formatDate(new Date())} // Prevent logging future dates
                    />
                </div>
                 <div>
                    <label htmlFor="logDuration" className="block text-sm font-medium text-gray-400">Duration (mins)</label>
                    <input
                        type="number"
                        id="logDuration"
                        value={logDuration}
                        onChange={(e) => setLogDuration(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        min="0"
                    />
                </div>
                 <div>
                    <label htmlFor="logSteps" className="block text-sm font-medium text-gray-400">Steps</label>
                    <input
                        type="number"
                        id="logSteps"
                        value={logSteps}
                        onChange={(e) => setLogSteps(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        min="0"
                    />
                </div>
                 {/* Simple Exercise Selection (using a multiselect or checkboxes could be better) */}
                 {/* For simplicity, let's use a basic select for the first primary exercise done */}
                 <div>
                    <label htmlFor="logExercises" className="block text-sm font-medium text-gray-400">Main Exercise(s) (Optional)</label>
                    <select
                         id="logExercises"
                         value={logExercises[0] || ""} // Assuming only one main exercise for simplicity in this select
                         onChange={(e) => setLogExercises(e.target.value ? [e.target.value] : [])} // Store as array
                         className="mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                     >
                         <option value="">-- Select --</option>
                         {availableExercises.map(exercise => (
                             <option key={exercise} value={exercise} className="capitalize">
                                 {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                             </option>
                         ))}
                     </select>
                </div>

                <div className="md:col-span-2 lg:col-span-4 text-center"> {/* Button spanning columns */}
                     <button
                         type="submit"
                         className="bg-emerald-600 px-6 py-2 rounded-md font-semibold hover:bg-emerald-500 transition shadow"
                     >
                         Log Workout
                     </button>
                </div>
            </form>
        </div>

        {/* Progress Section (Chart and Progress Bars) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Chart (currently uses example data) */}
          {/* To make this dynamic, fetch current week's data from Firestore */}
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg col-span-1 md:col-span-3 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-3 text-gray-200">
              Workout Trend (This Week - Example Data)
            </h2>
            <div className="flex-grow flex items-center justify-center">
                 <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          {/* Workout Duration (using today's logged form data for simplicity) */}
          {/* To make this dynamic, fetch today's log from Firestore on mount */}
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
            <ProgressBar
              label="Today's Workout Duration (Form Value)"
              percentage={Math.min(100, (todaysWorkoutDuration / workoutGoal) * 100)}
              valueText={`${todaysWorkoutDuration} / ${workoutGoal} mins`}
            />
          </div>
          {/* Step Tracker (using today's logged form data for simplicity) */}
          {/* To make this dynamic, fetch today's log from Firestore on mount */}
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
            <ProgressBar
              label="Today's Steps (Form Value)"
              percentage={Math.min(100, (todaysSteps / stepsGoal) * 100)}
              valueText={`${todaysSteps} / ${stepsGoal} steps`}
            />
          </div>
        </div>

        {/* --- REMOVE: Recent Workout Logs Section --- */}
        {/* This section was for displaying recent logs from localStorage */}
        {/* It is now handled by the dedicated history page that fetches from Firestore */}
        {/* <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg mb-10"> ... </div> */}


        {/* Yoga Section (kept as is) */}
         <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg text-center mb-10">
             <h2 className="text-xl font-semibold mb-4 text-gray-200">🧘‍♀️ Today's Yoga Goal</h2>
             <div className="max-w-md mx-auto">
                 {/* This progress bar still uses general duration from form state */}
                 {/* To make this dynamic, fetch today's log from Firestore on mount */}
                 <ProgressBar
                     label="Yoga Session (Form Value)"
                     percentage={Math.min(100,(todaysWorkoutDuration / yogaGoal) * 100)}
                     valueText={`${todaysWorkoutDuration} minutes logged`}
                 />
             </div>
             <button
                 onClick={() => navigate("/exercises/yoga")} // Ensure this route exists in App.js
                 className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-500 transition shadow"
             >
                 Explore Yoga Poses
             </button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
