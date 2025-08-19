import React, { useState, useMemo, useRef } from "react";
import DayCard from "./DayCard";
import BreathingExercise from "./BreathingExercise";
import PoseTimer from "./PoseTimer";
import { yogaQuotes } from "../data/yogaData";

const QuoteOfTheDay = () => {
  const dailyQuote = useMemo(() => {
    return yogaQuotes[Math.floor(Math.random() * yogaQuotes.length)];
  }, []);

  return (
    <div className="mb-6 bg-blue-900/20 rounded-xl p-6 border border-blue-700">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3 text-pink-500">✨ Quote of the Day</h3>
        <blockquote className="text-slate-300 italic text-sm sm:text-base leading-relaxed">
          "{dailyQuote}"
        </blockquote>
      </div>
    </div>
  );
};

const RoutineView = ({
  routine,
  completedExercises,
  favorites,
  onToggleComplete,
  onToggleFavorite,
  stats,
}) => {
  const [expandedDay, setExpandedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" })
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredDays = useMemo(() => {
    if (!searchTerm && activeFilter === "all") return Object.keys(routine);
    return Object.keys(routine).filter((day) => {
      const dayData = routine[day];
      const searchIncludes =
        day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayData.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayData.asanas.some(
          (asana) =>
            asana.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asana.benefits.some((benefit) =>
              benefit.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

      const filterMatches =
        activeFilter === "all" ||
        (activeFilter === "favorites" &&
          Object.keys(favorites).some((key) => key.includes(day))) ||
        (activeFilter === "completed" &&
          Object.keys(completedExercises).some((key) => key.includes(day)));

      return searchIncludes && filterMatches;
    });
  }, [searchTerm, activeFilter, routine, favorites, completedExercises]);

  return (
    <div className="space-y-6">
      <QuoteOfTheDay />
      <PoseTimer />
      <BreathingExercise />

      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search poses, benefits, or days..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "favorites", "completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === "favorites" && ` (${stats.totalFavorites})`}
              {filter === "completed" && ` (${stats.totalCompleted})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDays.map((day) => (
          <DayCard
            key={day}
            day={day}
            dayData={routine[day]}
            isExpanded={expandedDay === day}
            onToggle={() => setExpandedDay(expandedDay === day ? null : day)}
            completedExercises={completedExercises}
            favorites={favorites}
            onToggleComplete={onToggleComplete}
            onToggleFavorite={onToggleFavorite}
            completionPercentage={stats.completionByDay[day]?.percentage || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutineView;