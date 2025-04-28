// src/pages/Dashboard.js

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import auth
import { db } from "../firebase"; // Import db for Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions
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
  Filler, // Import Filler for the 'fill' option
} from "chart.js";

// CORRECTED IMPORT BLOCK:
import {
    FiLogOut,
    FiEye,
    FiEdit,
    FiSave,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiActivity,
    FiX,
    FiTrendingUp,
    
  } from 'react-icons/fi';
  import { FaTable, FaWalking, FaSeedling } from 'react-icons/fa'; // Icons available in fa (Font Awesome 5)
  import { FaPersonRunning, FaDumbbell, FaShoePrints } from 'react-icons/fa6'; // Icons from Font Awesome 6 (Use FaShoePrints OR FaWalking for Steps input)
  import { GiMuscleUp, GiLotus } from 'react-icons/gi';

// Register chart.js components including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register Filler
);

// Default weekly exercise schedule
const defaultWeeklySchedule = [
  ["chest", "tricep"], ["back", "bicep"], ["leg", "shoulder"],
  ["chest", "abs"], ["back", "tricep"], ["leg", "bicep"],
];

// Helper function to format date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Weekly Plan State
  const [fixedWeeklyExercises, setFixedWeeklyExercises] = useState(defaultWeeklySchedule);
  const [isFixedExercisesEditable, setIsFixedExercisesEditable] = useState(false);
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const availableExercises = ["chest", "bicep", "tricep", "leg", "shoulder", "back", "abs", "yoga", "running", "cardio"]; // Added more options

  // Workout Logging State
  const [logDate, setLogDate] = useState(formatDate(new Date()));
  const [logDuration, setLogDuration] = useState(""); // Use empty string for better placeholder behavior
  const [logSteps, setLogSteps] = useState(""); // Use empty string for better placeholder behavior
  const [logWorkoutExercises, setLogWorkoutExercises] = useState([]); // State for selected exercises in log

  // --- Load Fixed Weekly Schedule from localStorage ---
  useEffect(() => {
    const savedFixedWeeklyExercises = localStorage.getItem("userFixedWeeklyExercises");
    if (savedFixedWeeklyExercises) {
      try {
        const parsedExercises = JSON.parse(savedFixedWeeklyExercises);
        if (Array.isArray(parsedExercises) && parsedExercises.length === 6) {
          setFixedWeeklyExercises(parsedExercises);
        } else {
          console.warn("Invalid exercise data found in localStorage. Using default.");
          localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(defaultWeeklySchedule)); // Save default if invalid
          setFixedWeeklyExercises(defaultWeeklySchedule); // Also set state to default
        }
      } catch (error) {
        console.error("Failed to parse saved exercises:", error);
        localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(defaultWeeklySchedule)); // Save default on error
        setFixedWeeklyExercises(defaultWeeklySchedule); // Also set state to default
      }
    } else {
      // If nothing is saved, save the default schedule
      localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(defaultWeeklySchedule));
      setFixedWeeklyExercises(defaultWeeklySchedule); // Ensure state matches
    }
  }, []);

  // --- Logout Handler ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert(`Logout failed: ${error.message}`); // Provide user feedback
    }
  };

  // --- Weekly Plan Handlers ---
  const handleExerciseClick = (index, exerciseIndex) => {
    if (isFixedExercisesEditable) return;
    const exerciseName = fixedWeeklyExercises[index]?.[exerciseIndex];
    if (exerciseName) {
      navigate(`/exercises/${exerciseName}`);
    }
  };

  const handleSaveFixedExercises = () => {
    // Ensure all days have at least empty arrays if nothing selected
    const scheduleToSave = fixedWeeklyExercises.map(day => day || []);
    localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(scheduleToSave));
    setIsFixedExercisesEditable(false);
    alert("Weekly plan saved successfully!");
  };

  const toggleFixedExercisesEdit = () => {
     // If canceling edit (current state is true), reload from localStorage to discard changes
     if (isFixedExercisesEditable) {
         const savedExercises = localStorage.getItem("userFixedWeeklyExercises");
         if (savedExercises) {
             try {
                 const parsedExercises = JSON.parse(savedExercises);
                 // Basic validation before setting state
                 if (Array.isArray(parsedExercises) && parsedExercises.length === 6) {
                    setFixedWeeklyExercises(parsedExercises);
                 } else {
                    // Handle case where localStorage might have become corrupt between page load and cancel
                    console.warn("Invalid data found in localStorage on cancel. Reverting to default.");
                    setFixedWeeklyExercises(defaultWeeklySchedule);
                    localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(defaultWeeklySchedule));
                 }
             } catch (e) {
                 console.error("Error reloading exercises from localStorage", e);
                 // Optionally revert to default or keep current state
                 setFixedWeeklyExercises(defaultWeeklySchedule);
                 localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(defaultWeeklySchedule));
             }
         } else {
             // If localStorage was cleared somehow, revert to default
             setFixedWeeklyExercises(defaultWeeklySchedule);
         }
     }
    setIsFixedExercisesEditable(prev => !prev); // Toggle the state *after* potentially reloading
  };


  const handleExerciseChange = (index, exerciseIndex, selectedExercise) => {
    const updatedExercises = fixedWeeklyExercises.map((dayExercises, i) => {
      if (i === index) {
        // Ensure dayExercises is an array before spreading
        const currentDay = Array.isArray(dayExercises) ? [...dayExercises] : [];
        currentDay[exerciseIndex] = selectedExercise;
        // Optional: Remove empty strings if 'None' or '-- Select --' is chosen,
        // or keep them based on desired behavior (e.g., for saving later)
        // If you want to remove the item if 'None' ('') is selected:
        // if (!selectedExercise) {
        //     currentDay.splice(exerciseIndex, 1); // Remove item at index
        // } else {
        //     currentDay[exerciseIndex] = selectedExercise;
        // }
        return currentDay;
      }
      return dayExercises;
    });
    setFixedWeeklyExercises(updatedExercises);
  };

  // --- Workout Logging Handler (Saves to Firestore) ---
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!logDate) {
      alert("Please select a date.");
      return;
    }
    // Parse inputs, treat empty strings or invalid numbers as 0
    const durationValue = parseInt(logDuration, 10) || 0;
    const stepsValue = parseInt(logSteps, 10) || 0;

    // Validation: Ensure at least one metric is logged
    if (durationValue <= 0 && stepsValue <= 0 && logWorkoutExercises.length === 0) {
        alert("Please log a valid duration, steps, or select an exercise focus.");
        return;
    }


    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to log workouts.");
      navigate("/login");
      return;
    }

    const workoutData = {
      userId: user.uid,
      // Store date as a Firestore Timestamp for better querying
      date: new Date(logDate + 'T00:00:00Z'), // Use UTC time to avoid timezone issues on storage
      duration: durationValue,
      steps: stepsValue,
      exercises: logWorkoutExercises, // Save the array of exercises (currently max 1 from form)
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "workoutLogs"), workoutData);
      console.log("Workout log written with ID: ", docRef.id);
      alert(`Workout logged for ${logDate} successfully!`);
      // Reset form fields after successful logging
      // setLogDate(formatDate(new Date())); // Keep date or reset? Keep for potentially logging multiple entries for the same day
      setLogDuration(""); // Reset to empty string
      setLogSteps(""); // Reset to empty string
      setLogWorkoutExercises([]);
    } catch (error) {
      console.error("Error adding workout document: ", error);
      alert(`Failed to log workout. Error: ${error.message}`);
    }
  };


  // --- Chart Data & Options (Using Example Data) ---
  // TODO: Implement logic to fetch actual workout log data from Firestore
  // and update the chartData state dynamically based on the fetched data.
  const getWorkoutDataForChart = () => {
    // Example static data - replace with fetched data
    const exampleData = [45, 50, 40, 55, 60, 48]; // Example durations
    const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Example days

    return {
      labels: chartLabels,
      datasets: [{
          label: "Workout Duration (mins)",
          data: exampleData,
          borderColor: "rgb(52, 211, 153)", // Emerald-500
          backgroundColor: "rgba(52, 211, 153, 0.2)", // Emerald-500 with opacity
          tension: 0.3, // Smoother curve
          fill: true, // Fill area under line
          pointBackgroundColor: "rgb(52, 211, 153)",
          pointBorderColor: "#fff",
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "rgb(52, 211, 153)",
          pointHoverBorderColor: "#fff",
        }],
    };
  };
  const chartData = getWorkoutDataForChart(); // Calculate chart data

  // Chart options using updated colors for the darker theme
  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { position: 'top', labels: { color: '#e5e7eb' } }, // Gray-200 (brighter)
          title: { display: false }, // Title is in the h2 above
          tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: '#fff',
              bodyColor: '#fff',
              padding: 10,
              cornerRadius: 4,
          }
      },
      scales: {
          x: {
              ticks: { color: '#9ca3af' }, // Gray-400
              grid: { color: '#374151' }, // Gray-700 (darker grid)
              border: { color: '#4b5563' } // Gray-600 axis line
          },
          y: {
              ticks: { color: '#9ca3af' }, // Gray-400
              grid: { color: '#374151' }, // Gray-700 (darker grid)
              border: { color: '#4b5563' }, // Gray-600 axis line
              beginAtZero: true,
          },
      }
  };

  // --- Progress Bar Data (Currently uses manually logged form data) ---
  // TODO: Fetch today's actual logged workout data from Firestore to update these dynamically
  // These should ideally come from a state updated by fetching today's logs, not the form inputs.
  const todaysWorkoutDuration = parseInt(logDuration, 10) || 0; // Example: use state from form for now
  const todaysSteps = parseInt(logSteps, 10) || 0; // Example: use state from form for now
  const workoutGoal = 60; // Example daily workout duration goal in minutes
  const stepsGoal = 10000; // Example daily steps goal
  const yogaGoal = 30; // Example daily yoga duration goal in minutes
  // TODO: Consider if Yoga/Flexibility duration should be logged separately or derived differently.
  // Currently, it uses todaysWorkoutDuration which might not be accurate if yoga wasn't the logged activity.
  const todaysYogaDuration = todaysWorkoutDuration; // Placeholder logic

  // --- Progress Bar Component ---
  const ProgressBar = ({ label, percentage, valueText, icon }) => {
      const displayPercentage = Math.min(100, Math.max(0, percentage));
      return (
        // Use a slightly darker inner background for contrast
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full flex flex-col justify-center">
          <div className="flex items-center mb-2">
              {icon && <span className="text-emerald-400 mr-2">{icon}</span>}
              <h3 className="text-base font-semibold text-gray-200">{label}</h3>
          </div>
          <div className="relative pt-1">
              <div className="flex mb-1 items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">{valueText}</span>
                  <span className="text-sm font-medium text-gray-400">{displayPercentage.toFixed(0)}%</span>
              </div>
              {/* Darker track for the progress bar */}
              <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded bg-gray-700">
                  <div
                      style={{ width: `${displayPercentage}%` }}
                      // Added transition, easing, and rounded corners to the bar itself
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-out rounded"
                  ></div>
              </div>
          </div>
        </div>
      );
  };


  // Calculate highlight index for the weekly plan
  const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const highlightIndex = todayIndex === 0 ? -1 : todayIndex - 1; // Monday=0, Sunday=-1 (no highlight)

  // --- Component Return JSX ---
  return (
    // Darker main background, lighter default text, more padding
    <div className="min-h-screen bg-gray-950 text-gray-200 relative px-4 sm:px-6 lg:px-8 py-6">

      {/* Top Buttons: History & Logout - Adjusted padding/focus */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <button
            onClick={() => navigate("/history")}
            className="flex items-center bg-blue-600 text-sm px-4 py-1.5 rounded-md font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-blue-500 transition duration-150 ease-in-out shadow"
            title="View Workout History"
            >
            <FiEye className="mr-1.5" /> {/* Icon */}
            History
          </button>
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 text-sm px-4 py-1.5 rounded-md font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-red-500 transition duration-150 ease-in-out shadow"
            title="Logout"
            >
             <FiLogOut className="mr-1.5" /> {/* Icon */}
            Logout
          </button>
      </div>

      {/* Dashboard Main Content */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-20"> {/* Increased top margin */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-100">
          <GiMuscleUp className="inline mr-2 text-emerald-400" /> Your Fitness Dashboard
        </h1>

        {/* Row 1: Weekly Plan */}
        {/* Darker card, more padding, border */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center mb-8 overflow-x-auto border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-left text-gray-100 flex items-center">
                <FaTable className="mr-2 text-emerald-400"/> Weekly Workout Plan
              </h2>
              {/* Consistent button style */}
              <button
                onClick={toggleFixedExercisesEdit}
                className="flex items-center bg-yellow-500 text-sm px-4 py-1.5 rounded-md hover:bg-yellow-400 transition duration-150 ease-in-out text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 shadow whitespace-nowrap"
               >
                {isFixedExercisesEditable ? <><FiX className="mr-1.5"/> Cancel Edit</> : <><FiEdit className="mr-1.5"/> Change Plan</>}
              </button>
            </div>
            {isFixedExercisesEditable && (
              <p className="text-sm text-yellow-400 mb-4 text-left">Editing enabled. Choose exercises and click save below.</p>
            )}
           {/* Use table-fixed for more consistent column widths */}
           <table className="min-w-full w-full table-fixed border-collapse border border-gray-700">
               <thead>
                 {/* Darker header row */}
                 <tr className="bg-gray-800">
                   {/* Set widths, style header */}
                   <th className="w-1/4 p-3 border border-gray-700 text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-left sm:text-center">Day</th>
                   <th className="w-3/8 p-3 border border-gray-700 text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-left sm:text-center">Exercise 1</th>
                   <th className="w-3/8 p-3 border border-gray-700 text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-left sm:text-center">Exercise 2</th>
                 </tr>
               </thead>
               <tbody>
                 {dayNames.map((day, index) => (
                   // Darker highlight, subtler hover
                   <tr key={index} className={`${index === highlightIndex ? "bg-emerald-900 bg-opacity-60" : "bg-gray-900 hover:bg-gray-800/60"} transition-colors duration-150`}>
                     <td className="p-3 border border-gray-700 text-left sm:text-center font-medium text-gray-300">{day}</td>
                     {[0, 1].map((exerciseIndex) => (
                       <td key={exerciseIndex}
                           className={`p-1 sm:p-2 border border-gray-700 text-center ${!isFixedExercisesEditable && fixedWeeklyExercises[index]?.[exerciseIndex] ? "cursor-pointer group" : ""}`}
                           onClick={() => !isFixedExercisesEditable && fixedWeeklyExercises[index]?.[exerciseIndex] && handleExerciseClick(index, exerciseIndex)}
                           title={!isFixedExercisesEditable && fixedWeeklyExercises[index]?.[exerciseIndex] ? `Go to ${fixedWeeklyExercises[index][exerciseIndex].replace("-", " ")} exercises` : (isFixedExercisesEditable ? "Select an exercise" : "")}
                       >
                         {isFixedExercisesEditable ? (
                           // Improved select styling
                           <select
                               value={fixedWeeklyExercises[index]?.[exerciseIndex] || ""}
                               onChange={(e) => handleExerciseChange(index, exerciseIndex, e.target.value)}
                               className="bg-gray-700 border border-gray-600 text-gray-200 p-2 rounded w-full text-sm md:text-base focus:ring-emerald-500 focus:border-emerald-500 appearance-none text-center"
                               onClick={(e) => e.stopPropagation()} // Prevent row click when clicking select
                           >
                             <option value="">-- Select --</option>
                             {/* Add 'None' option explicitly if needed for clarity */}
                             <option value="">None</option>
                             {availableExercises.map((exercise) => (
                                 <option key={exercise} value={exercise} className="capitalize">
                                     {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                                 </option>
                             ))}
                           </select>
                         ) : (
                           <span className="capitalize px-2 py-1 inline-block group-hover:text-emerald-400 transition-colors duration-150">
                             {fixedWeeklyExercises[index]?.[exerciseIndex] ? fixedWeeklyExercises[index][exerciseIndex].replace("-", " ") : <span className="text-gray-600 italic text-xs">Empty</span>} {/* Different style for 'Empty' */}
                           </span>
                         )}
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
           </table>
           {isFixedExercisesEditable && (
             // Consistent button style for Save
             <div className="mt-6 text-center">
               <button
                   onClick={handleSaveFixedExercises}
                   className="flex items-center justify-center mx-auto bg-green-600 px-6 py-2 rounded-md font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition duration-150 ease-in-out shadow-md"
               >
                   <FiSave className="mr-1.5" /> Save Plan
               </button>
             </div>
           )}
        </div>

        {/* Row 2: Logging Sections - Single column, increased gap/margin */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Workout Logging Section */}
          {/* Darker card, border */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100 flex items-center">
              <FiActivity className="mr-2 text-emerald-400" /> Log Today's Activity
            </h2>
            {/* Increased space between form elements */}
            <form onSubmit={handleLogWorkout} className="space-y-5">
                {/* Date Input */}
                <div>
                  {/* Added margin bottom to label */}
                  <label htmlFor="logDate" className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><FiCalendar className="mr-1.5"/> Date</label>
                  {/* Enhanced input style */}
                  <input
                      type="date"
                      id="logDate"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm py-2 px-3"
                      max={formatDate(new Date())} // Prevent logging future dates
                      required // Make date required
                  />
                </div>
                {/* Duration & Steps */}
                {/* Stack on small screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="logDuration" className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><FiClock className="mr-1.5"/> Duration (mins)</label>
                      <input
                          type="number"
                          id="logDuration"
                          value={logDuration}
                          onChange={(e) => setLogDuration(e.target.value)}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm py-2 px-3"
                          min="0"
                          placeholder="e.g., 30"
                      />
                    </div>
                    <div>
                    <label htmlFor="logSteps" className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
    <FaWalking className="mr-1.5"/> {/* Replaced! */}
    Steps
</label>
                      <input
                          type="number"
                          id="logSteps"
                          value={logSteps}
                          onChange={(e) => setLogSteps(e.target.value)}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm py-2 px-3"
                          min="0"
                          placeholder="e.g., 5000"
                      />
                    </div>
                </div>
                 {/* Exercise Select (Workout) - Allow selecting one main focus */}
                 <div>
                   <label htmlFor="logWorkoutExercises" className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><FaDumbbell className="mr-1.5"/> Main Exercise Focus (Optional)</label>
                   {/* Enhanced select style */}
                   <select
                     id="logWorkoutExercises"
                     value={logWorkoutExercises[0] || ""} // Only handle one selection for simplicity here
                     onChange={(e) => setLogWorkoutExercises(e.target.value ? [e.target.value] : [])}
                     className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm py-2 px-3 appearance-none"
                   >
                     <option value="">-- Select Focus (Optional) --</option>
                     {availableExercises.map(exercise => (
                         <option key={exercise} value={exercise} className="capitalize">
                             {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                         </option>
                     ))}
                   </select>
                 </div>
                 {/* Submit Button */}
                 {/* Added padding top */}
                 <div className="text-center pt-3">
                   {/* Wider button, better focus */}
                   <button
                       type="submit"
                       className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 px-8 py-2.5 rounded-md font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition duration-150 ease-in-out shadow-md"
                   >
                       <FiCheckCircle className="mr-1.5" /> Log Activity
                   </button>
                 </div>
            </form>
          </div>
        </div>


        {/* Row 3: Progress Visualization - Increased gap/margin */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart */}
          {/* Darker card, border */}
          {/* Chart first on large screens using order classes */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg col-span-1 lg:col-span-1 flex flex-col border border-gray-700 order-first">
            <h2 className="text-lg font-semibold mb-4 text-gray-100 flex items-center">
              <FiTrendingUp className="mr-2 text-emerald-400"/> Workout Trend (Example)
            </h2>
             {/* TODO: Add loading state for chart */}
            {/* Slightly more height for chart */}
            <div className="flex-grow" style={{ minHeight: '250px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Progress Bars Container - Group progress bars, increased gap */}
          {/* Progress bars second on large screens (default order) */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* TODO: Add loading state for progress bars */}
              {/* Darker card, border */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700">
                  <ProgressBar
                      label="Workout Duration Goal"
                      percentage={workoutGoal > 0 ? Math.min(100, (todaysWorkoutDuration / workoutGoal) * 100) : 0}
                      valueText={`${todaysWorkoutDuration} / ${workoutGoal} mins`}
                      icon={<FaPersonRunning size="1.1em"/>} // Corrected icon usage
                      />
              </div>
              {/* Darker card, border */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700">
                  <ProgressBar
                      label="Daily Steps Goal"
                      percentage={stepsGoal > 0 ? Math.min(100, (todaysSteps / stepsGoal) * 100) : 0}
                      valueText={`${todaysSteps} / ${stepsGoal} steps`}
                      icon={<FaWalking size="1.1em"/>}
                      />
              </div>
          </div>
        </div>


        {/* Row 4: Yoga Section */}
        {/* Darker card, border */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center mb-10 border border-gray-700">
          {/* Larger heading */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 flex items-center justify-center">
            <GiLotus className="mr-2 text-purple-400"/> Today's Yoga / Flexibility
            </h2>
          {/* Added margin bottom */}
          <div className="max-w-md mx-auto mb-6">
            <ProgressBar
                label="Flexibility Goal"
                 // Use todaysYogaDuration which needs proper data source
                percentage={yogaGoal > 0 ? Math.min(100,(todaysYogaDuration / yogaGoal) * 100) : 0}
                valueText={`${todaysYogaDuration} / ${yogaGoal} mins`}
                // Custom purple icon color for yoga/flexibility
                icon={<FaSeedling size="1.1em" className="text-purple-400"/>}
            />
          </div>
          {/* Consistent button style */}
          <button
            onClick={() => navigate("/exercises/yoga")}
            className="inline-flex items-center bg-purple-600 px-6 py-2.5 rounded-md font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition duration-150 ease-in-out shadow-md"
            >
              Explore Yoga Poses
          </button>
        </div>

      </div> {/* End max-w-7xl */}
    </div> /* End main div */
  );
};

export default Dashboard;