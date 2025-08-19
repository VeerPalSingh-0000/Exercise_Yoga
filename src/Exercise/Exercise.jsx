import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { FaWalking, FaSeedling } from 'react-icons/fa';
import { FaDumbbell } from 'react-icons/fa6';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Configuration (only what's needed for this page)
const TOAST_TYPES = { SUCCESS: 'success', ERROR: 'error', INFO: 'info' };
const AVAILABLE_EXERCISES = ["chest", "bicep", "tricep", "leg", "shoulder", "back", "abs", "yoga", "running", "cardio", "stretching", "arm", "keggle"];
const COMMON_FOODS = [
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fats: 1.8 },
    { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
    { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13 },
    { name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fats: 0.3 },
];

// Utilities
const formatDateToUTCDayString = (dateObj) => {
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getStartOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T00:00:00.000Z'));
const getEndOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + 'T23:59:59.999Z'));

// Custom Hooks
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);
    return { toasts, addToast };
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

// UI Components
const Toast = memo(({ toast }) => {
    const styles = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
    return <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${styles[toast.type]}`}>{toast.message}</div>;
});

const GeneralActivityForm = memo(({ onSubmit, isSubmitting }) => {
    const [duration, setDuration] = useState("");
    const [steps, setSteps] = useState("");
    const [exercises, setExercises] = useState([]);

    const handleExerciseToggle = (exName) => setExercises(prev => prev.includes(exName) ? prev.filter(e => e !== exName) : [...prev, exName]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ duration, steps, exercises });
        setDuration(""); setSteps(""); setExercises([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-medium text-gray-400 mb-1 flex items-center"><FiActivity className="mr-1.5" /> Duration (mins)</label><input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 py-2 px-3" min="0" placeholder="e.g., 30" disabled={isSubmitting} /></div>
                <div><label className="text-sm font-medium text-gray-400 mb-1 flex items-center"><FaWalking className="mr-1.5" /> Steps</label><input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-gray-200 py-2 px-3" min="0" placeholder="e.g., 5000" disabled={isSubmitting} /></div>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Muscle Groups (Optional)</label>
                <div className="flex flex-wrap gap-2">{AVAILABLE_EXERCISES.map(ex => (<button key={ex} type="button" onClick={() => handleExerciseToggle(ex)} disabled={isSubmitting} className={`px-3 py-1.5 text-sm rounded-full capitalize ${exercises.includes(ex) ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{ex}</button>))}</div>
            </div>
            <div className="text-center pt-3"><button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 px-8 py-2.5 rounded-md font-semibold text-white hover:bg-emerald-500 disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? <><FiLoader className="mr-1.5 animate-spin" /> Logging...</> : <><FiCheckCircle className="mr-1.5" /> Log Activity</>}</button></div>
        </form>
    );
});

const RepTrackingForm = memo(({ onSubmit, isSubmitting }) => {
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);
    const handleSetChange = (index, field, value) => { const newSets = [...sets]; newSets[index][field] = value; setSets(newSets); };
    const addSet = () => setSets([...sets, { reps: '', weight: '' }]);
    const removeSet = (index) => setSets(sets.filter((_, i) => i !== index));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!exerciseName.trim()) return;
        const validSets = sets.filter(s => s.reps > 0);
        if (validSets.length === 0) return;
        onSubmit({ exerciseName, sets: validSets });
        setExerciseName(""); setSets([{ reps: '', weight: '' }]);
    };
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="Exercise Name (e.g., Bench Press)" className="w-full rounded-md bg-gray-700 text-gray-200 py-2 px-3" required disabled={isSubmitting} />
                {sets.map((set, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-400 font-medium">Set {index + 1}</span>
                        <input type="number" value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} placeholder="Reps" className="w-full rounded-md bg-gray-700 text-gray-200 py-1 px-2 text-sm" />
                        <input type="number" value={set.weight} onChange={(e) => handleSetChange(index, 'weight', e.target.value)} placeholder="Weight (kg)" className="w-full rounded-md bg-gray-700 text-gray-200 py-1 px-2 text-sm" />
                        <button type="button" onClick={() => removeSet(index)} className="text-red-500 hover:text-red-400 p-1"><FiTrash2 /></button>
                    </div>
                ))}
                <div className="flex justify-between items-center">
                    <button type="button" onClick={addSet} className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm"><FiPlus className="mr-1" /> Add Set</button>
                    <button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50">{isSubmitting ? 'Logging...' : 'Log Reps'}</button>
                </div>
            </form>
        </div>
    );
});

const NutritionForm = memo(({ onSubmit, isSubmitting }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const [quantity, setQuantity] = useState(1);
    const handleSubmit = (e) => {
        e.preventDefault();
        const food = COMMON_FOODS.find(f => f.name === selectedFood);
        if (!food) return;
        const qty = parseFloat(quantity) || 1;
        const nutritionData = { name: `${food.name} x${qty}`, calories: food.calories * qty, protein: food.protein * qty, carbs: food.carbs * qty, fats: food.fats * qty };
        onSubmit(nutritionData);
        setSelectedFood(''); setQuantity(1);
    };
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)} className="w-full rounded-md bg-gray-700 text-gray-200 py-2 px-3" required disabled={isSubmitting}><option value="">Select Common Food</option>{COMMON_FOODS.map((food) => <option key={food.name} value={food.name}>{food.name}</option>)}</select>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-md bg-gray-700 text-gray-200 py-2 px-3" min="0.1" step="0.1" required disabled={isSubmitting} />
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50">{isSubmitting ? 'Adding...' : 'Add Food Log'}</button>
            </form>
        </div>
    );
});


