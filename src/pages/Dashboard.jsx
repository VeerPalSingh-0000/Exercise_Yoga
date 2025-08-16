// src/pages/Dashboard.js

import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import {
  FiLogOut, FiEye, FiEdit, FiSave, FiClock, FiCheckCircle, FiActivity, FiX, FiTrendingUp, FiLoader, FiSettings, FiAlertCircle, FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiUser, FiLink,
} from 'react-icons/fi';
import { FaTable, FaWalking, FaSeedling } from 'react-icons/fa';
import { FaPersonRunning, FaDumbbell } from 'react-icons/fa6';
import { GiMuscleUp, GiLotus } from 'react-icons/gi';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// ======================== CONFIGURATION ========================
const FITNESS_GOALS = { WORKOUT_DURATION: 45, DAILY_STEPS: 5000, YOGA_DURATION: 25 };
const AVAILABLE_EXERCISES = ["chest", "bicep", "tricep", "leg", "shoulder", "back", "abs", "yoga", "running", "cardio", "stretching", "arm","keggle"];
const DEFAULT_WEEKLY_SCHEDULE = [["chest", "tricep"], ["back", "bicep"], ["leg", "shoulder"], ["chest", "abs"], ["back", "tricep"], ["leg", "bicep"]];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TOAST_TYPES = { SUCCESS: 'success', ERROR: 'error', INFO: 'info', WARNING: 'warning' };
const NUTRITION_GOALS = { CALORIES: 2000, PROTEIN: 150, CARBS: 250, FATS: 65, FIBER: 25, SUGAR: 50, SODIUM: 2300, VITAMIN_C: 90, VITAMIN_D: 20, CALCIUM: 1000, IRON: 18, POTASSIUM: 3500 };
const NUTRITION_UNITS = { CALORIES: 'kcal', PROTEIN: 'g', CARBS: 'g', FATS: 'g', FIBER: 'g', SUGAR: 'g', SODIUM: 'mg', VITAMIN_C: 'mg', VITAMIN_D: 'mcg', CALCIUM: 'mg', IRON: 'mg', POTASSIUM: 'mg' };
const MACRO_NUTRIENTS = ['CALORIES', 'PROTEIN', 'CARBS', 'FATS'];
const MICRO_NUTRIENTS = ['FIBER', 'SUGAR', 'SODIUM', 'VITAMIN_C', 'VITAMIN_D', 'CALCIUM', 'IRON', 'POTASSIUM'];
const COMMON_FOODS = [
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, sodium: 74, vitamin_c: 0, vitamin_d: 0, calcium: 15, iron: 1, potassium: 256 },
    { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fats: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10, vitamin_c: 0, vitamin_d: 0, calcium: 20, iron: 0.8, potassium: 84 },
    { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, sodium: 1, vitamin_c: 10, vitamin_d: 0, calcium: 5, iron: 0.3, potassium: 422 },
    { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, sugar: 0, sodium: 59, vitamin_c: 0, vitamin_d: 11, calcium: 9, iron: 0.3, potassium: 363 },
    { name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fats: 0.3, fiber: 2.6, sugar: 1.5, sodium: 33, vitamin_c: 81, vitamin_d: 0, calcium: 43, iron: 0.7, potassium: 288 },
];

// ======================== UTILITY FUNCTIONS ========================
const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
};
const formatDateToUTCDayString = (dateObj) => {
    if (!dateObj) return "";
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getStartOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T00:00:00.000Z'));
const getEndOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T23:59:59.999Z'));
const validateWorkoutForm = (data) => {
    const errors = {};
    if (!data.date) errors.date = 'Date is required';
    if (data.duration && (data.duration < 0 || data.duration > 600)) errors.duration = 'Duration must be between 0 and 600 minutes';
    if (data.steps && (data.steps < 0 || data.steps > 100000)) errors.steps = 'Steps must be between 0 and 100,000';
    if (data.duration <= 0 && data.steps <= 0 && (!data.exercises || data.exercises.length === 0)) errors.general = 'Please log a valid duration, steps, or select an exercise focus';
    return { isValid: Object.keys(errors).length === 0, errors };
};

// ======================== CUSTOM HOOKS ========================
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);
    const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
    return { toasts, addToast, removeToast };
};

const useUserGoals = () => {
    const [goals, setGoals] = useState(FITNESS_GOALS);
    useEffect(() => {
        const savedGoals = localStorage.getItem('userFitnessGoals');
        if (savedGoals) {
            try { setGoals({ ...FITNESS_GOALS, ...JSON.parse(savedGoals) }); } 
            catch (error) { console.error('Error parsing saved goals:', error); }
        }
    }, []);
    const updateGoal = useCallback((key, value) => {
        const newGoals = { ...goals, [key]: value };
        setGoals(newGoals);
        localStorage.setItem('userFitnessGoals', JSON.stringify(newGoals));
    }, [goals]);
    return { goals, updateGoal };
};

