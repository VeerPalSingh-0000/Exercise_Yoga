import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { FiEdit, FiSave, FiTrendingUp, FiLoader, FiSettings, FiX } from 'react-icons/fi';
import { FaTable, FaWalking, FaSeedling } from 'react-icons/fa';
import { FaPersonRunning } from 'react-icons/fa6';
import { GiLotus } from 'react-icons/gi';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Chart.js Registration
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Configuration & Utilities (You might consider moving these to separate files like config.js and utils.js)
const FITNESS_GOALS = { WORKOUT_DURATION: 45, DAILY_STEPS: 5000, YOGA_DURATION: 25 };
const AVAILABLE_EXERCISES = ["chest", "bicep", "tricep", "leg", "shoulder", "back", "abs", "yoga", "running", "cardio", "stretching", "arm", "keggle"];
const DEFAULT_WEEKLY_SCHEDULE = [["chest", "tricep"], ["back", "bicep"], ["leg", "shoulder"], ["chest", "abs"], ["back", "tricep"], ["leg", "bicep"]];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const NUTRITION_GOALS = { CALORIES: 2000, PROTEIN: 150, CARBS: 250, FATS: 65 };
const NUTRITION_UNITS = { CALORIES: 'kcal', PROTEIN: 'g', CARBS: 'g', FATS: 'g' };
const MACRO_NUTRIENTS = ['CALORIES', 'PROTEIN', 'CARBS', 'FATS'];

const formatDateToUTCDayString = (dateObj) => {
    if (!dateObj) return "";
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getStartOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T00:00:00.000Z'));
const getEndOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T23:59:59.999Z'));

// Custom Hooks
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

const useWorkoutProgress = (currentUser) => {
    const [progressData, setProgressData] = useState({ duration: 0, steps: 0, yogaDuration: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);

    useEffect(() => {
        const fetchProgress = async () => {
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
        };
        fetchProgress();
    }, [currentUser, logDate]);

    return { progressData, isLoading };
};

const useNutritionProgress = (currentUser) => {
    const [nutritionData, setNutritionData] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);

    useEffect(() => {
        const fetchNutritionProgress = async () => {
            if (!currentUser || !logDate) return;
            setIsLoading(true);
            try {
                const q = query(collection(db, "nutritionLogs"), where("userId", "==", currentUser.uid), where("date", ">=", getStartOfDayUTC(logDate)), where("date", "<=", getEndOfDayUTC(logDate)));
                const querySnapshot = await getDocs(q);
                const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    Object.keys(totals).forEach(nutrient => {
                        if (data[nutrient] !== undefined && !isNaN(data[nutrient])) totals[nutrient] += Number(data[nutrient]);
                    });
                });
                setNutritionData(totals);
            } catch (error) { console.error("Error fetching nutrition progress:", error); }
            finally { setIsLoading(false); }
        };
        fetchNutritionProgress();
    }, [currentUser, logDate]);
    return { nutritionData, isLoading };
};


const useChartData = (currentUser) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [{ label: "Workout Duration (mins)", data: [], borderColor: "rgb(52, 211, 153)", backgroundColor: "rgba(52, 211, 153, 0.2)", tension: 0.3, fill: true, pointBackgroundColor: "rgb(52, 211, 153)", pointBorderColor: "#fff", pointHoverRadius: 7, pointHoverBackgroundColor: "rgb(52, 211, 153)", pointHoverBorderColor: "#fff" }] });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchChartData = async () => {
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
        };
        fetchChartData();
    }, [currentUser]);
    return { chartData, isLoading };
};

const useWeeklySchedule = () => {
    const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);
    useEffect(() => {
        const savedSchedule = localStorage.getItem("userWeeklySchedule");
        if (savedSchedule) {
            try {
                const parsedSchedule = JSON.parse(savedSchedule);
                if (Array.isArray(parsedSchedule) && parsedSchedule.length === 6) setSchedule(parsedSchedule);
            } catch (error) { /* ignore */ }
        }
    }, []);
    const saveSchedule = useCallback((newSchedule) => {
        const scheduleToSave = newSchedule.map(day => day || []);
        localStorage.setItem("userWeeklySchedule", JSON.stringify(scheduleToSave));
        setSchedule(newSchedule);
    }, []);
    return { schedule, setSchedule, saveSchedule };
};

