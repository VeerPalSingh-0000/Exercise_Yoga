// src/pages/Dashboard.js

import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
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
  Filler,
} from "chart.js";
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
  FiLoader,
  FiSettings,
  FiAlertCircle,
} from 'react-icons/fi';
import { FaTable, FaWalking, FaSeedling } from 'react-icons/fa';
import { FaPersonRunning, FaDumbbell } from 'react-icons/fa6';
import { GiMuscleUp, GiLotus } from 'react-icons/gi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ======================== CONFIGURATION ========================
const FITNESS_GOALS = {
  WORKOUT_DURATION: 45,
  DAILY_STEPS: 5000,
  YOGA_DURATION: 25
};

const AVAILABLE_EXERCISES = [
  "chest", "bicep", "tricep", "leg", "shoulder", "back", 
  "abs", "yoga", "running", "cardio", "stretching", "pilates"
];

const DEFAULT_WEEKLY_SCHEDULE = [
  ["chest", "tricep"], ["back", "bicep"], ["leg", "shoulder"],
  ["chest", "abs"], ["back", "tricep"], ["leg", "bicep"],
];

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// ======================== NUTRITION CONFIGURATION ========================

const NUTRITION_GOALS = {
  CALORIES: 2000,
  PROTEIN: 150,    // grams
  CARBS: 250,      // grams
  FATS: 65,        // grams
  FIBER: 25,       // grams
  SUGAR: 50,       // grams
  SODIUM: 2300,    // mg
  VITAMIN_C: 90,   // mg
  VITAMIN_D: 20,   // mcg
  CALCIUM: 1000,   // mg
  IRON: 18,        // mg
  POTASSIUM: 3500  // mg
};

const NUTRITION_UNITS = {
  CALORIES: 'kcal',
  PROTEIN: 'g',
  CARBS: 'g', 
  FATS: 'g',
  FIBER: 'g',
  SUGAR: 'g',
  SODIUM: 'mg',
  VITAMIN_C: 'mg',
  VITAMIN_D: 'mcg',
  CALCIUM: 'mg',
  IRON: 'mg',
  POTASSIUM: 'mg'
};

const MACRO_NUTRIENTS = ['CALORIES', 'PROTEIN', 'CARBS', 'FATS'];
const MICRO_NUTRIENTS = ['FIBER', 'SUGAR', 'SODIUM', 'VITAMIN_C', 'VITAMIN_D', 'CALCIUM', 'IRON', 'POTASSIUM'];

const COMMON_FOODS = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, sodium: 74, vitamin_c: 0, vitamin_d: 0, calcium: 15, iron: 1, potassium: 256 },
  { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fats: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10, vitamin_c: 0, vitamin_d: 0, calcium: 20, iron: 0.8, potassium: 84 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, sodium: 1, vitamin_c: 10, vitamin_d: 0, calcium: 5, iron: 0.3, potassium: 422 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, sugar: 0, sodium: 59, vitamin_c: 0, vitamin_d: 11, calcium: 9, iron: 0.3, potassium: 363 },
  { name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fats: 0.3, fiber: 2.6, sugar: 1.5, sodium: 33, vitamin_c: 81, vitamin_d: 0, calcium: 43, iron: 0.7, potassium: 288 },
  { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fats: 0, fiber: 0, sugar: 9, sodium: 65, vitamin_c: 0, vitamin_d: 0, calcium: 230, iron: 0.1, potassium: 240 },
  { name: 'Oats (1 cup dry)', calories: 307, protein: 11, carbs: 55, fats: 5, fiber: 8, sugar: 1, sodium: 6, vitamin_c: 0, vitamin_d: 0, calcium: 42, iron: 3.4, potassium: 335 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fats: 14, fiber: 3.5, sugar: 1.2, sodium: 1, vitamin_c: 0, vitamin_d: 0, calcium: 76, iron: 1, potassium: 208 },
  { name: 'Whole Wheat Bread (1 slice)', calories: 69, protein: 3.6, carbs: 11.6, fats: 1.2, fiber: 1.9, sugar: 1.4, sodium: 144, vitamin_c: 0, vitamin_d: 0, calcium: 30, iron: 0.9, potassium: 69 },
  { name: 'Sweet Potato (1 medium)', calories: 112, protein: 2, carbs: 26, fats: 0.1, fiber: 3.9, sugar: 5.4, sodium: 7, vitamin_c: 22, vitamin_d: 0, calcium: 54, iron: 0.9, potassium: 542 },
  { name: 'Avocado (1/2 medium)', calories: 160, protein: 2, carbs: 8.5, fats: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7, vitamin_c: 10, vitamin_d: 0, calcium: 12, iron: 0.6, potassium: 485 },
  { name: 'Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fats: 10, fiber: 0, sugar: 1, sodium: 140, vitamin_c: 0, vitamin_d: 2, calcium: 50, iron: 1.2, potassium: 126 },
  { name: 'Coffee', calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 5, vitamin_c: 0, vitamin_d: 0, calcium: 5, iron: 0.1, potassium: 116 }
];