const Exercise = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const { toasts, addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);
    const { repLogs, isLoading: isLoadingReps, refetch: refetchReps } = useRepTracking(currentUser, logDate);

    const [isActivityOpen, setIsActivityOpen] = useState(true);
    const [isLiftsOpen, setIsLiftsOpen] = useState(true);
    const [isNutritionOpen, setIsNutritionOpen] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) setCurrentUser(user);
            else navigate("/", { replace: true });
        });
        return unsubscribe;
    }, [navigate]);

    const handleLogout = useCallback(async () => {
        await signOut(auth);
        navigate("/", { replace: true });
    }, [navigate]);
    
    const handleLogGeneralActivity = useCallback(async (data) => {
        const workoutData = { userId: currentUser.uid, date: getStartOfDayUTC(logDate), duration: parseInt(data.duration, 10) || 0, steps: parseInt(data.steps, 10) || 0, exercises: data.exercises, createdAt: serverTimestamp() };
        if (workoutData.duration <= 0 && workoutData.steps <= 0 && workoutData.exercises.length === 0) {
            addToast("Please log a valid activity.", TOAST_TYPES.ERROR); return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "workoutLogs"), workoutData);
            addToast("Activity logged successfully!", TOAST_TYPES.SUCCESS);
        } catch (error) { addToast(`Log failed: ${error.message}`, TOAST_TYPES.ERROR); }
        finally { setIsSubmitting(false); }
    }, [currentUser, logDate, addToast]);

    const handleLogReps = useCallback(async (data) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "repLogs"), { userId: currentUser.uid, date: getStartOfDayUTC(logDate), ...data, createdAt: serverTimestamp() });
            addToast("Lift logged successfully!", TOAST_TYPES.SUCCESS);
            refetchReps();
        } catch (error) { addToast(`Log failed: ${error.message}`, TOAST_TYPES.ERROR); }
        finally { setIsSubmitting(false); }
    }, [currentUser, logDate, addToast, refetchReps]);

    const handleLogNutrition = useCallback(async (data) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "nutritionLogs"), { userId: currentUser.uid, date: getStartOfDayUTC(logDate), ...data, createdAt: serverTimestamp() });
            addToast("Nutrition logged successfully!", TOAST_TYPES.SUCCESS);
        } catch (error) { addToast(`Log failed: ${error.message}`, TOAST_TYPES.ERROR); }
        finally { setIsSubmitting(false); }
    }, [currentUser, logDate, addToast]);
    
    const handleDeleteRepLog = useCallback(async (logId) => {
        setIsSubmitting(true);
        try {
            await deleteDoc(doc(db, "repLogs", logId));
            addToast("Log deleted.", TOAST_TYPES.INFO);
            refetchReps();
        } catch (error) { addToast("Failed to delete log.", TOAST_TYPES.ERROR); }
        finally { setIsSubmitting(false); }
    }, [refetchReps, addToast]);
    
    if (!currentUser) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><FiLoader className="animate-spin text-emerald-400 text-4xl" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200">
            <Navbar currentUser={currentUser} onLogout={handleLogout} />
            {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
            
            <main className="pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-100">Log Today's Activities</h2>
                    
                    {/* General Activity */}
                    <div className="bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <button onClick={() => setIsActivityOpen(!isActivityOpen)} className="w-full flex justify-between items-center p-6 text-left">
                            <h3 className="text-xl font-semibold text-gray-100 flex items-center"><FiActivity className="mr-3 text-emerald-400" />General Activity</h3>
                            {isActivityOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {isActivityOpen && <div className="p-6 pt-0"><GeneralActivityForm onSubmit={handleLogGeneralActivity} isSubmitting={isSubmitting} /></div>}
                    </div>
                    
                    {/* Reps and Lifts */}
                    <div className="bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <button onClick={() => setIsLiftsOpen(!isLiftsOpen)} className="w-full flex justify-between items-center p-6 text-left">
                            <h3 className="text-xl font-semibold text-gray-100 flex items-center"><FaDumbbell className="mr-3 text-emerald-400" />Lifts & Reps</h3>
                            {isLiftsOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {isLiftsOpen && (
                            <div className="p-6 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div><h4 className="text-lg font-semibold mb-4 text-gray-200">Log New Lift</h4><RepTrackingForm onSubmit={handleLogReps} isSubmitting={isSubmitting} /></div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-4 text-gray-200">Today's Lifts</h4>
                                    {isLoadingReps ? <FiLoader className="animate-spin text-emerald-400 mx-auto" /> : repLogs.length > 0 ? (
                                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">{repLogs.map(log => (
                                            <div key={log.id} className="bg-gray-800 p-3 rounded-lg group relative">
                                                <p className="font-bold text-emerald-400">{log.exerciseName}</p>
                                                <ul className="text-sm text-gray-300 mt-1 list-disc list-inside">{log.sets.map((set, i) => (<li key={i}>{set.reps} reps @ {set.weight || 0} kg</li>))}</ul>
                                                <button onClick={() => handleDeleteRepLog(log.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 /></button>
                                            </div>))}
                                        </div>
                                    ) : <p className="text-gray-500">No lifts logged yet today.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Nutrition */}
                    <div className="bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-700">
                        <button onClick={() => setIsNutritionOpen(!isNutritionOpen)} className="w-full flex justify-between items-center p-6 text-left">
                            <h3 className="text-xl font-semibold text-gray-100 flex items-center"><FaSeedling className="mr-3 text-green-400" />Nutrition</h3>
                            {isNutritionOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {isNutritionOpen && <div className="p-6 pt-0"><NutritionForm onSubmit={handleLogNutrition} isSubmitting={isSubmitting} /></div>}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Exercise;