// UI Components
const ProgressBar = memo(({ label, percentage, valueText, icon, isLoading, goal, onGoalChange }) => {
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal);
    const displayPercentage = Math.min(100, Math.max(0, percentage));
    const handleGoalSave = () => { if (tempGoal > 0) { onGoalChange?.(tempGoal); setIsEditingGoal(false); } };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">{icon && <span className="text-emerald-400 mr-2">{icon}</span>}<h3 className="text-base font-semibold text-gray-200">{label}</h3></div>
                {onGoalChange && <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="text-gray-400 hover:text-emerald-400 transition-colors" title="Edit goal"><FiSettings size={16} /></button>}
            </div>
            {isEditingGoal && (
                <div className="mb-3 flex items-center space-x-2">
                    <input type="number" value={tempGoal} onChange={(e) => setTempGoal(Number(e.target.value))} className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20" min="1" />
                    <button onClick={handleGoalSave} className="text-green-400 hover:text-green-300">Save</button>
                </div>
            )}
            {isLoading ? <div className="h-10 flex items-center justify-center"><FiLoader className="animate-spin text-emerald-400 text-2xl" /></div> : (
                <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between"><span className="text-sm font-medium text-gray-400">{valueText}</span><span className="text-sm font-medium text-gray-400">{displayPercentage.toFixed(0)}%</span></div>
                    <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded bg-gray-700"><div style={{ width: `${displayPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500 ease-out rounded"></div></div>
                </div>
            )}
        </div>
    );
});

const CircularProgress = memo(({ label, percentage, current, goal, unit, color = '#10b981', isLoading }) => {
    const size = 100, strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;
    if (isLoading) return <div className="flex flex-col items-center justify-center h-28"><FiLoader className="animate-spin text-emerald-400 text-2xl mb-2" /><span className="text-xs text-gray-400">{label}</span></div>;
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <svg className="transform -rotate-90" width={size} height={size}><circle cx={size / 2} cy={size / 2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="transparent" /><circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-out" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-bold text-white">{Math.round(percentage)}%</span></div>
            </div>
            <div className="mt-2 text-center"><div className="text-sm font-medium text-gray-200">{label}</div><div className="text-xs text-gray-400">{Math.round(current)}/{goal} {unit}</div></div>
        </div>
    );
});