// ======================== UTILITY FUNCTIONS ========================
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateToUTCDayString = (dateObj) => {
  if (!dateObj) return "";
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStartOfDayUTC = (dateString) => {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return Timestamp.fromDate(date);
};

const getEndOfDayUTC = (dateString) => {
  const date = new Date(dateString + 'T23:59:59.999Z');
  return Timestamp.fromDate(date);
};

const validateWorkoutForm = (data) => {
  const errors = {};
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  if (data.duration && (data.duration < 0 || data.duration > 600)) {
    errors.duration = 'Duration must be between 0 and 600 minutes';
  }
  
  if (data.steps && (data.steps < 0 || data.steps > 100000)) {
    errors.steps = 'Steps must be between 0 and 100,000';
  }

  if (data.duration <= 0 && data.steps <= 0 && (!data.exercises || data.exercises.length === 0)) {
    errors.general = 'Please log a valid duration, steps, or select an exercise focus';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

// ======================== CUSTOM HOOKS ========================
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

const useUserGoals = () => {
  const [goals, setGoals] = useState(FITNESS_GOALS);

  useEffect(() => {
    const savedGoals = localStorage.getItem('userFitnessGoals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals({ ...FITNESS_GOALS, ...parsedGoals });
      } catch (error) {
        console.error('Error parsing saved goals:', error);
      }
    }
  }, []);

  const updateGoal = useCallback((key, value) => {
    const newGoals = { ...goals, [key]: value };
    setGoals(newGoals);
    localStorage.setItem('userFitnessGoals', JSON.stringify(newGoals));
  }, [goals]);

  return { goals, updateGoal };
};

// ======================== NUTRITION HOOKS ========================
const useNutritionGoals = () => {
  const [nutritionGoals, setNutritionGoals] = useState(NUTRITION_GOALS);

  useEffect(() => {
    const savedGoals = localStorage.getItem('userNutritionGoals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setNutritionGoals({ ...NUTRITION_GOALS, ...parsedGoals });
      } catch (error) {
        console.error('Error parsing saved nutrition goals:', error);
      }
    }
  }, []);

  const updateNutritionGoal = useCallback((key, value) => {
    const newGoals = { ...nutritionGoals, [key]: value };
    setNutritionGoals(newGoals);
    localStorage.setItem('userNutritionGoals', JSON.stringify(newGoals));
  }, [nutritionGoals]);

  return { nutritionGoals, updateNutritionGoal };
};

const useNutritionProgress = (currentUser, logDate) => {
  const [nutritionData, setNutritionData] = useState({
    calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0,
    sodium: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchNutritionProgress = useCallback(async () => {
    if (!currentUser || !logDate) {
      console.log('Missing currentUser or logDate:', { currentUser: !!currentUser, logDate });
      return;
    }
    
    setIsLoading(true);
    console.log('Fetching nutrition data for date:', logDate);
    
    try {
      // ✅ NEW: Check if this is a guest user
      if (currentUser.uid === 'guest-user') {
        // Read from localStorage for guest mode
        const guestNutritionHistory = JSON.parse(localStorage.getItem('guestNutritionHistory') || '[]');
        
        const totals = {
          calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0,
          sodium: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0
        };
        
        // Filter entries for the selected date
        const dayEntries = guestNutritionHistory.filter(entry => entry.date === logDate);
        
        dayEntries.forEach(entry => {
          Object.keys(totals).forEach(nutrient => {
            if (entry[nutrient] !== undefined && !isNaN(entry[nutrient])) {
              totals[nutrient] += Number(entry[nutrient]);
            }
          });
        });
        
        console.log('Guest nutrition totals:', totals);
        setNutritionData(totals);
        return;
      }
      
      // Original Firebase logic for authenticated users
      const nutritionCollectionRef = collection(db, "nutritionLogs");
      const startDate = getStartOfDayUTC(logDate);
      const endDate = getEndOfDayUTC(logDate);
      
      const q = query(
        nutritionCollectionRef,
        where("userId", "==", currentUser.uid),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Found', querySnapshot.size, 'nutrition documents');
      
      const totals = {
        calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0,
        sodium: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0
      };
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        Object.keys(totals).forEach(nutrient => {
          if (data[nutrient] !== undefined && !isNaN(data[nutrient])) {
            totals[nutrient] += Number(data[nutrient]);
          }
        });
      });
      
      setNutritionData(totals);
      
    } catch (error) {
      console.error("Error fetching nutrition progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, logDate]);

  useEffect(() => {
    fetchNutritionProgress();
  }, [fetchNutritionProgress]);

  return { nutritionData, isLoading, refetch: fetchNutritionProgress };
};



const useWeeklySchedule = () => {
  const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);

  useEffect(() => {
    const savedSchedule = localStorage.getItem("userFixedWeeklyExercises");
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        if (Array.isArray(parsedSchedule) && parsedSchedule.length === 6) {
          setSchedule(parsedSchedule);
        } else {
          localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
          setSchedule(DEFAULT_WEEKLY_SCHEDULE);
        }
      } catch (error) {
        localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
        setSchedule(DEFAULT_WEEKLY_SCHEDULE);
      }
    } else {
      localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
      setSchedule(DEFAULT_WEEKLY_SCHEDULE);
    }
  }, []);

  const saveSchedule = useCallback((newSchedule) => {
    const scheduleToSave = newSchedule.map(day => day || []);
    localStorage.setItem("userFixedWeeklyExercises", JSON.stringify(scheduleToSave));
    setSchedule(newSchedule);
  }, []);

  return { schedule, saveSchedule, setSchedule };
};

const useWorkoutProgress = (currentUser, logDate) => {
  const [progressData, setProgressData] = useState({
    duration: 0,
    steps: 0,
    yogaDuration: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!currentUser || !logDate) return;
    
    setIsLoading(true);
    try {
      // ✅ NEW: Check if this is a guest user
      if (currentUser.uid === 'guest-user') {
        // Read from localStorage for guest mode
        const guestWorkoutHistory = JSON.parse(localStorage.getItem('guestWorkoutHistory') || '[]');
        
        const totals = { duration: 0, steps: 0, yogaDuration: 0 };
        
        // Filter entries for the selected date
        const dayEntries = guestWorkoutHistory.filter(entry => entry.date === logDate);
        
        dayEntries.forEach(entry => {
          totals.duration += entry.duration || 0;
          totals.steps += entry.steps || 0;
          if (entry.exercises && entry.exercises.includes("yoga")) {
            totals.yogaDuration += entry.duration || 0;
          }
        });
        
        console.log('Guest workout totals:', totals);
        setProgressData(totals);
        return;
      }
      
      // Original Firebase logic for authenticated users
      const logsCollectionRef = collection(db, "workoutLogs");
      const q = query(
        logsCollectionRef,
        where("userId", "==", currentUser.uid),
        where("date", ">=", getStartOfDayUTC(logDate)),
        where("date", "<=", getEndOfDayUTC(logDate))
      );
      
      const querySnapshot = await getDocs(q);
      const totals = { duration: 0, steps: 0, yogaDuration: 0 };
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        totals.duration += data.duration || 0;
        totals.steps += data.steps || 0;
        if (data.exercises && data.exercises.includes("yoga")) {
          totals.yogaDuration += data.duration || 0;
        }
      });
      
      setProgressData(totals);
    } catch (error) {
      console.error("Error fetching progress:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, logDate]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progressData, isLoading, refetch: fetchProgress };
};


const useChartData = (currentUser) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Workout Duration (mins)",
      data: [],
      borderColor: "rgb(52, 211, 153)",
      backgroundColor: "rgba(52, 211, 153, 0.2)",
      tension: 0.3,
      fill: true,
      pointBackgroundColor: "rgb(52, 211, 153)",
      pointBorderColor: "#fff",
      pointHoverRadius: 7,
      pointHoverBackgroundColor: "rgb(52, 211, 153)",
      pointHoverBorderColor: "#fff",
    }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchChartData = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      let dailyData = {};
      
      // ✅ NEW: Check if this is a guest user
      if (currentUser.uid === 'guest-user') {
        // Read from localStorage for guest mode
        const guestWorkoutHistory = JSON.parse(localStorage.getItem('guestWorkoutHistory') || '[]');
        
        guestWorkoutHistory.forEach(entry => {
          const dateStr = entry.date;
          if (!dailyData[dateStr]) {
            dailyData[dateStr] = 0;
          }
          dailyData[dateStr] += entry.duration || 0;
        });
      } else {
        // Original Firebase logic for authenticated users
        const logsCollectionRef = collection(db, "workoutLogs");
        const endDateForChartQuery = getEndOfDayUTC(formatDateToUTCDayString(new Date()));
        
        const startDateObj = new Date();
        startDateObj.setUTCDate(startDateObj.getUTCDate() - 6);
        const startDateForChartQuery = getStartOfDayUTC(formatDateToUTCDayString(startDateObj));

        const q = query(
          logsCollectionRef,
          where("userId", "==", currentUser.uid),
          where("date", ">=", startDateForChartQuery),
          where("date", "<=", endDateForChartQuery),
          orderBy("date", "asc")
        );
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const dateStrUTC = formatDateToUTCDayString(data.date.toDate());
          if (!dailyData[dateStrUTC]) {
            dailyData[dateStrUTC] = 0;
          }
          dailyData[dateStrUTC] += data.duration || 0;
        });
      }

      // Generate chart data for last 7 days
      const labels = [];
      const dataPoints = [];
      for (let i = 6; i >= 0; i--) {
        const dayIter = new Date();
        dayIter.setUTCDate(dayIter.getUTCDate() - i);
        const currentDayUTCStr = formatDateToUTCDayString(dayIter);
        
        labels.push(currentDayUTCStr.substring(5));
        dataPoints.push(dailyData[currentDayUTCStr] || 0);
      }

      setChartData(prevChartData => ({
        ...prevChartData,
        labels: labels,
        datasets: [{
          ...prevChartData.datasets[0],
          data: dataPoints,
        }],
      }));
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { chartData, isLoading, refetch: fetchChartData };
};


