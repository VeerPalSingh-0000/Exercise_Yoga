import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import {
  FITNESS_GOALS,
  NUTRITION_GOALS,
  DEFAULT_WEEKLY_SCHEDULE,
  AVAILABLE_EXERCISES
} from "./constants";

// Utilities
const formatDateToUTCDayString = (dateObj) => {
  if (!dateObj) return "";
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getStartOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + "T00:00:00.000Z"));
const getEndOfDayUTC = (dateString) => Timestamp.fromDate(new Date(dateString + "T23:59:59.999Z"));

export const useUserGoals = () => {
  const [goals, setGoals] = useState(FITNESS_GOALS);
  useEffect(() => {
    const savedGoals = localStorage.getItem("userFitnessGoals");
    if (savedGoals) {
      try {
        setGoals({ ...FITNESS_GOALS, ...JSON.parse(savedGoals) });
      } catch (e) {
        console.error("Failed to parse fitness goals from localStorage", e);
      }
    }
  }, []);
  const updateGoal = useCallback(
    (key, value) => {
      const newGoals = { ...goals, [key]: Number(value) };
      setGoals(newGoals);
      localStorage.setItem("userFitnessGoals", JSON.stringify(newGoals));
    },
    [goals]
  );
  return { goals, updateGoal };
};

export const useWorkoutProgress = (currentUser) => {
  const [progressData, setProgressData] = useState({ duration: 0, steps: 0, yogaDuration: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser || !logDate) return;
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "workoutLogs"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", getStartOfDayUTC(logDate)),
          where("date", "<=", getEndOfDayUTC(logDate))
        );
        const querySnapshot = await getDocs(q);
        const totals = { duration: 0, steps: 0, yogaDuration: 0 };
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // UPDATED: Explicitly convert data to Numbers to prevent calculation errors.
          const duration = Number(data.duration) || 0;
          const steps = Number(data.steps) || 0;

          if (data.exercises && data.exercises.includes("yoga")) {
            totals.yogaDuration += duration;
          } else {
            totals.duration += duration;
          }
          totals.steps += steps;
        });
        setProgressData(totals);
      } catch (e) {
        console.error("Error fetching workout progress:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [currentUser, logDate]);
  return { progressData, isLoading };
};

export const useNutritionProgress = (currentUser) => {
  const [nutritionData, setNutritionData] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const logDate = useMemo(() => formatDateToUTCDayString(new Date()), []);
  useEffect(() => {
    const fetchNutritionProgress = async () => {
      if (!currentUser || !logDate) return;
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "nutritionLogs"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", getStartOfDayUTC(logDate)),
          where("date", "<=", getEndOfDayUTC(logDate))
        );
        const querySnapshot = await getDocs(q);
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          Object.keys(totals).forEach((nutrient) => {
            if (data[nutrient] !== undefined && !isNaN(data[nutrient]))
              totals[nutrient] += Number(data[nutrient]);
          });
        });
        setNutritionData(totals);
      } catch (e) {
        console.error("Error fetching nutrition progress:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutritionProgress();
  }, [currentUser, logDate]);
  return { nutritionData, isLoading };
};

export const useChartData = (currentUser) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Workout Duration (mins)",
        data: [],
        borderColor: "rgb(52, 211, 153)",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  });
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
        const q = query(
          collection(db, "workoutLogs"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", startDate),
          where("date", "<=", endDate),
          orderBy("date", "asc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dateStrUTC = formatDateToUTCDayString(data.date.toDate());
          if (!dailyData[dateStrUTC]) dailyData[dateStrUTC] = 0;
          // UPDATED: Ensure duration is treated as a number for correct aggregation.
          dailyData[dateStrUTC] += Number(data.duration) || 0;
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
        setChartData((prev) => ({
          ...prev,
          labels,
          datasets: [{ ...prev.datasets[0], data: dataPoints }],
        }));
      } catch (e) {
        console.error("Error fetching chart data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [currentUser]);

  return { chartData, isLoading };
};

export const useWeeklySchedule = () => {
  const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);
  useEffect(() => {
    const savedSchedule = localStorage.getItem("userWeeklySchedule");
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        if (Array.isArray(parsed) && parsed.length === 7) setSchedule(parsed);
      } catch (e) {
        console.error("Failed to parse weekly schedule from localStorage", e);
      }
    }
  }, []);
  const saveSchedule = useCallback((newSchedule) => {
    const scheduleToSave = newSchedule.map((day) => day || []);
    localStorage.setItem("userWeeklySchedule", JSON.stringify(scheduleToSave));
    setSchedule(newSchedule);
  }, []);
  return { schedule, setSchedule, saveSchedule };
};

export const useFixedExercises = () => {
  const [fixedExercises, setFixedExercises] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("userFixedExercises");
    if (saved) {
      try {
        setFixedExercises(JSON.parse(saved));
      } catch {
        setFixedExercises([]);
      }
    }
  }, []);
  const saveExercises = useCallback((exercises) => {
    localStorage.setItem("userFixedExercises", JSON.stringify(exercises));
    setFixedExercises(exercises);
  }, []);
  return { fixedExercises, setFixedExercises, saveExercises };
};