const WeeklyPlanTable = memo(({ schedule, isEditable, onExerciseClick, onExerciseChange, highlightIndex }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full w-full border-collapse border border-gray-700">
            <thead><tr className="bg-gray-800"><th className="p-3 border border-gray-700 text-sm font-medium text-gray-400 uppercase text-left">Day</th><th className="p-3 border border-gray-700 text-sm font-medium text-gray-400 uppercase text-center">Focus</th></tr></thead>
            <tbody>
                {DAY_NAMES.map((day, index) => (
                    <tr key={index} className={`${index === highlightIndex ? "bg-emerald-900/60" : "bg-gray-900 hover:bg-gray-800/60"} transition-colors`}>
                        <td className="p-3 border border-gray-700 font-medium text-gray-300">{day}</td>
                        <td className={`p-2 border border-gray-700 text-center`}>
                            {isEditable ? (
                                <div className="flex gap-2 justify-center">
                                    <select value={schedule[index]?.[0] || ""} onChange={(e) => onExerciseChange(index, 0, e.target.value)} className="bg-gray-700 p-2 rounded w-full text-sm"><option value="">None</option>{AVAILABLE_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}</select>
                                    <select value={schedule[index]?.[1] || ""} onChange={(e) => onExerciseChange(index, 1, e.target.value)} className="bg-gray-700 p-2 rounded w-full text-sm"><option value="">None</option>{AVAILABLE_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}</select>
                                </div>
                            ) : (
                                <div className="flex gap-2 justify-center">
                                    {schedule[index]?.map(ex => ex && <span key={ex} onClick={() => onExerciseClick(ex)} className="bg-gray-700 capitalize text-gray-200 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-emerald-600">{ex}</span>)}
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));


const Dashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate("/", { replace: true });
            }
        });
        return unsubscribe;
    }, [navigate]);

    const { goals, updateGoal } = useUserGoals();
    const { schedule, setSchedule, saveSchedule } = useWeeklySchedule();
    const [isPlanEditable, setIsPlanEditable] = useState(false);
    const [tempSchedule, setTempSchedule] = useState(schedule);

    const { progressData, isLoading: isLoadingProgress } = useWorkoutProgress(currentUser);
    const { nutritionData, isLoading: isLoadingNutrition } = useNutritionProgress(currentUser);
    const { chartData, isLoading: isLoadingChart } = useChartData(currentUser);

    const chartOptions = useMemo(() => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }, y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, beginAtZero: true } } }), []);
    const todayIndex = useMemo(() => { const today = new Date().getDay(); return today === 0 ? 6 : today - 1; }, []);

    useEffect(() => { setTempSchedule(schedule) }, [schedule]);

    const handleLogout = useCallback(async () => {
        try { await signOut(auth); navigate("/", { replace: true }); }
        catch (error) { console.error("Logout failed:", error.message); }
    }, [navigate]);
    
    const handleExerciseNavigation = useCallback((exerciseName) => {
        if (exerciseName) { navigate(`/exercises/${exerciseName.toLowerCase()}`); }
    }, [navigate]);

    const handlePlanSave = () => {
        saveSchedule(tempSchedule);
        setIsPlanEditable(false);
    };
    
    const handleWeeklyExerciseChange = (dayIndex, exerciseIndex, value) => {
        const newSchedule = [...tempSchedule];
        newSchedule[dayIndex] = [...(newSchedule[dayIndex] || [])];
        newSchedule[dayIndex][exerciseIndex] = value || undefined;
        setTempSchedule(newSchedule);
    };

    if (!currentUser) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><FiLoader className="animate-spin text-emerald-400 text-4xl" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200">
            <Navbar currentUser={currentUser} onLogout={handleLogout} />

            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-100">Welcome, {currentUser.displayName || 'Fitness Pro'}!</h2>

                    {/* Today's Progress Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="bg-gray-900 p-6 rounded-xl shadow-lg lg:col-span-1 flex flex-col border border-gray-700">
                            <h3 className="text-lg font-semibold mb-4 text-gray-100 flex items-center"><FiTrendingUp className="mr-2 text-emerald-400" /> Workout Trend (7 Days)</h3>
                            <div className="flex-grow" style={{ minHeight: '250px' }}>{isLoadingChart ? <p>Loading Chart...</p> : <Line data={chartData} options={chartOptions} />}</div>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700"><ProgressBar label="Workout Duration" percentage={goals.WORKOUT_DURATION > 0 ? (progressData.duration / goals.WORKOUT_DURATION) * 100 : 0} valueText={`${progressData.duration} / ${goals.WORKOUT_DURATION} mins`} icon={<FaPersonRunning size="1.1em" />} isLoading={isLoadingProgress} goal={goals.WORKOUT_DURATION} onGoalChange={(v) => updateGoal('WORKOUT_DURATION', v)} /></div>
                            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700"><ProgressBar label="Daily Steps" percentage={goals.DAILY_STEPS > 0 ? (progressData.steps / goals.DAILY_STEPS) * 100 : 0} valueText={`${progressData.steps} / ${goals.DAILY_STEPS} steps`} icon={<FaWalking size="1.1em" />} isLoading={isLoadingProgress} goal={goals.DAILY_STEPS} onGoalChange={(v) => updateGoal('DAILY_STEPS', v)} /></div>
                        </div>
                    </div>

                    {/* Nutrition Summary Section */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-100 flex items-center mb-6"><FaSeedling className="mr-3 text-green-400" />Today's Nutrition</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                           {MACRO_NUTRIENTS.map(n => <CircularProgress key={n} label={n.charAt(0) + n.slice(1).toLowerCase()} percentage={(nutritionData[n.toLowerCase()] || 0) / (NUTRITION_GOALS[n] || 1) * 100} current={nutritionData[n.toLowerCase()] || 0} goal={NUTRITION_GOALS[n]} unit={NUTRITION_UNITS[n]} color={n === 'CALORIES' ? '#f59e0b' : n === 'PROTEIN' ? '#ef4444' : n === 'CARBS' ? '#3b82f6' : '#10b981'} isLoading={isLoadingNutrition} />)}
                        </div>
                    </div>

                    {/* Weekly Plan Section */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-semibold text-gray-100 flex items-center"><FaTable className="mr-3 text-emerald-400" /> Weekly Workout Plan</h3>
                            <div className="flex items-center space-x-2">
                                {isPlanEditable ? (
                                    <>
                                        <button onClick={handlePlanSave} className="flex items-center bg-emerald-600 px-4 py-1.5 rounded-md hover:bg-emerald-500 text-sm font-medium"><FiSave className="mr-1.5" /> Save</button>
                                        <button onClick={() => setIsPlanEditable(false)} className="flex items-center bg-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-500 text-sm font-medium"><FiX className="mr-1.5" /> Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsPlanEditable(true)} className="flex items-center bg-yellow-500 px-4 py-1.5 rounded-md hover:bg-yellow-400 text-sm font-medium text-gray-900"><FiEdit className="mr-1.5" /> Change Plan</button>
                                )}
                            </div>
                        </div>
                        <WeeklyPlanTable schedule={isPlanEditable ? tempSchedule : schedule} isEditable={isPlanEditable} onExerciseClick={handleExerciseNavigation} onExerciseChange={handleWeeklyExerciseChange} highlightIndex={todayIndex} />
                    </div>
                    
                     {/* Yoga Section */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-100 flex items-center justify-center"><GiLotus className="mr-2 text-purple-400" /> Yoga & Flexibility</h3>
                        <div className="max-w-md mx-auto mb-6"><ProgressBar label="Flexibility Goal" percentage={goals.YOGA_DURATION > 0 ? (progressData.yogaDuration / goals.YOGA_DURATION) * 100 : 0} valueText={`${progressData.yogaDuration} / ${goals.YOGA_DURATION} mins`} icon={<FaSeedling size="1.1em" className="text-purple-400" />} isLoading={isLoadingProgress} goal={goals.YOGA_DURATION} onGoalChange={(v) => updateGoal('YOGA_DURATION', v)} /></div>
                        <button onClick={() => navigate("/yoga")} className="inline-flex items-center bg-purple-600 px-6 py-2.5 rounded-md font-semibold text-white hover:bg-purple-500">Explore Yoga Routines</button>
                    </div>

                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Dashboard;