// ======================== COMPONENTS ========================
const Toast = memo(({ toast, onRemove }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-600 border-green-500';
      case TOAST_TYPES.ERROR:
        return 'bg-red-600 border-red-500';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return <FiCheckCircle className="mr-2" />;
      case TOAST_TYPES.ERROR:
        return <FiAlertCircle className="mr-2" />;
      case TOAST_TYPES.WARNING:
        return <FiAlertCircle className="mr-2" />;
      default:
        return <FiActivity className="mr-2" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 border text-white max-w-sm ${getToastStyles(toast.type)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon(toast.type)}
          <span className="text-sm">{toast.message}</span>
        </div>
        <button 
          onClick={() => onRemove(toast.id)} 
          className="ml-4 hover:bg-black hover:bg-opacity-20 p-1 rounded"
          aria-label="Close notification"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
});

const SkeletonLoader = memo(({ className }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
));

const ChartSkeleton = memo(() => (
  <div className="space-y-4 p-4">
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-32 w-full" />
    <div className="flex justify-between space-x-2">
      {[...Array(7)].map((_, i) => (
        <SkeletonLoader key={i} className="h-3 w-8" />
      ))}
    </div>
  </div>
));

const ProgressBar = memo(({ label, percentage, valueText, icon, isLoading, goal, onGoalChange }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const displayPercentage = Math.min(100, Math.max(0, percentage));

  const handleGoalSave = () => {
    if (tempGoal > 0) {
      onGoalChange?.(tempGoal);
      setIsEditingGoal(false);
    }
  };

  const handleGoalCancel = () => {
    setTempGoal(goal);
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon && <span className="text-emerald-400 mr-2">{icon}</span>}
          <h3 className="text-base font-semibold text-gray-200">{label}</h3>
        </div>
        {onGoalChange && (
          <button
            onClick={() => setIsEditingGoal(true)}
            className="text-gray-400 hover:text-emerald-400 transition-colors"
            title="Edit goal"
          >
            <FiSettings size={16} />
          </button>
        )}
      </div>
      
      {isEditingGoal && (
        <div className="mb-3 flex items-center space-x-2">
          <input
            type="number"
            value={tempGoal}
            onChange={(e) => setTempGoal(Number(e.target.value))}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
            min="1"
          />
          <button onClick={handleGoalSave} className="text-green-400 hover:text-green-300">
            <FiCheckCircle size={16} />
          </button>
          <button onClick={handleGoalCancel} className="text-red-400 hover:text-red-300">
            <FiX size={16} />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-10">
          <FiLoader className="animate-spin text-emerald-400 text-2xl" />
        </div>
      ) : (
        <div className="relative pt-1">
          <div className="flex mb-1 items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{valueText}</span>
            <span className="text-sm font-medium text-gray-400">{displayPercentage.toFixed(0)}%</span>
          </div>
          <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded bg-gray-700">
            <div
              style={{ width: `${displayPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-out rounded"
              role="progressbar"
              aria-valuenow={displayPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label}: ${displayPercentage}% complete`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
});

// ======================== CIRCULAR PROGRESS COMPONENT ========================
const CircularProgress = memo(({ 
  label, 
  percentage, 
  current, 
  goal, 
  unit, 
  color = '#10b981',
  size = 120,
  strokeWidth = 8,
  isLoading 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <FiLoader className="animate-spin text-emerald-400 text-2xl mb-2" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">
            {Math.round(percentage)}%
          </span>
          <span className="text-xs text-gray-400">
            {Math.round(current)}/{goal}
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-gray-200">{label}</div>
        <div className="text-xs text-gray-400">{unit}</div>
      </div>
    </div>
  );
});

const NutritionForm = memo(({ 
  onSubmit, 
  isSubmitting, 
  logDate 
}) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customNutrition, setCustomNutrition] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    sugar: '',
    sodium: '',
    vitamin_c: '',
    vitamin_d: '',
    calcium: '',
    iron: '',
    potassium: ''
  });
  const [useCustomFood, setUseCustomFood] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let nutritionData;
    if (useCustomFood) {
      if (!customNutrition.name || !customNutrition.calories) {
        alert('Please provide at least food name and calories');
        return;
      }
      nutritionData = {
        name: customNutrition.name,
        calories: parseFloat(customNutrition.calories) || 0,
        protein: parseFloat(customNutrition.protein) || 0,
        carbs: parseFloat(customNutrition.carbs) || 0,
        fats: parseFloat(customNutrition.fats) || 0,
        fiber: parseFloat(customNutrition.fiber) || 0,
        sugar: parseFloat(customNutrition.sugar) || 0,
        sodium: parseFloat(customNutrition.sodium) || 0,
        vitamin_c: parseFloat(customNutrition.vitamin_c) || 0,
        vitamin_d: parseFloat(customNutrition.vitamin_d) || 0,
        calcium: parseFloat(customNutrition.calcium) || 0,
        iron: parseFloat(customNutrition.iron) || 0,
        potassium: parseFloat(customNutrition.potassium) || 0
      };
    } else {
      const food = COMMON_FOODS.find(f => f.name === selectedFood);
      if (!food) {
        alert('Please select a food item');
        return;
      }
      
      const qty = parseFloat(quantity) || 1;
      nutritionData = {
        name: `${food.name} x${qty}`,
        calories: Number((food.calories * qty).toFixed(2)),
        protein: Number((food.protein * qty).toFixed(2)),
        carbs: Number((food.carbs * qty).toFixed(2)),
        fats: Number((food.fats * qty).toFixed(2)),
        fiber: Number((food.fiber * qty).toFixed(2)),
        sugar: Number((food.sugar * qty).toFixed(2)),
        sodium: Number((food.sodium * qty).toFixed(2)),
        vitamin_c: Number((food.vitamin_c * qty).toFixed(2)),
        vitamin_d: Number((food.vitamin_d * qty).toFixed(2)),
        calcium: Number((food.calcium * qty).toFixed(2)),
        iron: Number((food.iron * qty).toFixed(2)),
        potassium: Number((food.potassium * qty).toFixed(2))
      };
    }

    // Ensure all values are numbers and not NaN
    Object.keys(nutritionData).forEach(key => {
      if (key !== 'name' && (isNaN(nutritionData[key]) || nutritionData[key] === null)) {
        nutritionData[key] = 0;
      }
    });

    console.log('Submitting nutrition data:', nutritionData); // Debug log
    onSubmit(nutritionData);
    
    // Reset form
    setSelectedFood('');
    setQuantity(1);
    setCustomNutrition({
      name: '', calories: '', protein: '', carbs: '', fats: '',
      fiber: '', sugar: '', sodium: '', vitamin_c: '', vitamin_d: '',
      calcium: '', iron: '', potassium: ''
    });
    setUseCustomFood(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useCustomFood}
              onChange={() => setUseCustomFood(false)}
              className="mr-2 text-emerald-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-300">Quick Add</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={useCustomFood}
              onChange={() => setUseCustomFood(true)}
              className="mr-2 text-emerald-500"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-300">Custom Food</span>
          </label>
        </div>

        {!useCustomFood ? (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">
                Food Item *
              </label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Food</option>
                {COMMON_FOODS.map((food, index) => (
                  <option key={index} value={food.name}>
                    {food.name} ({food.calories} kcal)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">
                Quantity (servings)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                min="0.1"
                step="0.1"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">
                Food Name *
              </label>
              <input
                type="text"
                value={customNutrition.name}
                onChange={(e) => setCustomNutrition(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Homemade Sandwich"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">
                Calories (kcal) *
              </label>
              <input
                type="number"
                value={customNutrition.calories}
                onChange={(e) => setCustomNutrition(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="1"
                placeholder="e.g., 350"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={customNutrition.protein}
                  onChange={(e) => setCustomNutrition(prev => ({ ...prev, protein: e.target.value }))}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-1 px-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={customNutrition.carbs}
                  onChange={(e) => setCustomNutrition(prev => ({ ...prev, carbs: e.target.value }))}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-1 px-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                  Fats (g)
                </label>
                <input
                  type="number"
                  value={customNutrition.fats}
                  onChange={(e) => setCustomNutrition(prev => ({ ...prev, fats: e.target.value }))}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-1 px-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="inline mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Food'
          )}
        </button>
      </form>
    </div>
  );
});


const WeeklyPlanTable = memo(({ 
  schedule, 
  isEditable, 
  onExerciseClick, 
  onExerciseChange,
  highlightIndex 
}) => (
  <div className="overflow-x-auto -mx-2 sm:mx-0">
    <table className="min-w-full w-full border-collapse border border-gray-700">
      <thead>
        <tr className="bg-gray-800">
          <th className="w-20 sm:w-24 md:w-32 p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-left">
            Day
          </th>
          <th className="p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-center">
            Exercise 1
          </th>
          <th className="p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-center">
            Exercise 2
          </th>
        </tr>
      </thead>
      <tbody>
        {DAY_NAMES.map((day, index) => (
          <tr 
            key={index} 
            className={`${
              index === highlightIndex 
                ? "bg-emerald-900 bg-opacity-60" 
                : "bg-gray-900 hover:bg-gray-800/60"
            } transition-colors duration-150`}
          >
            <td className="p-2 sm:p-3 border border-gray-700 font-medium text-gray-300 text-xs sm:text-sm md:text-base">
              <div className="truncate">
                <span className="sm:hidden">{day.slice(0, 3)}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            </td>
            {[0, 1].map((exerciseIndex) => (
              <td 
                key={exerciseIndex}
                className={`p-1 sm:p-2 border border-gray-700 text-center min-w-0 ${
                  !isEditable && schedule[index]?.[exerciseIndex] 
                    ? "cursor-pointer group" 
                    : ""
                }`}
                onClick={() => !isEditable && schedule[index]?.[exerciseIndex] && onExerciseClick(index, exerciseIndex)}
                title={
                  !isEditable && schedule[index]?.[exerciseIndex] 
                    ? `Go to ${schedule[index][exerciseIndex].replace("-", " ")} exercises` 
                    : (isEditable ? "Select an exercise" : "")
                }
              >
                {isEditable ? (
                  <select
                    value={schedule[index]?.[exerciseIndex] || ""}
                    onChange={(e) => onExerciseChange(index, exerciseIndex, e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-gray-200 p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm md:text-base focus:ring-emerald-500 focus:border-emerald-500 appearance-none text-center min-w-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">-- Select --</option>
                    <option value="">None</option>
                    {AVAILABLE_EXERCISES.map((exercise) => (
                      <option key={exercise} value={exercise} className="capitalize">
                        {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-1 sm:px-2 py-1 min-w-0">
                    {schedule[index]?.[exerciseIndex] ? (
                      <span className="text-xs sm:text-sm md:text-base capitalize inline-block group-hover:text-emerald-400 transition-colors truncate w-full" title={schedule[index][exerciseIndex].replace("-", " ")}>
                        {schedule[index][exerciseIndex].replace("-", " ")}
                      </span>
                    ) : (
                      <span className="text-gray-600 italic text-xs">
                        <span className="sm:hidden">-</span>
                        <span className="hidden sm:inline">Empty</span>
                      </span>
                    )}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

// ======================== MAIN COMPONENT ========================
const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const { goals, updateGoal } = useUserGoals();
  const { nutritionGoals, updateNutritionGoal } = useNutritionGoals();
  const { schedule, saveSchedule, setSchedule } = useWeeklySchedule();

// ✅ FIXED: Stable authentication check without infinite loops
useEffect(() => {
  let isMounted = true;
  
  const checkAuthStatus = () => {
    if (!isMounted) return;
    
    // Check for guest mode first
    const guestMode = localStorage.getItem('isGuestMode');
    const guestTimestamp = localStorage.getItem('guestModeTimestamp');
    
    console.log('🔍 Auth check - Guest mode:', guestMode, 'Current user:', !!currentUser);
    
    if (guestMode === 'true' && guestTimestamp) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - parseInt(guestTimestamp) < twentyFourHours) {
        if (!isGuestMode && isMounted) {
          console.log('✅ Setting guest mode to true');
          setIsGuestMode(true);
        }
        return; // Stay on dashboard
      } else {
        // Guest mode expired
        console.log('❌ Guest session expired');
        localStorage.removeItem('isGuestMode');
        localStorage.removeItem('guestModeTimestamp');
        if (isGuestMode && isMounted) {
          setIsGuestMode(false);
        }
      }
    }
    
    // If not guest mode and no authenticated user, redirect
    if (!currentUser && !guestMode && isMounted) {
      console.log('🔄 Redirecting to auth options');
      navigate('/', { replace: true });
    }
  };

  // Use timeout to prevent immediate re-renders
  const timeoutId = setTimeout(checkAuthStatus, 100);
  
  return () => {
    isMounted = false;
    clearTimeout(timeoutId);
  };
}, [currentUser, navigate]); // Keep dependencies minimal



  // Form states
  const [logDate, setLogDate] = useState(formatDate(new Date()));
  const [logDuration, setLogDuration] = useState("");
  const [logSteps, setLogSteps] = useState("");
  const [logWorkoutExercises, setLogWorkoutExercises] = useState([]);
  const [isFixedExercisesEditable, setIsFixedExercisesEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ UPDATED: Create effective user for both auth and guest mode
  const effectiveUser = currentUser || (isGuestMode ? { 
    uid: 'guest-user',
    email: 'guest@fitpro.com',
    displayName: 'Guest User'
  } : null);

  // Data hooks with effective user
  const { progressData, isLoading: isLoadingProgress, refetch: refetchProgress } = useWorkoutProgress(effectiveUser, logDate);
  const { nutritionData, isLoading: isLoadingNutrition, refetch: refetchNutrition } = useNutritionProgress(effectiveUser, logDate);
  const { chartData, isLoading: isLoadingChart, refetch: refetchChart } = useChartData(effectiveUser);

  // Memoized values
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb' } },
      title: { display: false },
      tooltip: { 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        titleColor: '#fff', 
        bodyColor: '#fff', 
        padding: 10, 
        cornerRadius: 4 
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, border: { color: '#4b5563' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, border: { color: '#4b5563' }, beginAtZero: true },
    }
  }), []);

  const todayIndex = useMemo(() => {
    const today = new Date().getDay();
    return today === 0 ? -1 : today - 1;
  }, []);

  const hasChartData = useMemo(() => 
    chartData.labels.length > 0 && chartData.datasets[0].data.some(d => d > 0), 
    [chartData]
  );

  // ✅ UPDATED: Enhanced logout handler for guest mode
// ✅ FIXED: Stable logout handler without freezing
const handleLogout = useCallback(async () => {
  // Prevent multiple logout attempts
  if (handleLogout._inProgress) return;
  handleLogout._inProgress = true;
  
  try {
    console.log('🚪 Logout initiated, guest mode:', isGuestMode);
    
    if (isGuestMode) {
      // Clear all guest data at once
      const keysToRemove = [
        'isGuestMode',
        'guestModeTimestamp', 
        'guestWorkoutHistory',
        'guestNutritionHistory'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ Guest data cleared, redirecting...');
      
      // Use window.location for immediate, clean redirect
      window.location.href = '/';
      
    } else {
      await signOut(auth);
      navigate("/", { replace: true });
    }
  } catch (error) {
    console.error("Logout failed:", error.message);
    addToast(`Logout failed: ${error.message}`, TOAST_TYPES.ERROR);
  } finally {
    // Reset the flag after a delay
    setTimeout(() => {
      handleLogout._inProgress = false;
    }, 1000);
  }
}, [navigate, addToast, isGuestMode]);



  const handleExerciseClick = useCallback((index, exerciseIndex) => {
    if (isFixedExercisesEditable) return;
    const exerciseName = schedule[index]?.[exerciseIndex];
    if (exerciseName) navigate(`/exercises/${exerciseName}`);
  }, [isFixedExercisesEditable, schedule, navigate]);

  const handleExerciseChange = useCallback((index, exerciseIndex, selectedExercise) => {
    const updatedExercises = schedule.map((dayExercises, i) => {
      if (i === index) {
        const currentDay = Array.isArray(dayExercises) ? [...dayExercises] : [];
        currentDay[exerciseIndex] = selectedExercise;
        return currentDay;
      }
      return dayExercises;
    });
    setSchedule(updatedExercises);
  }, [schedule, setSchedule]);

  const handleSaveFixedExercises = useCallback(() => {
    try {
      saveSchedule(schedule);
      setIsFixedExercisesEditable(false);
      addToast("Weekly plan saved successfully!", TOAST_TYPES.SUCCESS);
    } catch (error) {
      addToast("Failed to save weekly plan", TOAST_TYPES.ERROR);
    }
  }, [schedule, saveSchedule, addToast]);

  const toggleFixedExercisesEdit = useCallback(() => {
    if (isFixedExercisesEditable) {
      const savedExercises = localStorage.getItem("userFixedWeeklyExercises");
      if (savedExercises) {
        try {
          const parsedExercises = JSON.parse(savedExercises);
          if (Array.isArray(parsedExercises) && parsedExercises.length === 6) {
            setSchedule(parsedExercises);
          } else {
            setSchedule(DEFAULT_WEEKLY_SCHEDULE);
          }
        } catch (e) {
          setSchedule(DEFAULT_WEEKLY_SCHEDULE);
        }
      } else {
        setSchedule(DEFAULT_WEEKLY_SCHEDULE);
      }
    }
    setIsFixedExercisesEditable(prev => !prev);
  }, [isFixedExercisesEditable, setSchedule]);

  // ✅ UPDATED: Enhanced workout logging for guest mode
  const handleLogWorkout = useCallback(async (e) => {
    e.preventDefault();
    
    const formData = {
      date: logDate,
      duration: parseInt(logDuration, 10) || 0,
      steps: parseInt(logSteps, 10) || 0,
      exercises: logWorkoutExercises
    };

    const { isValid, errors } = validateWorkoutForm(formData);
    
    if (!isValid) {
      const errorMessage = errors.general || Object.values(errors)[0];
      addToast(errorMessage, TOAST_TYPES.ERROR);
      return;
    }

    if (!effectiveUser) {
      addToast("You must be logged in to log workouts.", TOAST_TYPES.ERROR);
      navigate("/");
      return;
    }

    // ✅ NEW: Handle guest mode differently
    if (isGuestMode) {
      // For guest mode, just show success message without saving to Firebase
      addToast(`Workout logged locally for ${logDate}! Sign up to save permanently.`, TOAST_TYPES.SUCCESS);
      
      // Save to localStorage for guest mode
      const guestWorkoutHistory = JSON.parse(localStorage.getItem('guestWorkoutHistory') || '[]');
      guestWorkoutHistory.unshift({
        ...formData,
        timestamp: Date.now(),
        userId: 'guest-user'
      });
      localStorage.setItem('guestWorkoutHistory', JSON.stringify(guestWorkoutHistory.slice(0, 10))); // Keep last 10
      
      // Reset form
      setLogDuration("");
      setLogSteps("");
      setLogWorkoutExercises([]);
      
      // Refresh data
      refetchProgress();
      refetchChart();
      return;
    }

    const workoutData = {
      userId: effectiveUser.uid,
      date: getStartOfDayUTC(logDate),
      duration: formData.duration,
      steps: formData.steps,
      exercises: logWorkoutExercises,
      createdAt: serverTimestamp(),
    };
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "workoutLogs"), workoutData);
      addToast(`Workout logged for ${logDate} successfully!`, TOAST_TYPES.SUCCESS);
      
      // Reset form
      setLogDuration("");
      setLogSteps("");
      setLogWorkoutExercises([]);
      
      // Refresh data
      refetchProgress();
      refetchChart();
    } catch (error) {
      console.error("Error adding workout document:", error);
      addToast(`Failed to log workout: ${error.message}`, TOAST_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [logDate, logDuration, logSteps, logWorkoutExercises, effectiveUser, addToast, navigate, refetchProgress, refetchChart, isGuestMode]);

  // ✅ UPDATED: Enhanced nutrition logging for guest mode
  const handleLogNutrition = useCallback(async (nutritionInfo) => {
    if (!effectiveUser) {
      addToast("You must be logged in to log nutrition.", TOAST_TYPES.ERROR);
      navigate("/");
      return;
    }

    if (!nutritionInfo || !nutritionInfo.name) {
      addToast("Invalid nutrition data provided.", TOAST_TYPES.ERROR);
      return;
    }

    // ✅ NEW: Handle guest mode differently
    if (isGuestMode) {
      // For guest mode, just show success message without saving to Firebase
      addToast(`${nutritionInfo.name} added locally! Sign up to save permanently.`, TOAST_TYPES.SUCCESS);
      
      // Save to localStorage for guest mode
      const guestNutritionHistory = JSON.parse(localStorage.getItem('guestNutritionHistory') || '[]');
      guestNutritionHistory.unshift({
        ...nutritionInfo,
        date: logDate,
        timestamp: Date.now(),
        userId: 'guest-user'
      });
      localStorage.setItem('guestNutritionHistory', JSON.stringify(guestNutritionHistory.slice(0, 50))); // Keep last 50
      
      // Refresh data
      setTimeout(() => refetchNutrition(), 500);
      return;
    }

    // Ensure all numeric values are valid numbers
    const nutritionData = {
      userId: effectiveUser.uid,
      date: getStartOfDayUTC(logDate),
      foodName: String(nutritionInfo.name || ''),
      calories: Number(nutritionInfo.calories || 0),
      protein: Number(nutritionInfo.protein || 0),
      carbs: Number(nutritionInfo.carbs || 0),
      fats: Number(nutritionInfo.fats || 0),
      fiber: Number(nutritionInfo.fiber || 0),
      sugar: Number(nutritionInfo.sugar || 0),
      sodium: Number(nutritionInfo.sodium || 0),
      vitamin_c: Number(nutritionInfo.vitamin_c || 0),
      vitamin_d: Number(nutritionInfo.vitamin_d || 0),
      calcium: Number(nutritionInfo.calcium || 0),
      iron: Number(nutritionInfo.iron || 0),
      potassium: Number(nutritionInfo.potassium || 0),
      createdAt: serverTimestamp(),
    };

    // Validate that at least calories is provided
    if (nutritionData.calories <= 0) {
      addToast("Please provide at least calorie information.", TOAST_TYPES.ERROR);
      return;
    }

    console.log('Logging nutrition data:', nutritionData);

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "nutritionLogs"), nutritionData);
      console.log('Document written with ID: ', docRef.id);
      
      addToast(`${nutritionInfo.name} added successfully!`, TOAST_TYPES.SUCCESS);
      
      setTimeout(async () => {
        try {
          await refetchNutrition();
          console.log('Nutrition data refreshed');
        } catch (error) {
          console.error('Error refreshing nutrition data:', error);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error adding nutrition document:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Failed to log nutrition. ";
      if (error.code === 'permission-denied') {
        errorMessage += "Permission denied. Please check your login status.";
      } else if (error.code === 'invalid-argument') {
        errorMessage += "Invalid data provided.";
      } else {
        errorMessage += error.message;
      }
      
      addToast(errorMessage, TOAST_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [effectiveUser, logDate, addToast, navigate, refetchNutrition, isGuestMode]);

  const handleGoalChange = useCallback((goalType, value) => {
    updateGoal(goalType, value);
    addToast(`${goalType.replace('_', ' ')} goal updated!`, TOAST_TYPES.SUCCESS);
  }, [updateGoal, addToast]);

const renderGuestModeIndicator = () => {
  if (!isGuestMode) return null;
  
  return (
    <div className="fixed top-16 left-4 sm:top-20 sm:left-6 z-20 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="text-sm font-medium">Guest Mode</span>
        <button
  onClick={() => {
    // Clear ALL guest data
    localStorage.removeItem('isGuestMode');
    localStorage.removeItem('guestModeTimestamp');
    localStorage.removeItem('guestWorkoutHistory');
    localStorage.removeItem('guestNutritionHistory');
    
    // Reset guest mode state immediately
    setIsGuestMode(false);
    
    // Use window.location for clean navigation
    window.location.href = '/signup';
  }}
  className="text-yellow-200 hover:text-white text-xs underline ml-2"
>
  Sign Up
</button>

      </div>
    </div>
  );
};


  // ✅ UPDATED: Don't render if no effective user
  if (!effectiveUser) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-emerald-400 text-4xl mb-4 mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 relative px-4 sm:px-6 lg:px-8 py-6">
      {/* ✅ NEW: Guest mode indicator */}
      {renderGuestModeIndicator()}

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}

      {/* Header buttons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center bg-blue-600 text-sm px-4 py-1.5 rounded-md font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-blue-500 transition duration-150 ease-in-out shadow"
          title="View Workout History"
        >
          <FiEye className="mr-1.5" /> History
        </button>
      </div>
      
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-sm px-4 py-1.5 rounded-md font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-red-500 transition duration-150 ease-in-out shadow"
          title={isGuestMode ? "Exit Guest Mode" : "Logout"}
        >
          <FiLogOut className="mr-1.5" /> {isGuestMode ? "Exit" : "Logout"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-16 md:mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-100">
          <GiMuscleUp className="inline mr-2 text-emerald-400" />
          -My Fitness Dashboard-
          <GiMuscleUp className="inline mr-2 text-emerald-400" />
          {isGuestMode && <span className="text-yellow-400 text-lg ml-2">(Guest)</span>}
        </h1>

        {/* ✅ NEW: Guest mode info banner */}
        {isGuestMode && (
  <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-yellow-400 font-semibold mb-1">🔍 You're in Guest Mode</h3>
        <p className="text-yellow-200 text-sm">
          Data is saved locally. Sign up to sync across devices and never lose your progress!
        </p>
      </div>
      <button
  onClick={() => {
    // Clear ALL guest data
    localStorage.removeItem('isGuestMode');
    localStorage.removeItem('guestModeTimestamp');
    localStorage.removeItem('guestWorkoutHistory');
    localStorage.removeItem('guestNutritionHistory');
    
    // Reset guest mode state immediately
    setIsGuestMode(false);
    
    // Use window.location for clean navigation
    window.location.href = '/signup';
  }}
  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
>
  Sign Up Now
</button>

    </div>
  </div>
)}


        {/* All your existing sections remain the same */}
        {/* ======================== NUTRITION SECTION ======================== */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100 flex items-center">
            <FaSeedling className="mr-2 text-green-400" /> 
            Nutrition Tracking - {logDate ? formatDate(new Date(logDate + 'T12:00:00Z')) : 'Select Date'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Nutrition Form */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Add Food</h3>
              <NutritionForm 
                onSubmit={handleLogNutrition}
                isSubmitting={isSubmitting}
                logDate={logDate}
              />
            </div>

            {/* Macronutrients */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Macronutrients</h3>
              <div className="grid grid-cols-2 gap-4">
                {MACRO_NUTRIENTS.map(nutrient => {
                  const key = nutrient.toLowerCase();
                  const current = nutritionData[key] || 0;
                  const goal = nutritionGoals[nutrient] || 1;
                  const percentage = (current / goal) * 100;
                  
                  return (
                    <CircularProgress
                      key={nutrient}
                      label={nutrient.charAt(0) + nutrient.slice(1).toLowerCase()}
                      percentage={percentage}
                      current={current}
                      goal={goal}
                      unit={NUTRITION_UNITS[nutrient]}
                      color={
                        nutrient === 'CALORIES' ? '#f59e0b' :
                        nutrient === 'PROTEIN' ? '#ef4444' :
                        nutrient === 'CARBS' ? '#3b82f6' : '#10b981'
                      }
                      size={100}
                      isLoading={isLoadingNutrition}
                    />
                  );
                })}
              </div>
            </div>

            {/* Micronutrients */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Micronutrients</h3>
              <div className="grid grid-cols-2 gap-3">
                {MICRO_NUTRIENTS.map(nutrient => {
                  const key = nutrient.toLowerCase();
                  const current = nutritionData[key] || 0;
                  const goal = nutritionGoals[nutrient] || 1;
                  const percentage = (current / goal) * 100;
                  
                  return (
                    <CircularProgress
                      key={nutrient}
                      label={nutrient.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      percentage={percentage}
                      current={current}
                      goal={goal}
                      unit={NUTRITION_UNITS[nutrient]}
                      color="#8b5cf6"
                      size={80}
                      isLoading={isLoadingNutrition}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-md font-semibold mb-3 text-gray-200">Today's Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Calories:</span>
                <span className="ml-2 font-medium text-yellow-400">
                  {Math.round(nutritionData.calories)}/{nutritionGoals.CALORIES}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Protein:</span>
                <span className="ml-2 font-medium text-red-400">
                  {Math.round(nutritionData.protein)}g/{nutritionGoals.PROTEIN}g
                </span>
              </div>
              <div>
                <span className="text-gray-400">Carbs:</span>
                <span className="ml-2 font-medium text-blue-400">
                  {Math.round(nutritionData.carbs)}g/{nutritionGoals.CARBS}g
                </span>
              </div>
              <div>
                <span className="text-gray-400">Fats:</span>
                <span className="ml-2 font-medium text-green-400">
                  {Math.round(nutritionData.fats)}g/{nutritionGoals.FATS}g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Plan Section */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 flex items-center">
              <FaTable className="mr-2 text-emerald-400 text-base sm:text-lg"/> 
              <span className="truncate">Weekly Workout Plan</span>
            </h2>
            <button
              onClick={toggleFixedExercisesEdit}
              className="flex items-center justify-center bg-yellow-500 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-yellow-400 transition text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 shadow whitespace-nowrap self-start sm:self-auto"
              disabled={isSubmitting}
            >
              {isFixedExercisesEditable ? (
                <>
                  <FiX className="mr-1 sm:mr-1.5" size={14} /> 
                  <span className="hidden xs:inline">Cancel Edit</span>
                  <span className="xs:hidden">Cancel</span>
                </>
              ) : (
                <>
                  <FiEdit className="mr-1 sm:mr-1.5" size={14} /> 
                  <span className="hidden xs:inline">Change Plan</span>
                  <span className="xs:hidden">Edit</span>
                </>
              )}
            </button>
          </div>
          
          {isFixedExercisesEditable && (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-3 mb-4">
              <p className="text-xs sm:text-sm text-yellow-400 text-left flex items-start">
                <FiEdit className="mr-2 mt-0.5 flex-shrink-0" size={14} />
                <span>Editing enabled. Choose exercises and click save below.</span>
              </p>
            </div>
          )}
          
          <WeeklyPlanTable
            schedule={schedule}
            isEditable={isFixedExercisesEditable}
            onExerciseClick={handleExerciseClick}
            onExerciseChange={handleExerciseChange}
            highlightIndex={todayIndex}
          />
          
          {isFixedExercisesEditable && (
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleSaveFixedExercises}
                className="flex items-center justify-center w-full sm:w-auto mx-auto bg-green-600 px-4 sm:px-6 py-2 rounded-md font-semibold text-sm sm:text-base text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 shadow-md"
                disabled={isSubmitting}
              >
                <FiSave className="mr-1.5" size={16} /> Save Plan
              </button>
            </div>
          )}
        </div>

        {/* Activity Logging Section */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100 flex items-center">
              <FiActivity className="mr-2 text-emerald-400" /> Log Activity for {logDate ? formatDate(new Date(logDate + 'T12:00:00Z')) : 'Select Date'}
            </h2>
            <form onSubmit={handleLogWorkout} className="space-y-5">
              <div>
                <label htmlFor="logDate" className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <FiCalendar className="mr-1.5"/> Date
                </label>
                <input
                  type="date"
                  id="logDate"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3"
                  max={formatDate(new Date())}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="logDuration" className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                    <FiClock className="mr-1.5"/> Duration (mins)
                  </label>
                  <input
                    type="number"
                    id="logDuration"
                    value={logDuration}
                    onChange={(e) => setLogDuration(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3"
                    min="0"
                    max="600"
                    placeholder="e.g., 30"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="logSteps" className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                    <FaWalking className="mr-1.5"/> Steps
                  </label>
                  <input
                    type="number"
                    id="logSteps"
                    value={logSteps}
                    onChange={(e) => setLogSteps(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3"
                    min="0"
                    max="100000"
                    placeholder="e.g., 5000"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="logWorkoutExercises" className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <FaDumbbell className="mr-1.5"/> Main Exercise Focus (Optional)
                </label>
                <select
                  id="logWorkoutExercises"
                  value={logWorkoutExercises[0] || ""}
                  onChange={(e) => setLogWorkoutExercises(e.target.value ? [e.target.value] : [])}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="">-- Select Focus (Optional) --</option>
                  {AVAILABLE_EXERCISES.map(exercise => (
                    <option key={exercise} value={exercise} className="capitalize">
                      {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-center pt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 px-8 py-2.5 rounded-md font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="mr-1.5 animate-spin" /> Logging...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-1.5" /> Log Activity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Chart and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg col-span-1 lg:col-span-1 flex flex-col border border-gray-700 order-first">
            <h2 className="text-lg font-semibold mb-4 text-gray-100 flex items-center">
              <FiTrendingUp className="mr-2 text-emerald-400"/> Workout Trend (Last 7 Days)
            </h2>
            <div className="flex-grow" style={{ minHeight: '250px' }}>
              {isLoadingChart ? (
                <ChartSkeleton />
              ) : (
                hasChartData ? 
                  <Line data={chartData} options={chartOptions} /> : 
                  <p className="text-gray-500 text-center mt-10">No workout data to display for this period.</p>
              )}
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700">
              <ProgressBar
                label="Workout Duration Goal"
                percentage={goals.WORKOUT_DURATION > 0 ? Math.min(100, (progressData.duration / goals.WORKOUT_DURATION) * 100) : 0}
                valueText={`${progressData.duration} / ${goals.WORKOUT_DURATION} mins`}
                icon={<FaPersonRunning size="1.1em"/>}
                isLoading={isLoadingProgress}
                goal={goals.WORKOUT_DURATION}
                onGoalChange={(value) => handleGoalChange('WORKOUT_DURATION', value)}
              />
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700">
              <ProgressBar
                label="Daily Steps Goal"
                percentage={goals.DAILY_STEPS > 0 ? Math.min(100, (progressData.steps / goals.DAILY_STEPS) * 100) : 0}
                valueText={`${progressData.steps} / ${goals.DAILY_STEPS} steps`}
                icon={<FaWalking size="1.1em"/>}
                isLoading={isLoadingProgress}
                goal={goals.DAILY_STEPS}
                onGoalChange={(value) => handleGoalChange('DAILY_STEPS', value)}
              />
            </div>
          </div>
        </div>

        {/* Yoga Section */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center mb-10 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 flex items-center justify-center">
            <GiLotus className="mr-2 text-purple-400"/> Today's Yoga / Flexibility
          </h2>
          <div className="max-w-md mx-auto mb-6">
            <ProgressBar
              label="Flexibility Goal"
              percentage={goals.YOGA_DURATION > 0 ? Math.min(100, (progressData.yogaDuration / goals.YOGA_DURATION) * 100) : 0}
              valueText={`${progressData.yogaDuration} / ${goals.YOGA_DURATION} mins`}
              icon={<FaSeedling size="1.1em" className="text-purple-400"/>}
              isLoading={isLoadingProgress}
              goal={goals.YOGA_DURATION}
              onGoalChange={(value) => handleGoalChange('YOGA_DURATION', value)}
            />
          </div>
          <button
            onClick={() => navigate("/exercises/yoga")}
            className="inline-flex items-center bg-purple-600 px-6 py-2.5 rounded-md font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 shadow-md"
          >
            Explore Yoga Poses
          </button>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