const useNutritionGoals = () => {
    const [nutritionGoals, setNutritionGoals] = useState(NUTRITION_GOALS);
    useEffect(() => {
        const savedGoals = localStorage.getItem('userNutritionGoals');
        if (savedGoals) {
            try { setNutritionGoals({ ...NUTRITION_GOALS, ...JSON.parse(savedGoals) }); } 
            catch (error) { console.error('Error parsing saved nutrition goals:', error); }
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
    const [nutritionData, setNutritionData] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const fetchNutritionProgress = useCallback(async () => {
        if (!currentUser || !logDate) return;
        setIsLoading(true);
        try {
            const q = query(collection(db, "nutritionLogs"), where("userId", "==", currentUser.uid), where("date", ">=", getStartOfDayUTC(logDate)), where("date", "<=", getEndOfDayUTC(logDate)));
            const querySnapshot = await getDocs(q);
            const totals = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0 };
            querySnapshot.forEach(doc => {
                const data = doc.data();
                Object.keys(totals).forEach(nutrient => {
                    if (data[nutrient] !== undefined && !isNaN(data[nutrient])) totals[nutrient] += Number(data[nutrient]);
                });
            });
            setNutritionData(totals);
        } catch (error) { console.error("Error fetching nutrition progress:", error); } 
        finally { setIsLoading(false); }
    }, [currentUser, logDate]);
    useEffect(() => { fetchNutritionProgress(); }, [fetchNutritionProgress]);
    return { nutritionData, isLoading, refetch: fetchNutritionProgress };
};

const useRepTracking = (currentUser, logDate) => {
    const [repLogs, setRepLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetchRepLogs = useCallback(async () => {
        if (!currentUser || !logDate) return;
        setIsLoading(true);
        try {
            const q = query(collection(db, "repLogs"), where("userId", "==", currentUser.uid), where("date", ">=", getStartOfDayUTC(logDate)), where("date", "<=", getEndOfDayUTC(logDate)), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setRepLogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { console.error("Error fetching rep logs:", error); } 
        finally { setIsLoading(false); }
    }, [currentUser, logDate]);
    useEffect(() => { fetchRepLogs(); }, [fetchRepLogs]);
    return { repLogs, isLoading, refetch: fetchRepLogs };
};

const useWorkoutProgress = (currentUser, logDate) => {
    const [progressData, setProgressData] = useState({ duration: 0, steps: 0, yogaDuration: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const fetchProgress = useCallback(async () => {
        if (!currentUser || !logDate) return;
        setIsLoading(true);
        try {
            const q = query(collection(db, "workoutLogs"), where("userId", "==", currentUser.uid), where("date", ">=", getStartOfDayUTC(logDate)), where("date", "<=", getEndOfDayUTC(logDate)));
            const querySnapshot = await getDocs(q);
            const totals = { duration: 0, steps: 0, yogaDuration: 0 };
            querySnapshot.forEach(doc => {
                const data = doc.data();
                totals.duration += data.duration || 0;
                totals.steps += data.steps || 0;
                if (data.exercises && data.exercises.includes("yoga")) totals.yogaDuration += data.duration || 0;
            });
            setProgressData(totals);
        } catch (error) { console.error("Error fetching progress:", error); } 
        finally { setIsLoading(false); }
    }, [currentUser, logDate]);
    useEffect(() => { fetchProgress(); }, [fetchProgress]);
    return { progressData, isLoading, refetch: fetchProgress };
};

const useChartData = (currentUser) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [{ label: "Workout Duration (mins)", data: [], borderColor: "rgb(52, 211, 153)", backgroundColor: "rgba(52, 211, 153, 0.2)", tension: 0.3, fill: true, pointBackgroundColor: "rgb(52, 211, 153)", pointBorderColor: "#fff", pointHoverRadius: 7, pointHoverBackgroundColor: "rgb(52, 211, 153)", pointHoverBorderColor: "#fff" }] });
    const [isLoading, setIsLoading] = useState(false);
    const fetchChartData = useCallback(async () => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const dailyData = {};
            const endDate = getEndOfDayUTC(formatDateToUTCDayString(new Date()));
            const startDateObj = new Date();
            startDateObj.setUTCDate(startDateObj.getUTCDate() - 6);
            const startDate = getStartOfDayUTC(formatDateToUTCDayString(startDateObj));
            const q = query(collection(db, "workoutLogs"), where("userId", "==", currentUser.uid), where("date", ">=", startDate), where("date", "<=", endDate), orderBy("date", "asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const dateStrUTC = formatDateToUTCDayString(data.date.toDate());
                if (!dailyData[dateStrUTC]) dailyData[dateStrUTC] = 0;
                dailyData[dateStrUTC] += data.duration || 0;
            });
            const labels = [];
            const dataPoints = [];
            for (let i = 6; i >= 0; i--) {
                const dayIter = new Date();
                dayIter.setUTCDate(dayIter.getUTCDate() - i);
                const currentDayUTCStr = formatDateToUTCDayString(dayIter);
                labels.push(currentDayUTCStr.substring(5));
                dataPoints.push(dailyData[currentDayUTCStr] || 0);
            }
            setChartData(prev => ({ ...prev, labels, datasets: [{ ...prev.datasets[0], data: dataPoints }] }));
        } catch (error) { console.error("Error fetching chart data:", error); } 
        finally { setIsLoading(false); }
    }, [currentUser]);
    useEffect(() => { fetchChartData(); }, [fetchChartData]);
    return { chartData, isLoading, refetch: fetchChartData };
};

const useWeeklySchedule = () => {
    const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);
    useEffect(() => {
        const savedSchedule = localStorage.getItem("userWeeklySchedule");
        if (savedSchedule) {
            try {
                const parsedSchedule = JSON.parse(savedSchedule);
                if (Array.isArray(parsedSchedule) && parsedSchedule.length === 6) setSchedule(parsedSchedule);
                else localStorage.setItem("userWeeklySchedule", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
            } catch (error) { localStorage.setItem("userWeeklySchedule", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE)); }
        } else { localStorage.setItem("userWeeklySchedule", JSON.stringify(DEFAULT_WEEKLY_SCHEDULE)); }
    }, []);
    const saveSchedule = useCallback((newSchedule) => {
        const scheduleToSave = newSchedule.map(day => day || []);
        localStorage.setItem("userWeeklySchedule", JSON.stringify(scheduleToSave));
        setSchedule(newSchedule);
    }, []);
    return { schedule, setSchedule, saveSchedule };
};

// New hook for additional fixed exercises
const useFixedExercises = () => {
    const [fixedExercises, setFixedExercises] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem('userFixedExercises');
        if (saved) {
            try { setFixedExercises(JSON.parse(saved)); }
            catch (e) { setFixedExercises([]); }
        }
    }, []);

    const saveExercises = useCallback((exercises) => {
        localStorage.setItem('userFixedExercises', JSON.stringify(exercises));
        setFixedExercises(exercises);
    }, []);

    return { fixedExercises, setFixedExercises, saveExercises };
};


// ======================== UI COMPONENTS ========================
const Toast = memo(({ toast, onRemove }) => {
    const styles = { success: 'bg-green-600 border-green-500', error: 'bg-red-600 border-red-500', warning: 'bg-yellow-600 border-yellow-500', info: 'bg-blue-600 border-blue-500' };
    const icons = { success: <FiCheckCircle className="mr-2" />, error: <FiAlertCircle className="mr-2" />, warning: <FiAlertCircle className="mr-2" />, info: <FiActivity className="mr-2" /> };
    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 border text-white max-w-sm ${styles[toast.type] || styles.info}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">{icons[toast.type] || icons.info}<span className="text-sm">{toast.message}</span></div>
                <button onClick={() => onRemove(toast.id)} className="ml-4 hover:bg-black hover:bg-opacity-20 p-1 rounded" aria-label="Close"><FiX size={16} /></button>
            </div>
        </div>
    );
});

const Header = memo(({ currentUser, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    if (!currentUser) return null;
    const UserAvatar = () => ( <img src={currentUser.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.displayName || currentUser.email}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-600" /> );
    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg border-b border-gray-700 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <GiMuscleUp className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-xl font-bold text-gray-100 ml-2">FitPro</h1>
                    </div>
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <UserAvatar />
                            <span className="hidden sm:inline text-sm font-medium text-gray-200">{currentUser.displayName || "User"}</span>
                            <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2">
                                <div className="px-4 py-2 border-b border-gray-700">
                                    <p className="text-sm font-semibold text-white truncate">{currentUser.displayName || "Fitness Enthusiast"}</p>
                                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                </div>
                                <nav className="mt-2">
                                    <button onClick={() => { navigate('/history'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><FiEye className="mr-2" /> View History</button>
                                    <button onClick={() => { /* Navigate to settings */ setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"><FiSettings className="mr-2" /> Settings</button>
                                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center mt-2"><FiLogOut className="mr-2" /> Logout</button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
});

const SkeletonLoader = memo(({ className }) => <div className={`animate-pulse bg-gray-700 rounded ${className}`} />);
const ChartSkeleton = memo(() => (
    <div className="space-y-4 p-4">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-32 w-full" />
        <div className="flex justify-between space-x-2">{[...Array(7)].map((_, i) => <SkeletonLoader key={i} className="h-3 w-8" />)}</div>
    </div>
));
const ProgressBar = memo(({ label, percentage, valueText, icon, isLoading, goal, onGoalChange }) => {
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal);
    const displayPercentage = Math.min(100, Math.max(0, percentage));
    const handleGoalSave = () => { if (tempGoal > 0) { onGoalChange?.(tempGoal); setIsEditingGoal(false); } };
    const handleGoalCancel = () => { setTempGoal(goal); setIsEditingGoal(false); };
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">{icon && <span className="text-emerald-400 mr-2">{icon}</span>}<h3 className="text-base font-semibold text-gray-200">{label}</h3></div>
                {onGoalChange && <button onClick={() => setIsEditingGoal(true)} className="text-gray-400 hover:text-emerald-400 transition-colors" title="Edit goal"><FiSettings size={16} /></button>}
            </div>
            {isEditingGoal && (
                <div className="mb-3 flex items-center space-x-2">
                    <input type="number" value={tempGoal} onChange={(e) => setTempGoal(Number(e.target.value))} className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20" min="1" />
                    <button onClick={handleGoalSave} className="text-green-400 hover:text-green-300"><FiCheckCircle size={16} /></button>
                    <button onClick={handleGoalCancel} className="text-red-400 hover:text-red-300"><FiX size={16} /></button>
                </div>
            )}
            {isLoading ? <div className="flex justify-center items-center h-10"><FiLoader className="animate-spin text-emerald-400 text-2xl" /></div> : (
                <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between"><span className="text-sm font-medium text-gray-400">{valueText}</span><span className="text-sm font-medium text-gray-400">{displayPercentage.toFixed(0)}%</span></div>
                    <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded bg-gray-700"><div style={{ width: `${displayPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-out rounded" role="progressbar"></div></div>
                </div>
            )}
        </div>
    );
});
const CircularProgress = memo(({ label, percentage, current, goal, unit, color = '#10b981', size = 120, strokeWidth = 8, isLoading }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;
    if (isLoading) return <div className="flex flex-col items-center justify-center h-32"><FiLoader className="animate-spin text-emerald-400 text-2xl mb-2" /><span className="text-xs text-gray-400">{label}</span></div>;
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <svg className="transform -rotate-90" width={size} height={size}><circle cx={size / 2} cy={size / 2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="transparent" /><circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-out" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-bold text-white">{Math.round(percentage)}%</span><span className="text-xs text-gray-400">{Math.round(current)}/{goal}</span></div>
            </div>
            <div className="mt-2 text-center"><div className="text-sm font-medium text-gray-200">{label}</div><div className="text-xs text-gray-400">{unit}</div></div>
        </div>
    );
});
const NutritionForm = memo(({ onSubmit, isSubmitting }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [customNutrition, setCustomNutrition] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    const [useCustomFood, setUseCustomFood] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        let nutritionData;
        if (useCustomFood) {
            if (!customNutrition.name || !customNutrition.calories) { alert('Please provide at least food name and calories'); return; }
            nutritionData = { ...customNutrition, calories: parseFloat(customNutrition.calories) || 0, protein: parseFloat(customNutrition.protein) || 0, carbs: parseFloat(customNutrition.carbs) || 0, fats: parseFloat(customNutrition.fats) || 0 };
        } else {
            const food = COMMON_FOODS.find(f => f.name === selectedFood);
            if (!food) { alert('Please select a food item'); return; }
            const qty = parseFloat(quantity) || 1;
            nutritionData = { name: `${food.name} x${qty}`, calories: Number((food.calories * qty).toFixed(2)), protein: Number((food.protein * qty).toFixed(2)), carbs: Number((food.carbs * qty).toFixed(2)), fats: Number((food.fats * qty).toFixed(2)) };
        }
        Object.keys(nutritionData).forEach(key => { if (key !== 'name' && (isNaN(nutritionData[key]) || nutritionData[key] === null)) nutritionData[key] = 0; });
        onSubmit(nutritionData);
        setSelectedFood(''); setQuantity(1); setCustomNutrition({ name: '', calories: '', protein: '', carbs: '', fats: '' }); setUseCustomFood(false);
    };
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" checked={!useCustomFood} onChange={() => setUseCustomFood(false)} className="mr-2 text-emerald-500" disabled={isSubmitting} /><span className="text-sm text-gray-300">Quick Add</span></label><label className="flex items-center"><input type="radio" checked={useCustomFood} onChange={() => setUseCustomFood(true)} className="mr-2 text-emerald-500" disabled={isSubmitting} /><span className="text-sm text-gray-300">Custom Food</span></label></div>
                {!useCustomFood ? (
                    <div className="grid grid-cols-1 gap-4">
                        <div><label className="text-sm font-medium text-gray-400 mb-1 block">Food Item *</label><select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)} className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500" required disabled={isSubmitting}><option value="">Select Food</option>{COMMON_FOODS.map((food, index) => <option key={index} value={food.name}>{food.name} ({food.calories} kcal)</option>)}</select></div>
                        <div><label className="text-sm font-medium text-gray-400 mb-1 block">Quantity (servings)</label><input type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)} className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500" min="0.1" step="0.1" required disabled={isSubmitting} /></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div><label className="text-sm font-medium text-gray-400 mb-1 block">Food Name *</label><input type="text" value={customNutrition.name} onChange={(e) => setCustomNutrition(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3" placeholder="e.g., Sandwich" required disabled={isSubmitting} /></div>
                        <div><label className="text-sm font-medium text-gray-400 mb-1 block">Calories (kcal) *</label><input type="number" value={customNutrition.calories} onChange={(e) => setCustomNutrition(prev => ({ ...prev, calories: e.target.value }))} className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3" placeholder="e.g., 350" required disabled={isSubmitting} /></div>
                        <div className="grid grid-cols-3 gap-3">
                            <div><label className="text-xs font-medium text-gray-400 mb-1 block">Protein (g)</label><input type="number" value={customNutrition.protein} onChange={(e) => setCustomNutrition(prev => ({ ...prev, protein: e.target.value }))} className="w-full rounded-md bg-gray-700 text-gray-200 py-1 px-2 text-sm" placeholder="0" disabled={isSubmitting} /></div>
                            <div><label className="text-xs font-medium text-gray-400 mb-1 block">Carbs (g)</label><input type="number" value={customNutrition.carbs} onChange={(e) => setCustomNutrition(prev => ({ ...prev, carbs: e.target.value }))} className="w-full rounded-md bg-gray-700 text-gray-200 py-1 px-2 text-sm" placeholder="0" disabled={isSubmitting} /></div>
                            <div><label className="text-xs font-medium text-gray-400 mb-1 block">Fats (g)</label><input type="number" value={customNutrition.fats} onChange={(e) => setCustomNutrition(prev => ({ ...prev, fats: e.target.value }))} className="w-full rounded-md bg-gray-700 text-gray-200 py-1 px-2 text-sm" placeholder="0" disabled={isSubmitting} /></div>
                        </div>
                    </div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50">{isSubmitting ? <><FiLoader className="inline mr-2 animate-spin" />Adding...</> : 'Add Food'}</button>
            </form>
        </div>
    );
});
const RepTrackingForm = memo(({ onSubmit, isSubmitting }) => {
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);
    const handleSetChange = (index, field, value) => { const newSets = [...sets]; newSets[index][field] = value; setSets(newSets); };
    const addSet = () => setSets([...sets, { reps: '', weight: '' }]);
    const removeSet = (index) => { const newSets = sets.filter((_, i) => i !== index); setSets(newSets); };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!exerciseName.trim()) { alert("Please enter an exercise name."); return; }
        const validSets = sets.filter(s => s.reps > 0);
        if (validSets.length === 0) { alert("Please enter at least one valid set (reps > 0)."); return; }
        onSubmit({ exerciseName, sets: validSets });
        setExerciseName(""); setSets([{ reps: '', weight: '' }]);
    };
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="Exercise Name (e.g., Push Ups)" className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-2 px-3 focus:ring-2 focus:ring-emerald-500" required disabled={isSubmitting} />
                {sets.map((set, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-400 font-medium">Set {index + 1}</span>
                        <input type="number" value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} placeholder="Reps" className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-1 px-2 text-sm" min="0" />
                        <input type="number" value={set.weight} onChange={(e) => handleSetChange(index, 'weight', e.target.value)} placeholder="Weight (kg)" className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 py-1 px-2 text-sm" min="0" />
                        <button type="button" onClick={() => removeSet(index)} className="text-red-500 hover:text-red-400 p-1"><FiTrash2 /></button>
                    </div>
                ))}
                <button type="button" onClick={addSet} className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm"><FiPlus className="mr-1" /> Add Set</button>
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50">{isSubmitting ? 'Logging...' : 'Log Reps'}</button>
            </form>
        </div>
    );
});
const WeeklyPlanTable = memo(({ schedule, isEditable, onExerciseClick, onExerciseChange, highlightIndex }) => (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="min-w-full w-full border-collapse border border-gray-700">
            <thead><tr className="bg-gray-800"><th className="w-20 sm:w-24 md:w-32 p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-left">Day</th><th className="p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-center">Exercise 1</th><th className="p-2 sm:p-3 border border-gray-700 text-xs sm:text-sm md:text-base font-medium text-gray-400 uppercase tracking-wider text-center">Exercise 2</th></tr></thead>
            <tbody>
                {DAY_NAMES.map((day, index) => (
                    <tr key={index} className={`${index === highlightIndex ? "bg-emerald-900 bg-opacity-60" : "bg-gray-900 hover:bg-gray-800/60"} transition-colors duration-150`}>
                        <td className="p-2 sm:p-3 border border-gray-700 font-medium text-gray-300 text-xs sm:text-sm md:text-base"><div className="truncate"><span className="sm:hidden">{day.slice(0, 3)}</span><span className="hidden sm:inline">{day}</span></div></td>
                        {[0, 1].map((exerciseIndex) => (
                            <td key={exerciseIndex} className={`p-1 sm:p-2 border border-gray-700 text-center min-w-0 ${!isEditable && schedule[index]?.[exerciseIndex] ? "cursor-pointer group" : ""}`} onClick={() => !isEditable && schedule[index]?.[exerciseIndex] && onExerciseClick(schedule[index][exerciseIndex])} title={!isEditable && schedule[index]?.[exerciseIndex] ? `Go to ${schedule[index][exerciseIndex].replace("-", " ")} exercises` : (isEditable ? "Select an exercise" : "")}>
                                {isEditable ? (<select value={schedule[index]?.[exerciseIndex] || ""} onChange={(e) => onExerciseChange(index, exerciseIndex, e.target.value)} className="bg-gray-700 border border-gray-600 text-gray-200 p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm md:text-base focus:ring-emerald-500 focus:border-emerald-500 appearance-none text-center min-w-0" onClick={(e) => e.stopPropagation()}><option value="">-- Select --</option><option value="">None</option>{AVAILABLE_EXERCISES.map((exercise) => <option key={exercise} value={exercise} className="capitalize">{exercise.charAt(0).toUpperCase() + exercise.slice(1)}</option>)}</select>) : (<div className="px-1 sm:px-2 py-1 min-w-0">{schedule[index]?.[exerciseIndex] ? <span className="text-xs sm:text-sm md:text-base capitalize inline-block group-hover:text-emerald-400 transition-colors truncate w-full" title={schedule[index][exerciseIndex].replace("-", " ")}>{schedule[index][exerciseIndex].replace("-", " ")}</span> : <span className="text-gray-600 italic text-xs"><span className="sm:hidden">-</span><span className="hidden sm:inline">Empty</span></span>}</div>)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));
const GeneralActivityForm = memo(({ onSubmit, isSubmitting }) => {
    const [duration, setDuration] = useState("");
    const [steps, setSteps] = useState("");
    const [exercises, setExercises] = useState([]);

    const handleExerciseToggle = (exerciseName) => {
        setExercises(prev => 
            prev.includes(exerciseName) 
                ? prev.filter(ex => ex !== exerciseName) 
                : [...prev, exerciseName]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ duration, steps, exercises });
        setDuration(""); setSteps(""); setExercises([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label htmlFor="logDuration" className="text-sm font-medium text-gray-400 mb-1 flex items-center"><FiClock className="mr-1.5"/> Duration (mins)</label><input type="number" id="logDuration" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3" min="0" max="600" placeholder="e.g., 30" disabled={isSubmitting} /></div>
                <div><label htmlFor="logSteps" className="text-sm font-medium text-gray-400 mb-1 flex items-center"><FaWalking className="mr-1.5"/> Steps</label><input type="number" id="logSteps" value={steps} onChange={(e) => setSteps(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3" min="0" max="100000" placeholder="e.g., 5000" disabled={isSubmitting} /></div>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center"><FaDumbbell className="mr-1.5"/> Muscle Groups Trained (Optional)</label>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_EXERCISES.map(ex => (
                        <button
                            key={ex}
                            type="button"
                            onClick={() => handleExerciseToggle(ex)}
                            disabled={isSubmitting}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors capitalize ${
                                exercises.includes(ex) 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
            <div className="text-center pt-3"><button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 px-8 py-2.5 rounded-md font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 shadow-md disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? <><FiLoader className="mr-1.5 animate-spin" /> Logging...</> : <><FiCheckCircle className="mr-1.5" /> Log General Activity</>}</button></div>
        </form>
    );
});

// ======================== MAIN COMPONENT ========================
const Dashboard = () => {
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    const { toasts, addToast, removeToast } = useToast();
    const { goals, updateGoal } = useUserGoals();
    const { nutritionGoals, updateNutritionGoal } = useNutritionGoals();
    // State for the weekly plan and its edit mode
    const { schedule, setSchedule, saveSchedule } = useWeeklySchedule();
    const { fixedExercises, setFixedExercises, saveExercises } = useFixedExercises();
    const [isPlanEditable, setIsPlanEditable] = useState(false);
    const [tempSchedule, setTempSchedule] = useState(schedule);
    const [tempFixedExercises, setTempFixedExercises] = useState(fixedExercises);

    const [logDate, setLogDate] = useState(formatDateToUTCDayString(new Date()));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNutritionOpen, setIsNutritionOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(true);
    const { progressData, isLoading: isLoadingProgress, refetch: refetchProgress } = useWorkoutProgress(currentUser, logDate);
    const { nutritionData, isLoading: isLoadingNutrition, refetch: refetchNutrition } = useNutritionProgress(currentUser, logDate);
    const { chartData, isLoading: isLoadingChart, refetch: refetchChart } = useChartData(currentUser);
    const { repLogs, isLoading: isLoadingReps, refetch: refetchReps } = useRepTracking(currentUser, logDate);

    const chartOptions = useMemo(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#e5e7eb' } }, title: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleColor: '#fff', bodyColor: '#fff', padding: 10, cornerRadius: 4 } }, scales: { x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, border: { color: '#4b5563' } }, y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, border: { color: '#4b5563' }, beginAtZero: true } } }), []);
    const todayIndex = useMemo(() => { const today = new Date().getDay(); return today === 0 ? -1 : today - 1; }, []);
    const hasChartData = useMemo(() => chartData.labels.length > 0 && chartData.datasets[0].data.some(d => d > 0), [chartData]);
    
    // Set temporary states when the main states are loaded from localStorage
    useEffect(() => { setTempSchedule(schedule) }, [schedule]);
    useEffect(() => { setTempFixedExercises(fixedExercises) }, [fixedExercises]);

    const handleLogout = useCallback(async () => {
        try { await signOut(auth); navigate("/", { replace: true }); } 
        catch (error) { console.error("Logout failed:", error.message); addToast(`Logout failed: ${error.message}`, TOAST_TYPES.ERROR); }
    }, [navigate, addToast]);

    const handleExerciseNavigation = useCallback((exerciseName) => {
        if (exerciseName) { navigate(`/exercises/${exerciseName.toLowerCase()}`); }
    }, [navigate]);

    const handleLogGeneralActivity = useCallback(async (generalData) => {
        const { duration, steps, exercises } = generalData;
        const formData = { date: logDate, duration: parseInt(duration, 10) || 0, steps: parseInt(steps, 10) || 0, exercises: exercises };
        const { isValid, errors } = validateWorkoutForm(formData);
        if (!isValid) { addToast(errors.general || Object.values(errors)[0], TOAST_TYPES.ERROR); return; }
        if (!currentUser) { addToast("You must be logged in.", TOAST_TYPES.ERROR); navigate("/"); return; }
        const workoutData = { userId: currentUser.uid, date: getStartOfDayUTC(logDate), duration: formData.duration, steps: formData.steps, exercises: formData.exercises, createdAt: serverTimestamp() };
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "workoutLogs"), workoutData);
            addToast(`Workout logged for ${logDate}!`, TOAST_TYPES.SUCCESS);
            refetchProgress(); refetchChart();
        } catch (error) { addToast(`Failed to log workout: ${error.message}`, TOAST_TYPES.ERROR); } 
        finally { setIsSubmitting(false); }
    }, [logDate, currentUser, addToast, navigate, refetchProgress, refetchChart]);

    const handleLogNutrition = useCallback(async (nutritionInfo) => {
        if (!currentUser) { addToast("You must be logged in.", TOAST_TYPES.ERROR); navigate("/"); return; }
        if (!nutritionInfo || !nutritionInfo.name) { addToast("Invalid nutrition data.", TOAST_TYPES.ERROR); return; }
        const nutritionData = { userId: currentUser.uid, date: getStartOfDayUTC(logDate), foodName: String(nutritionInfo.name || ''), calories: Number(nutritionInfo.calories || 0), protein: Number(nutritionInfo.protein || 0), carbs: Number(nutritionInfo.carbs || 0), fats: Number(nutritionInfo.fats || 0), fiber: Number(nutritionInfo.fiber || 0), sugar: Number(nutritionInfo.sugar || 0), sodium: Number(nutritionInfo.sodium || 0), vitamin_c: Number(nutritionInfo.vitamin_c || 0), vitamin_d: Number(nutritionInfo.vitamin_d || 0), calcium: Number(nutritionInfo.calcium || 0), iron: Number(nutritionInfo.iron || 0), potassium: Number(nutritionInfo.potassium || 0), createdAt: serverTimestamp() };
        if (nutritionData.calories <= 0) { addToast("Please provide calorie information.", TOAST_TYPES.ERROR); return; }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "nutritionLogs"), nutritionData);
            addToast(`${nutritionInfo.name} added!`, TOAST_TYPES.SUCCESS);
            setTimeout(() => refetchNutrition(), 1000);
        } catch (error) { addToast(`Failed to log nutrition: ${error.message}`, TOAST_TYPES.ERROR); } 
        finally { setIsSubmitting(false); }
    }, [currentUser, logDate, addToast, navigate, refetchNutrition]);

    const handleLogReps = useCallback(async (repData) => {
        if (!currentUser) { addToast("You must be logged in to log reps.", TOAST_TYPES.ERROR); return; }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "repLogs"), { userId: currentUser.uid, date: getStartOfDayUTC(logDate), exerciseName: repData.exerciseName, sets: repData.sets, createdAt: serverTimestamp() });
            addToast(`${repData.exerciseName} logged successfully!`, TOAST_TYPES.SUCCESS);
            refetchReps();
        } catch (error) { addToast(`Failed to log reps: ${error.message}`, TOAST_TYPES.ERROR); } 
       finally { setIsSubmitting(false); }
    }, [currentUser, logDate, addToast, refetchReps]);

    const handleDeleteRepLog = useCallback(async (logId) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            await deleteDoc(doc(db, "repLogs", logId));
            addToast("Log deleted.", TOAST_TYPES.INFO);
            refetchReps();
        } catch (error) { addToast("Failed to delete log.", TOAST_TYPES.ERROR); } 
       finally { setIsSubmitting(false); }
    }, [currentUser, addToast, refetchReps]);

    // Handlers for editing the workout plan
    const handlePlanEditToggle = () => {
        if (isPlanEditable) { // When clicking "Cancel"
            setTempSchedule(schedule); // Revert changes
            setTempFixedExercises(fixedExercises);
        }
        setIsPlanEditable(!isPlanEditable);
    };

    const handlePlanSave = () => {
        saveSchedule(tempSchedule);
        saveExercises(tempFixedExercises);
        setIsPlanEditable(false);
        addToast("Workout plan saved!", TOAST_TYPES.SUCCESS);
    };

    const handleWeeklyExerciseChange = (dayIndex, exerciseIndex, value) => {
        const newSchedule = [...tempSchedule];
        newSchedule[dayIndex] = [...(newSchedule[dayIndex] || [])];
        newSchedule[dayIndex][exerciseIndex] = value;
        setTempSchedule(newSchedule);
    };
    
    const handleAddFixedExercise = (exercise) => {
        if (exercise && !tempFixedExercises.includes(exercise)) {
            setTempFixedExercises([...tempFixedExercises, exercise]);
        }
    };

    const handleRemoveFixedExercise = (index) => {
        setTempFixedExercises(tempFixedExercises.filter((_, i) => i !== index));
    };


    if (!currentUser) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-center"><FiLoader className="animate-spin text-emerald-400 text-4xl mb-4 mx-auto" /><p className="text-gray-400">Loading user data...</p></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200">
            <Header currentUser={currentUser} onLogout={handleLogout} />
            {toasts.map(toast => <Toast key={toast.id} toast={toast} onRemove={removeToast} />)}
            
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-100">Welcome, {currentUser.displayName || 'Fitness Pro'}!</h2>
                    
                    <div className="bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <button onClick={() => setIsActivityOpen(!isActivityOpen)} className="w-full flex justify-between items-center p-6 text-left">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 flex items-center"><FiActivity className="mr-3 text-emerald-400" />Log General Activity - {formatDate(new Date(logDate + 'T12:00:00Z'))}</h2>
                            {isActivityOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                        </button>
                        {isActivityOpen && (
                            <div className="p-6 pt-0">
                                <GeneralActivityForm onSubmit={handleLogGeneralActivity} isSubmitting={isSubmitting} />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 flex items-center mb-6"><FaDumbbell className="mr-2 text-emerald-400 text-base sm:text-lg"/>Today's Lifts & Rep Tracking</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">Log New Lift</h3>
                                <RepTrackingForm onSubmit={handleLogReps} isSubmitting={isSubmitting} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">Today's Lifts</h3>
                                {isLoadingReps ? <FiLoader className="animate-spin text-emerald-400 mx-auto mt-4" /> : repLogs.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {repLogs.map(log => (
                                            <div key={log.id || log.createdAt} className="bg-gray-800 p-3 rounded-lg relative group">
                                                <p className="font-bold text-emerald-400">{log.exerciseName}</p>
                                                <ul className="text-sm text-gray-300 mt-1 list-disc list-inside">
                                                    {log.sets.map((set, i) => ( <li key={i}>{set.reps} reps @ {set.weight || 0} kg</li> ))}
                                                </ul>
                                                <button onClick={() => handleDeleteRepLog(log.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Log"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 mt-4 text-center lg:text-left">No lifts logged for this day.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <button onClick={() => setIsNutritionOpen(!isNutritionOpen)} className="w-full flex justify-between items-center p-6 text-left">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 flex items-center"><FaSeedling className="mr-3 text-green-400" />Nutrition Tracking - {formatDate(new Date(logDate + 'T12:00:00Z'))}</h2>
                            {isNutritionOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                        </button>
                        {isNutritionOpen && (
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1"><h3 className="text-lg font-semibold mb-4 text-gray-200">Add Food</h3><NutritionForm onSubmit={handleLogNutrition} isSubmitting={isSubmitting} /></div>
                                    <div className="lg:col-span-1"><h3 className="text-lg font-semibold mb-4 text-gray-200">Macronutrients</h3><div className="grid grid-cols-2 gap-4">{MACRO_NUTRIENTS.map(n => <CircularProgress key={n} label={n.charAt(0)+n.slice(1).toLowerCase()} percentage={(nutritionData[n.toLowerCase()]||0)/(nutritionGoals[n]||1)*100} current={nutritionData[n.toLowerCase()]||0} goal={nutritionGoals[n]} unit={NUTRITION_UNITS[n]} color={n==='CALORIES'?'#f59e0b':n==='PROTEIN'?'#ef4444':n==='CARBS'?'#3b82f6':'#10b981'} size={100} isLoading={isLoadingNutrition}/>)}</div></div>
                                    <div className="lg:col-span-1"><h3 className="text-lg font-semibold mb-4 text-gray-200">Micronutrients</h3><div className="grid grid-cols-2 gap-3">{MICRO_NUTRIENTS.map(n => <CircularProgress key={n} label={n.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())} percentage={(nutritionData[n.toLowerCase()]||0)/(nutritionGoals[n]||1)*100} current={nutritionData[n.toLowerCase()]||0} goal={nutritionGoals[n]} unit={NUTRITION_UNITS[n]} color="#8b5cf6" size={80} isLoading={isLoadingNutrition}/>)}</div></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-5">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 flex items-center"><FaTable className="mr-2 text-emerald-400 text-base sm:text-lg"/> <span className="truncate">Weekly Workout Plan</span></h2>
                            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                                {isPlanEditable ? (
                                    <>
                                        <button onClick={handlePlanSave} className="flex items-center justify-center bg-emerald-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-emerald-500 transition text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 shadow whitespace-nowrap"><FiSave className="mr-1 sm:mr-1.5" size={14} /> Save Plan</button>
                                        <button onClick={handlePlanEditToggle} className="flex items-center justify-center bg-gray-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-gray-500 transition text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 shadow whitespace-nowrap"><FiX className="mr-1 sm:mr-1.5" size={14} /> Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={handlePlanEditToggle} className="flex items-center justify-center bg-yellow-500 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-yellow-400 transition text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 shadow whitespace-nowrap"><FiEdit className="mr-1 sm:mr-1.5" size={14} /> Change Plan</button>
                                )}
                            </div>
                        </div>
                        <WeeklyPlanTable schedule={isPlanEditable ? tempSchedule : schedule} isEditable={isPlanEditable} onExerciseClick={handleExerciseNavigation} onExerciseChange={handleWeeklyExerciseChange} highlightIndex={todayIndex} />
                    
                        {/* Editable Fixed Exercises Section */}
                        <div className="mt-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-3">Daily Exercises</h3>
                            {!isPlanEditable && (fixedExercises.length === 0) && <p className="text-sm text-gray-500">No additional exercises. Click 'Change Plan' to add.</p>}
                            <div className="flex flex-wrap gap-2">
                                {(isPlanEditable ? tempFixedExercises : fixedExercises).map((ex, index) => (
                                    <div key={index} className="flex items-center bg-gray-800 rounded-full px-3 py-1 group">
                                        {/* THIS IS THE FIX: Added onClick and interactive styles to the span */}
                                        <span 
                                            className={`text-sm capitalize ${!isPlanEditable && 'cursor-pointer group-hover:text-emerald-400 transition-colors'}`}
                                            onClick={() => !isPlanEditable && handleExerciseNavigation(ex)}
                                            title={!isPlanEditable ? `Go to ${ex} exercises` : ''}
                                        >
                                            {ex}
                                        </span>
                                        {isPlanEditable && (
                                            <button onClick={() => handleRemoveFixedExercise(index)} className="ml-2 text-red-400 hover:text-red-300">
                                                <FiX size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {isPlanEditable && (
                                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2">
                                    <select 
                                        onChange={(e) => {
                                            handleAddFixedExercise(e.target.value);
                                            e.target.value = "";
                                        }}
                                        className="bg-gray-700 border border-gray-600 text-gray-200 p-2 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="">-- Add an exercise --</option>
                                        {AVAILABLE_EXERCISES.map(ex => (
                                            <option key={ex} value={ex} className="capitalize">{ex}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="bg-gray-900 p-6 rounded-xl shadow-lg col-span-1 lg:col-span-1 flex flex-col border border-gray-700 order-first"><h2 className="text-lg font-semibold mb-4 text-gray-100 flex items-center"><FiTrendingUp className="mr-2 text-emerald-400"/> Workout Trend (7 Days)</h2><div className="flex-grow" style={{minHeight:'250px'}}>{isLoadingChart ? <ChartSkeleton /> : (hasChartData ? <Line data={chartData} options={chartOptions} /> : <p className="text-gray-500 text-center mt-10">No workout data to display.</p>)}</div></div>
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700"><ProgressBar label="Workout Duration Goal" percentage={goals.WORKOUT_DURATION > 0 ? Math.min(100, (progressData.duration / goals.WORKOUT_DURATION) * 100) : 0} valueText={`${progressData.duration} / ${goals.WORKOUT_DURATION} mins`} icon={<FaPersonRunning size="1.1em"/>} isLoading={isLoadingProgress} goal={goals.WORKOUT_DURATION} onGoalChange={(v) => updateGoal('WORKOUT_DURATION', v)} /></div>
                            <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-700"><ProgressBar label="Daily Steps Goal" percentage={goals.DAILY_STEPS > 0 ? Math.min(100, (progressData.steps / goals.DAILY_STEPS) * 100) : 0} valueText={`${progressData.steps} / ${goals.DAILY_STEPS} steps`} icon={<FaWalking size="1.1em"/>} isLoading={isLoadingProgress} goal={goals.DAILY_STEPS} onGoalChange={(v) => updateGoal('DAILY_STEPS', v)} /></div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center mb-10 border border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 flex items-center justify-center"><GiLotus className="mr-2 text-purple-400"/> Today's Yoga / Flexibility</h2>
                        <div className="max-w-md mx-auto mb-6"><ProgressBar label="Flexibility Goal" percentage={goals.YOGA_DURATION > 0 ? Math.min(100, (progressData.yogaDuration / goals.YOGA_DURATION) * 100) : 0} valueText={`${progressData.yogaDuration} / ${goals.YOGA_DURATION} mins`} icon={<FaSeedling size="1.1em" className="text-purple-400"/>} isLoading={isLoadingProgress} goal={goals.YOGA_DURATION} onGoalChange={(v) => updateGoal('YOGA_DURATION', v)} /></div>
                        <button onClick={() => navigate("/exercises/yoga")} className="inline-flex items-center bg-purple-600 px-6 py-2.5 rounded-md font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 shadow-md">Explore Yoga Poses</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;