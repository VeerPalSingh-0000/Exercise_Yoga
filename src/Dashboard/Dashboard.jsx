import React, { useState, useEffect, useCallback, useMemo } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { FiLoader, FiEdit, FiSave, FiX } from "react-icons/fi";
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
// ✅ CORRECT
import { FaTable, FaWalking, FaSeedling } from "react-icons/fa";
import { FaPersonRunning } from "react-icons/fa6";
import { GiBiceps, GiLotus } from "react-icons/gi";

import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useUserGoals,
  useWorkoutProgress,
  useNutritionProgress,
  useChartData,
  useWeeklySchedule,
  useFixedExercises,
} from "./hooks";
import { ProgressBar, CircularProgress, WeeklyPlan } from "./ui";
import {
  MACRO_NUTRIENTS,
  // CORRECTED: Renamed the default import to avoid conflicts and indicate it's a default.
  NUTRITION_GOALS as DEFAULT_NUTRITION_GOALS,
  NUTRITION_UNITS,
  FITNESS_GOALS,
  // CORRECTED: Imported AVAILABLE_EXERCISES at the top level.
  AVAILABLE_EXERCISES,
} from "./constants";
import NutritionGoalsModal from "./NutritionGoalsModal";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Dashboard = () => {
  const navigate = useNavigate();
  // CORRECTED: Initialized with null for clarity. The effect will populate it.
  const [currentUser, setCurrentUser] = useState(null);
  const [showNutritionEdit, setShowNutritionEdit] = useState(false);
  const [nutritionWeight, setNutritionWeight] = useState("70");

  // CORRECTED: Introduced state for nutrition goals instead of mutating an imported constant.
  const [nutritionGoals, setNutritionGoals] = useState(DEFAULT_NUTRITION_GOALS);

  const { goals, updateGoal } = useUserGoals();
  const { schedule, saveSchedule } = useWeeklySchedule();
  const { fixedExercises, saveExercises } = useFixedExercises();

  const [isWeeklyPlanEditable, setIsWeeklyPlanEditable] = useState(false);
  const [isDailyPlanEditable, setIsDailyPlanEditable] = useState(false);
  const [tempSchedule, setTempSchedule] = useState(schedule);
  const [tempFixedExercises, setTempFixedExercises] = useState(fixedExercises);

  const { progressData, isLoading: isLoadingProgress } =
    useWorkoutProgress(currentUser);
  const { nutritionData, isLoading: isLoadingNutrition } =
    useNutritionProgress(currentUser);
  const { chartData, isLoading: isLoadingChart } = useChartData(currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
      else navigate("/", { replace: true });
    });
    return unsubscribe;
  }, [navigate]);

  // CORRECTED: This effect now properly updates component state from localStorage.
  useEffect(() => {
    const savedGoals = localStorage.getItem("userNutritionGoals");
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        // Use the state setter function to merge saved goals with defaults.
        setNutritionGoals((prevGoals) => ({ ...prevGoals, ...parsedGoals }));
      } catch (error) {
        console.error(
          "Failed to parse nutrition goals from localStorage:",
          error
        );
      }
    }
  }, []);

  useEffect(() => setTempSchedule(schedule), [schedule]);
  useEffect(() => setTempFixedExercises(fixedExercises), [fixedExercises]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      // CORRECTED: Added error logging.
      console.error("Error signing out:", error);
    }
  }, [navigate]);

  const handleExerciseNavigation = useCallback(
    (exerciseName) => {
      if (exerciseName) navigate(`/exercises/${exerciseName.toLowerCase()}`);
    },
    [navigate]
  );

  const handleWeeklyPlanSave = () => {
    saveSchedule(tempSchedule);
    setIsWeeklyPlanEditable(false);
  };

  const handleDailyPlanSave = () => {
    saveExercises(tempFixedExercises);
    setIsDailyPlanEditable(false);
  };

  // CORRECTED: Added handlers to reset temp state on cancellation.
  const handleWeeklyPlanCancel = () => {
    setIsWeeklyPlanEditable(false);
    setTempSchedule(schedule);
  };

  const handleDailyPlanCancel = () => {
    setIsDailyPlanEditable(false);
    setTempFixedExercises(fixedExercises);
  };

  // This function is called when the nutrition modal is closed.
  // It re-syncs the state from localStorage, assuming the modal updated it.
  const handleNutritionModalClose = () => {
    setShowNutritionEdit(false);
    const savedGoals = localStorage.getItem("userNutritionGoals");
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setNutritionGoals((prev) => ({ ...prev, ...parsedGoals }));
      } catch (error) {
        console.error(
          "Failed to parse nutrition goals from localStorage:",
          error
        );
      }
    }
  };

  const handleWeeklyExerciseChange = (dayIndex, exerciseIndex, value) => {
    const newSchedule = JSON.parse(JSON.stringify(tempSchedule));
    newSchedule[dayIndex][exerciseIndex] = value || undefined;
    setTempSchedule(newSchedule);
  };

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "#374151" },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  const todayIndex = useMemo(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  }, []);

  // CORRECTED: Cleaned up rendering logic by pre-filtering the array.
  const dailyExercisesToShow = tempFixedExercises.filter(Boolean);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <FiLoader className="animate-spin text-emerald-400 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <main className="pt-24 pb-10 flex-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-100">
            Welcome, {currentUser.displayName || "Fitness Pro"}!
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {/* Workout Trend Chart */}
            <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col min-h-[220px]">
              <h3 className="text-base font-semibold mb-3 text-gray-100">
                Workout Trend (7 Days)
              </h3>
              <div className="flex-grow min-h-[180px]">
                {isLoadingChart ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    Loading Chart...
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
            {/* Progress Bars */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
                <ProgressBar
                  label="Workout Duration"
                  percentage={
                    goals.WORKOUT_DURATION > 0
                      ? (progressData.duration / goals.WORKOUT_DURATION) * 100
                      : 0
                  }
                  valueText={`${progressData.duration} / ${goals.WORKOUT_DURATION} mins`}
                  icon={<FaPersonRunning size="1.1em" />}
                  isLoading={isLoadingProgress}
                  goal={goals.WORKOUT_DURATION}
                  onGoalChange={(v) => updateGoal("WORKOUT_DURATION", v)}
                />
              </div>
              <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
                <ProgressBar
                  label="Daily Steps"
                  percentage={
                    goals.DAILY_STEPS > 0
                      ? (progressData.steps / goals.DAILY_STEPS) * 100
                      : 0
                  }
                  valueText={`${progressData.steps} / ${goals.DAILY_STEPS} steps`}
                  icon={<FaWalking size="1.1em" />}
                  isLoading={isLoadingProgress}
                  goal={goals.DAILY_STEPS}
                  onGoalChange={(v) => updateGoal("DAILY_STEPS", v)}
                />
              </div>
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-gray-900 p-4 rounded-xl shadow-lg mb-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-100 flex items-center">
                <FaSeedling className="mr-2 text-green-400" />
                Today's Nutrition
              </h3>
              <button
                onClick={() => setShowNutritionEdit(true)}
                className="flex items-center bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-400 text-xs font-medium text-gray-900"
                title="Edit nutrition goals"
              >
                <FiEdit className="mr-1" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {MACRO_NUTRIENTS.map((n) => (
                <CircularProgress
                  // CORRECTED: The key no longer needs the versioning trick.
                  key={n}
                  label={n.charAt(0) + n.slice(1).toLowerCase()}
                  // CORRECTED: Reads from the 'nutritionGoals' state object.
                  percentage={
                    ((nutritionData[n.toLowerCase()] || 0) /
                      (nutritionGoals[n] || 1)) *
                    100
                  }
                  current={nutritionData[n.toLowerCase()] || 0}
                  goal={nutritionGoals[n]}
                  unit={NUTRITION_UNITS[n]}
                  color={
                    n === "CALORIES"
                      ? "#f59e0b"
                      : n === "PROTEIN"
                      ? "#ef4444"
                      : n === "CARBS"
                      ? "#3b82f6"
                      : "#10b981"
                  }
                  isLoading={isLoadingNutrition}
                />
              ))}
            </div>
            <button
              onClick={() => navigate("/nutrition-history")}
              className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500 text-sm mt-4"
            >
              View Nutrition History
            </button>
            {showNutritionEdit && (
              <NutritionGoalsModal
                weight={nutritionWeight}
                setWeight={setNutritionWeight}
                // CORRECTED: Pass the new handler to sync state when the modal closes.
                closeModal={handleNutritionModalClose}
              />
            )}
          </div>

          {/* Weekly & Daily Plan */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-6">
            <div className="lg:col-span-3 bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="text-base font-semibold text-gray-100 flex items-center">
                  <FaTable className="mr-2 text-emerald-400" /> Weekly Schedule
                </h3>
                <div className="flex items-center space-x-2">
                  {isWeeklyPlanEditable ? (
                    <>
                      <button
                        onClick={handleWeeklyPlanSave}
                        className="flex items-center bg-emerald-600 px-3 py-1 rounded-md hover:bg-emerald-500 text-xs font-medium"
                      >
                        <FiSave className="mr-1" /> Save
                      </button>
                      {/* CORRECTED: Use handler that resets state on cancel. */}
                      <button
                        onClick={handleWeeklyPlanCancel}
                        className="flex items-center bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-500 text-xs font-medium"
                      >
                        <FiX className="mr-1" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsWeeklyPlanEditable(true)}
                      className="flex items-center bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-400 text-xs font-medium text-gray-900"
                    >
                      <FiEdit className="mr-1" /> Change
                    </button>
                  )}
                </div>
              </div>
              <WeeklyPlan
                schedule={isWeeklyPlanEditable ? tempSchedule : schedule}
                isEditable={isWeeklyPlanEditable}
                onExerciseClick={handleExerciseNavigation}
                onExerciseChange={handleWeeklyExerciseChange}
                highlightIndex={todayIndex}
              />
            </div>
            <div className="lg:col-span-2 bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="text-base font-semibold text-gray-100 flex items-center">
                  <GiBiceps className="mr-2 text-emerald-400" /> Daily Routine
                </h3>
                <div className="flex items-center space-x-2">
                  {isDailyPlanEditable ? (
                    <>
                      <button
                        onClick={handleDailyPlanSave}
                        className="flex items-center bg-emerald-600 px-3 py-1 rounded-md hover:bg-emerald-500 text-xs font-medium"
                      >
                        <FiSave className="mr-1" /> Save
                      </button>
                      <button
                        onClick={handleDailyPlanCancel}
                        className="flex items-center bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-500 text-xs font-medium"
                      >
                        <FiX className="mr-1" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsDailyPlanEditable(true)}
                      className="flex items-center bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-400 text-xs font-medium text-gray-900"
                    >
                      <FiEdit className="mr-1" /> Change
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Fixed exercises to complete every day.
              </p>
              <div
                className="flex flex-col gap-2 overflow-y-auto px-2"
                style={{ flex: 1 }}
              >
                {isDailyPlanEditable ? (
                  <>
                    {/* CORRECTED: Map over the actual state array, not a fixed array */}
                    {tempFixedExercises.map((exercise, idx) => (
                      // ADDED: A key and a container for the select and remove button
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={exercise || ""}
                          onChange={(e) => {
                            const newArr = [...tempFixedExercises];
                            newArr[idx] = e.target.value || undefined;
                            setTempFixedExercises(newArr);
                          }}
                          className="flex-grow bg-gray-700 p-2 rounded text-xs capitalize"
                        >
                          <option value="">- Empty -</option>
                          {AVAILABLE_EXERCISES.map((ex) => (
                            <option key={ex} value={ex} className="capitalize">
                              {ex}
                            </option>
                          ))}
                        </select>
                        {/* ADDED: Remove button for each exercise */}
                        <button
                          onClick={() => {
                            const newArr = tempFixedExercises.filter(
                              (_, i) => i !== idx
                            );
                            setTempFixedExercises(newArr);
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                          title="Remove exercise"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    {/* ADDED: "Add Exercise" button to append a new slot */}
                    <button
                      onClick={() =>
                        setTempFixedExercises([...tempFixedExercises, ""])
                      }
                      className="mt-2 text-xs bg-emerald-700 hover:bg-emerald-600 px-3 py-1 rounded self-start"
                    >
                      Add Exercise
                    </button>
                  </>
                ) : dailyExercisesToShow.length > 0 ? (
                  dailyExercisesToShow.map((ex, exIndex) => (
                    <span
                      key={exIndex}
                      onClick={() => handleExerciseNavigation(ex)}
                      className="bg-gray-700 capitalize text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:bg-emerald-600 transition-colors"
                    >
                      {ex}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    No daily exercises set.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Yoga & Flexibility */}
          <div className="bg-gray-900 p-4 rounded-xl shadow-lg text-center border border-gray-700">
            <h3 className="text-base font-semibold mb-3 text-gray-100 flex items-center justify-center">
              <GiLotus className="mr-2 text-purple-400" /> Yoga & Flexibility
            </h3>
            <div className="max-w-xs mx-auto mb-4">
              <ProgressBar
                label="Flexibility Goal"
                percentage={
                  goals.YOGA_DURATION > 0
                    ? (progressData.yogaDuration / goals.YOGA_DURATION) * 100
                    : 0
                }
                valueText={`${progressData.yogaDuration} / ${goals.YOGA_DURATION} mins`}
                // CORRECTED: Changed icon for UI consistency.
                icon={<GiLotus size="1.1em" className="text-purple-400" />}
                isLoading={isLoadingProgress}
                goal={goals.YOGA_DURATION}
                onGoalChange={(v) => updateGoal("YOGA_DURATION", v)}
              />
            </div>
            <button
              onClick={() => navigate("/yoga")}
              className="inline-flex items-center bg-purple-600 px-4 py-2 rounded-md font-semibold text-white hover:bg-purple-500 text-sm"
            >
              Explore Yoga Routines
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
