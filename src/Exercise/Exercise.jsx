import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiLoader, FiCheckCircle, FiTrendingUp, FiClock, FiTarget } from 'react-icons/fi';
import { FaWalking, FaSeedling, FaFire } from 'react-icons/fa';
import { FaDumbbell } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi';
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Configuration & Constants
const TOAST_TYPES = { SUCCESS: 'success', ERROR: 'error', INFO: 'info' };
const AVAILABLE_EXERCISES = ["chest", "bicep", "tricep", "leg", "shoulder", "back", "abs", "yoga", "running", "cardio", "stretching", "arm", "keggle"];
const FOOD_CATEGORIES = {
    "Indian Meals": [
        { name: 'Dal Tadka (1 bowl)', calories: 198, protein: 11, carbs: 28, fats: 5, icon: '🍲' },
        { name: 'Paneer Tikka (100g)', calories: 263, protein: 18, carbs: 6, fats: 17, icon: '🧀' },
        { name: 'Rajma (1 bowl)', calories: 210, protein: 8, carbs: 34, fats: 4, icon: '🥣' },
        { name: 'Chole (1 bowl)', calories: 220, protein: 10, carbs: 35, fats: 5, icon: '🍛' },
        { name: 'Chicken Curry (100g)', calories: 180, protein: 20, carbs: 4, fats: 9, icon: '🍗' },
        { name: 'Roti (1 medium)', calories: 80, protein: 3, carbs: 15, fats: 1, icon: '🥙' },
        { name: 'Rice (1 cup cooked)', calories: 206, protein: 4, carbs: 45, fats: 0.4, icon: '🍚' },
        { name: 'Aloo Gobi (1 bowl)', calories: 150, protein: 4, carbs: 20, fats: 6, icon: '🥦' },
        { name: 'Palak Paneer (1 bowl)', calories: 265, protein: 13, carbs: 12, fats: 18, icon: '🥬' },
        { name: 'Dosa (1 plain)', calories: 133, protein: 3, carbs: 18, fats: 5, icon: '🥞' },
        { name: 'Aaloo Paratha (1 medium)', calories: 210, protein: 5, carbs: 35, fats: 7, icon: '🥔' },
        { name: 'Dahi (1 cup)', calories: 98, protein: 5, carbs: 7, fats: 4, icon: '🥛' },
    ],
    Fruits: [
        { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, icon: '🍌' },
        { name: 'Apple (1 medium)', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, icon: '🍎' },
        { name: 'Orange (1 medium)', calories: 62, protein: 1.2, carbs: 15.4, fats: 0.2, icon: '🍊' },
        { name: 'Papaya (1 cup)', calories: 59, protein: 0.9, carbs: 15, fats: 0.2, icon: '🍈' },
        { name: 'Mango (1 medium)', calories: 150, protein: 1.4, carbs: 38, fats: 0.6, icon: '🥭' },
        { name: 'Grapes (1 cup)', calories: 62, protein: 0.6, carbs: 16, fats: 0.3, icon: '🍇' },
        { name: 'Pomegranate (1 medium)', calories: 234, protein: 4.7, carbs: 53, fats: 3.3, icon: '🍎' },
        { name: 'Watermelon (1 cup)', calories: 46, protein: 0.9, carbs: 12, fats: 0.2, icon: '🍉' },
        { name: 'Guava (1 medium)', calories: 37, protein: 1.4, carbs: 8, fats: 0.5, icon: '🥝' },
        { name: 'Pineapple (1 cup)', calories: 82, protein: 0.9, carbs: 22, fats: 0.2, icon: '🍍' }
    ],
    Sprouts: [
        { name: 'Moong Sprouts (1 cup)', calories: 31, protein: 3, carbs: 6, fats: 0.2, icon: '🌱' },
        { name: 'Chana Sprouts (1 cup)', calories: 105, protein: 7, carbs: 18, fats: 1.5, icon: '🌰' },
        { name: 'Alfalfa Sprouts (1 cup)', calories: 8, protein: 1.3, carbs: 0.7, fats: 0.2, icon: '🌿' },
        { name: 'Lentil Sprouts (1 cup)', calories: 82, protein: 7, carbs: 17, fats: 0.5, icon: '🥜' },
        { name: 'Soybean Sprouts (1 cup)', calories: 85, protein: 9, carbs: 7, fats: 4, icon: '🌾' },
        { name: 'Radish Sprouts (1 cup)', calories: 16, protein: 1.6, carbs: 3, fats: 0.2, icon: '🥗' },
        { name: 'Broccoli Sprouts (1 cup)', calories: 35, protein: 2.3, carbs: 5, fats: 0.5, icon: '🥦' },
        { name: 'Pea Sprouts (1 cup)', calories: 26, protein: 2.5, carbs: 4.8, fats: 0.2, icon: '🌱' },
        { name: 'Sunflower Sprouts (1 cup)', calories: 190, protein: 8, carbs: 16, fats: 13, icon: '🌻' },
        { name: 'Wheat Sprouts (1 cup)', calories: 60, protein: 2, carbs: 13, fats: 0.5, icon: '🌾' }
    ]
};


