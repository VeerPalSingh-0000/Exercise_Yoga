import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// Removed useLocalStorage as we are now using Firestore
import { weeklyYogaRoutine, meditationTracks } from "./data/yogaData";
import RoutineView from "./components/RoutineView";
import MeditationView from "./components/MeditationView";
import StatsView from "./components/StatsView";
import SettingsView from "./components/SettingsView";

// --- Firebase Imports ---
import { auth, db } from "../firebase"; // Assuming you export 'db' from your firebase config
import { signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
// --- End Firebase Imports ---

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Yoga = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // --- State Management ---
  // Replaced useLocalStorage with useState. Firestore is now the source of truth.
  const [completedExercises, setCompletedExercises] = useState({});
  const [favorites, setFavorites] = useState({});
  const [editableRoutine, setEditableRoutine] = useState(weeklyYogaRoutine); // This can remain local or be moved to Firestore if you want users to customize routines.

  // No changes to UI or audio state
  const [currentView, setCurrentView] = useState("routine");
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);
  
  // A ref to prevent writing initial empty state back to Firestore before data is loaded
  const isInitialLoad = useRef(true);

  // --- Authentication Effect ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        // If no user, navigate to login page
        navigate("/");
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // --- Firestore Data Fetching Effect (Real-time) ---
  useEffect(() => {
    // Don't run if there's no logged-in user
    if (!currentUser) return;

    // Create a reference to the user's document in the 'users' collection
    const userDocRef = doc(db, 'users', currentUser.uid);
    isInitialLoad.current = true; // Set to true on user change

    // onSnapshot listens for real-time updates to the document
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        // If the document exists, get the data
        const data = docSnap.data();
        setCompletedExercises(data.completedExercises || {});
        setFavorites(data.favorites || {});
      } else {
        // If the document doesn't exist (e.g., new user), create it with default empty data
        setDoc(userDocRef, {
          completedExercises: {},
          favorites: {}
        }).catch(error => console.error("Error creating user document:", error));
      }
      // Mark initial data load as complete
      setTimeout(() => { isInitialLoad.current = false; }, 500);
    });

    // Cleanup the listener when the component unmounts or the user changes
    return () => unsubscribe();
  }, [currentUser]);

  // --- Firestore Data Saving Effect ---
  useEffect(() => {
    // Don't save data if there's no user or if it's the initial data load
    if (!currentUser || isInitialLoad.current) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    
    // Create a payload with the current state
    const dataToSave = {
      completedExercises,
      favorites
    };

    // Use setDoc with { merge: true } to update the document without overwriting other fields
    setDoc(userDocRef, dataToSave, { merge: true })
      .catch(error => console.error("Error saving user data:", error));

  }, [completedExercises, favorites, currentUser]); // This effect runs whenever these state variables change


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playMeditationTrack = useCallback((track) => {
    if (currentTrack?.url === track.url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    setAudioLoading(true);
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setAudioLoading(false);
    }).catch(error => {
      console.error("Audio play failed:", error);
      setAudioLoading(false);
    });
  }, [currentTrack, isPlaying]);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const toggleComplete = useCallback((type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setCompletedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleFavorite = useCallback((type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setFavorites((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const stats = useMemo(() => {
    const totalCompleted = Object.values(completedExercises).filter(Boolean).length;
    const totalFavorites = Object.values(favorites).filter(Boolean).length;
    const completionByDay = {};
    Object.keys(editableRoutine).forEach((day) => {
      const dayAsanas = editableRoutine[day].asanas?.length || 0;
      const dayPranayama = editableRoutine[day].pranayama?.length || 0;
      const total = dayAsanas + dayPranayama;
      const completed = Object.keys(completedExercises).filter(
        (key) => key.includes(day) && completedExercises[key]
      ).length;
      completionByDay[day] = {
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    });
    return { totalCompleted, totalFavorites, completionByDay };
  }, [completedExercises, favorites, editableRoutine]);

  const resetAllData = useCallback(() => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const defaultData = {
          completedExercises: {},
          favorites: {}
      };
      // Overwrite the Firestore document with default empty data
      setDoc(userDocRef, defaultData)
        .catch(error => console.error("Error resetting data:", error));
    }
  }, [currentUser]);

  const renderView = () => {
    switch (currentView) {
      case "meditation":
        return <MeditationView 
          meditationTracks={meditationTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          audioLoading={audioLoading}
          volume={volume}
          playMeditationTrack={playMeditationTrack}
          pauseMusic={pauseMusic}
          onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
        />;
      case "stats":
        return <StatsView stats={stats} />;
      case "settings":
        return <SettingsView onResetAllData={resetAllData} />;
      default:
        return (
          <RoutineView
            routine={editableRoutine}
            completedExercises={completedExercises}
            favorites={favorites}
            onToggleComplete={toggleComplete}
            onToggleFavorite={toggleFavorite}
            stats={stats}
          />
        );
    }
  };
  
  const navItems = [
    { view: "routine", label: "Routine" },
    { view: "meditation", label: "Meditate" },
    { view: "stats", label: "Progress" },
    { view: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto pt-16">
        
        <header className="text-center py-8 px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Yoga Se Hoga
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-6">
            Your personal space to find balance, peace, and strength.
          </p>
          <nav className="flex justify-center bg-slate-800/50 p-1.5 rounded-full max-w-md mx-auto">
            {navItems.map(({ view, label }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  currentView === view 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
          {renderView()}
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 p-2">
        <div className="flex justify-around">
          {navItems.map(({ view, label }) => (
            <button key={view} onClick={() => setCurrentView(view)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg w-1/4 ${
                currentView === view ? "bg-blue-600 text-white" : "text-gray-400"
              }`}
            >
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)} />

      <Footer />
    </div>
  );
};

export default Yoga;
