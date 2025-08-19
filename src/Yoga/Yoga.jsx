import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { weeklyYogaRoutine, meditationTracks } from "./data/yogaData";
import RoutineView from "./components/RoutineView";
import MeditationView from "./components/MeditationView";
import StatsView from "./components/StatsView";
import SettingsView from "./components/SettingsView";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Yoga = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate("/"); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  
  const [currentView, setCurrentView] = useState("routine");
  const [editableRoutine, setEditableRoutine] = useLocalStorage("editableRoutine", weeklyYogaRoutine);
  const [completedExercises, setCompletedExercises] = useLocalStorage("completedExercises", {});
  const [favorites, setFavorites] = useLocalStorage("favorites", {});
  const [volume, setVolume] = useLocalStorage("volume", 0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

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
  }, []);

  useEffect(() => {
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
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);
  
  const toggleComplete = useCallback((type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setCompletedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  }, [setCompletedExercises]);

  const toggleFavorite = useCallback((type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setFavorites((prev) => ({ ...prev, [key]: !prev[key] }));
  }, [setFavorites]);

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
    setCompletedExercises({});
    setFavorites({});
    setEditableRoutine(weeklyYogaRoutine);
  }, [setCompletedExercises, setFavorites, setEditableRoutine]);

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

      {/* Main content area with padding top to account for the fixed navbar */}
      <div className="flex-1 overflow-y-auto pt-16">
        
        {/* New Unified Page Header */}
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

        {/* Main Content View */}
        <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
          {renderView()}
        </main>
      </div>

      {/* Mobile Nav (No changes needed here) */}
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