// Utility Functions
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
    const addToast = useCallback((message, type = 'info', duration = 4000) => {
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

// --- Beautiful UI Components ---

const Toast = memo(({ toast, onRemove }) => {
    const styles = {
        success: 'from-emerald-500 to-green-500 border-emerald-400',
        error: 'from-red-500 to-rose-500 border-red-400',
        info: 'from-sky-500 to-blue-500 border-sky-400'
    };
    const icons = {
        success: <FiCheckCircle className="w-6 h-6" />,
        error: <FiTrash2 className="w-6 h-6" />,
        info: <FiActivity className="w-6 h-6" />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ duration: 0.4, type: "spring" }}
            className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white border backdrop-blur-md bg-gradient-to-br ${styles[toast.type]} bg-opacity-80 z-50`}
        >
            <div className="flex items-center space-x-3">
                {icons[toast.type]}
                <span className="font-semibold">{toast.message}</span>
            </div>
        </motion.div>
    );
});

const SectionHeader = memo(({ icon, title, isOpen, onClick, gradient }) => (
    <motion.button
        onClick={onClick}
        className={`w-full flex justify-between items-center p-6 text-left rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/10 ${gradient}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-center">
            <div className="p-3 rounded-xl bg-white/10 mr-4">{icon}</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-white">
            <FiChevronDown className="w-7 h-7" />
        </motion.div>
    </motion.button>
));

const FormCard = ({ children }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg">
        {children}
    </div>
);

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
        <FormCard>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Duration Input */}
                    <div>
                        <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><FiClock className="mr-2 text-emerald-400" /> Workout Duration</label>
                        <div className="relative">
                            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                                className="w-full form-input rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 pl-10 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400 transition-all"
                                min="0" placeholder="e.g., 45" disabled={isSubmitting} />
                            <FiActivity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">mins</span>
                        </div>
                    </div>
                    {/* Steps Input */}
                    <div>
                        <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><FaWalking className="mr-2 text-sky-400" /> Step Count</label>
                        <div className="relative">
                            <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)}
                                className="w-full form-input rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 pl-10 placeholder-gray-500 focus:border-sky-400 focus:ring-sky-400 transition-all"
                                min="0" placeholder="e.g., 10000" disabled={isSubmitting} />
                            <FaWalking className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Exercise Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-300 flex items-center"><FiTarget className="mr-2 text-purple-400" /> Target Muscle Groups <span className="ml-2 text-xs text-gray-500">(Optional)</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {AVAILABLE_EXERCISES.map(ex => (
                            <button key={ex} type="button" onClick={() => handleExerciseToggle(ex)} disabled={isSubmitting}
                                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-300 ${
                                    exercises.includes(ex)
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-slate-700/80 text-gray-300 hover:bg-slate-600/80 border border-slate-600'
                                }`}>
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} whileTap={{ scale: 0.98 }}>
                    {isSubmitting ? <><FiLoader className="mr-3 animate-spin" /> Logging...</> : <><FiCheckCircle className="mr-3" /> Log Workout</>}
                </motion.button>
            </form>
        </FormCard>
    );
});

const RepTrackingForm = memo(({ onSubmit, isSubmitting }) => {
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);

    const handleSetChange = (index, field, value) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
    };
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
        <FormCard>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-semibold text-gray-300 flex items-center mb-2"><FaDumbbell className="mr-2 text-orange-400" /> Exercise Name</label>
                    <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="e.g., Bench Press"
                        className="w-full form-input rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 transition-all"
                        required disabled={isSubmitting} />
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300 flex items-center"><HiSparkles className="mr-2 text-yellow-400" /> Sets & Reps</h4>
                    <AnimatePresence>
                        {sets.map((set, index) => (
                            <motion.div key={index} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-300 font-semibold text-sm">Set {index + 1}</span>
                                    {sets.length > 1 && (
                                        <button type="button" onClick={() => removeSet(index)} className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20 transition-all">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} placeholder="Reps"
                                        className="w-full form-input rounded-lg bg-slate-700/80 border-slate-600 text-gray-100 py-2 px-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400" />
                                    <input type="number" value={set.weight} onChange={(e) => handleSetChange(index, 'weight', e.target.value)} placeholder="Weight (kg)"
                                        className="w-full form-input rounded-lg bg-slate-700/80 border-slate-600 text-gray-100 py-2 px-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={addSet}
                        className="flex items-center text-emerald-400 hover:text-emerald-300 font-medium text-sm py-2 px-4 rounded-lg hover:bg-emerald-500/10 transition-all">
                        <FiPlus className="mr-2" /> Add Set
                    </button>
                    <motion.button type="submit" disabled={isSubmitting}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2 px-5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {isSubmitting ? 'Logging...' : 'Log Exercise'}
                    </motion.button>
                </div>
            </form>
        </FormCard>
    );
});

const NutritionForm = memo(({ onSubmit, isSubmitting }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFood, setSelectedFood] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFood) return;
        const food = FOOD_CATEGORIES[selectedCategory].find(f => f.name === selectedFood);
        if (!food) return;
        const qty = parseFloat(quantity) || 1;
        onSubmit({
            name: `${food.name} x${qty}`,
            calories: Math.round(food.calories * qty),
            protein: Math.round(food.protein * qty * 10) / 10,
            carbs: Math.round(food.carbs * qty * 10) / 10,
            fats: Math.round(food.fats * qty * 10) / 10
        });
        setSelectedCategory('');
        setSelectedFood('');
        setQuantity(1);
    };

    const foodsInCategory = selectedCategory ? FOOD_CATEGORIES[selectedCategory] : [];

    const selectedFoodData = foodsInCategory.find(f => f.name === selectedFood);

    return (
        <FormCard>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category selection */}
                <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><FaSeedling className="mr-2 text-green-400" /> Food Category</label>
                    <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedFood(''); }}
                        className="w-full form-select rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 focus:border-green-400 focus:ring-green-400"
                        required disabled={isSubmitting}>
                        <option value="">Choose category...</option>
                        {Object.keys(FOOD_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {/* Food selection */}
                {selectedCategory && (
                    <div>
                        <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><FaSeedling className="mr-2 text-green-400" /> Select Food</label>
                        <select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}
                            className="w-full form-select rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 focus:border-green-400 focus:ring-green-400"
                            required disabled={isSubmitting || !selectedCategory}>
                            <option value="">Choose a food item...</option>
                            {foodsInCategory.map(f => <option key={f.name} value={f.name}>{f.icon} {f.name}</option>)}
                        </select>
                    </div>
                )}
                {/* Quantity selection */}
                {selectedFood && (
                    <div>
                        <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center"><FiTarget className="mr-2 text-sky-400" /> Quantity/Servings</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            className="w-full form-input rounded-xl bg-slate-800/60 border-slate-700 text-gray-100 py-3 px-4 focus:border-sky-400 focus:ring-sky-400"
                            min="0.1" step="0.1" required disabled={isSubmitting} />
                    </div>
                )}
                {/* Nutrition Preview */}
                <AnimatePresence>
                    {selectedFoodData && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                            <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center"><FaFire className="mr-2 text-orange-400" /> Nutrition Preview (x{quantity || 0})</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div><p className="text-xl font-bold text-orange-400">{Math.round((selectedFoodData.calories * quantity) || 0)}</p><p className="text-xs text-gray-400">Calories</p></div>
                                <div><p className="text-xl font-bold text-sky-400">{(Math.round(selectedFoodData.protein * quantity * 10) / 10) || 0}g</p><p className="text-xs text-gray-400">Protein</p></div>
                                <div><p className="text-xl font-bold text-green-400">{(Math.round(selectedFoodData.carbs * quantity * 10) / 10) || 0}g</p><p className="text-xs text-gray-400">Carbs</p></div>
                                <div><p className="text-xl font-bold text-yellow-400">{(Math.round(selectedFoodData.fats * quantity * 10) / 10) || 0}g</p><p className="text-xs text-gray-400">Fats</p></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Submit */}
                {selectedFood && (
                    <motion.button type="submit" disabled={isSubmitting}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {isSubmitting ? <><FiLoader className="mr-3 animate-spin" /> Adding...</> : <><FiCheckCircle className="mr-3" /> Add to Log</>}
                    </motion.button>
                )}
            </form>
        </FormCard>
    );
});


// --- Main Page Component ---

const Exercise = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const { toasts, addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);
    const { repLogs, isLoading: isLoadingReps, refetch: refetchReps } = useRepTracking(currentUser, logDate);

    const [openSection, setOpenSection] = useState('activity');
    const toggleSection = (section) => setOpenSection(openSection === section ? null : section);

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

    const createLogHandler = (collectionName, successMessage, errorMessage) => useCallback(async (data) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, collectionName), {
                userId: currentUser.uid,
                date: getStartOfDayUTC(logDate),
                ...data,
                createdAt: serverTimestamp()
            });
            addToast(successMessage, TOAST_TYPES.SUCCESS);
            if (collectionName === "repLogs") refetchReps();
        } catch (error) {
            addToast(`${errorMessage}: ${error.message}`, TOAST_TYPES.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, logDate, addToast, refetchReps]);

    const handleLogGeneralActivity = createLogHandler("workoutLogs", "Workout logged! 💪", "Log failed");
    const handleLogReps = createLogHandler("repLogs", "Exercise logged! 🏋️‍♂️", "Log failed");
    const handleLogNutrition = createLogHandler("nutritionLogs", "Nutrition logged! 🥗", "Log failed");

    const handleDeleteRepLog = useCallback(async (logId) => {
        try {
            await deleteDoc(doc(db, "repLogs", logId));
            addToast("Exercise deleted.", TOAST_TYPES.INFO);
            refetchReps();
        } catch (error) {
            addToast("Failed to delete.", TOAST_TYPES.ERROR);
        }
    }, [refetchReps, addToast]);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <FiLoader className="animate-spin text-emerald-400 text-6xl mr-4" />
                <p className="text-gray-300 text-lg">Loading fitness dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-200 font-sans">
            <Navbar currentUser={currentUser} onLogout={handleLogout} />
            <AnimatePresence>
                {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
            </AnimatePresence>
            
            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="p-4 text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
                            Today's Fitness Journey
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Track your workouts, monitor your nutrition, and crush your goals.
                        </p>
                        <div className="mt-6 text-sm text-gray-500 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </motion.div>
                    
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {/* Sections */}
                        {[
                            { id: 'activity', title: 'General Activity', icon: <FiActivity className="w-6 h-6 text-emerald-300" />, gradient: 'from-emerald-600/70 to-green-700/70', Form: GeneralActivityForm, handler: handleLogGeneralActivity },
                            { id: 'lifts', title: 'Strength Training', icon: <FaDumbbell className="w-6 h-6 text-orange-300" />, gradient: 'from-orange-600/70 to-amber-700/70', Form: RepTrackingForm, handler: handleLogReps },
                            { id: 'nutrition', title: 'Nutrition Tracking', icon: <FaSeedling className="w-6 h-6 text-green-300" />, gradient: 'from-green-600/70 to-emerald-700/70', Form: NutritionForm, handler: handleLogNutrition }
                        ].map(({ id, title, icon, gradient, Form, handler }) => (
                            <motion.div key={id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                                <SectionHeader icon={icon} title={title} isOpen={openSection === id} onClick={() => toggleSection(id)} gradient={gradient} />
                                <AnimatePresence>
                                    {openSection === id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: 'auto', opacity: 1, marginTop: '24px' }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            {id === 'lifts' ? (
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="text-xl font-bold mb-4 flex items-center"><FiPlus className="mr-3 text-orange-400" /> Log New Exercise</h4>
                                                        <Form onSubmit={handler} isSubmitting={isSubmitting} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold mb-4 flex items-center"><FiTrendingUp className="mr-3 text-emerald-400" /> Today's Training Log</h4>
                                                        {isLoadingReps ? <div className="text-center p-8 bg-slate-900/50 rounded-2xl"><FiLoader className="animate-spin mx-auto text-2xl" /></div> : repLogs.length > 0 ? (
                                                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                                                <AnimatePresence>
                                                                    {repLogs.map(log => (
                                                                        <motion.div key={log.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                                                                            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10 group">
                                                                            <div className="flex justify-between items-start mb-3">
                                                                                <h5 className="font-bold text-lg text-orange-400">{log.exerciseName}</h5>
                                                                                <button onClick={() => handleDeleteRepLog(log.id)}
                                                                                    className="text-red-500 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-500/20 transition-all">
                                                                                    <FiTrash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {log.sets.map((set, i) => (
                                                                                    <div key={i} className="flex justify-between bg-slate-800/60 rounded-lg p-2 text-sm">
                                                                                        <span className="text-gray-400">Set {i + 1}</span>
                                                                                        <span className="font-medium text-gray-200"><span className="text-emerald-400">{set.reps}</span> reps @ <span className="text-sky-400">{set.weight || 0}</span> kg</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </AnimatePresence>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                                                                <FaDumbbell className="mx-auto text-4xl text-slate-600 mb-4" />
                                                                <p className="text-gray-400">No exercises logged yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Form onSubmit={handler} isSubmitting={isSubmitting} />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Exercise;