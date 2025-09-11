import React, { useState, useMemo } from "react";
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
          "{dailyQuote.quote}"
        </blockquote>
        <footer className="mt-3 text-xs text-gray-400">
          <cite>— {dailyQuote.author}</cite>
          <span className="ml-2 px-2 py-1 bg-blue-600/30 rounded-full text-blue-300">
            {dailyQuote.category}
          </span>
        </footer>
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

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return Object.keys(routine).filter((day) => {
      const dayData = routine[day];

      // Search Logic
      const searchIncludes =
        day.toLowerCase().includes(lowerCaseSearchTerm) ||
        dayData.theme.toLowerCase().includes(lowerCaseSearchTerm) ||
        dayData.asanas.some((asana) => {
          // Check if asana.benefits exists and is an array before searching
          const benefitsMatch =
            Array.isArray(asana.benefits) &&
            asana.benefits.some((benefit) =>
              benefit.toLowerCase().includes(lowerCaseSearchTerm)
            );
          return asana.name.toLowerCase().includes(lowerCaseSearchTerm) || benefitsMatch;
        });

      // Filter Logic
      const filterMatches =
        activeFilter === "all" ||
        (activeFilter === "favorites" &&
          Object.keys(favorites).some((key) => key.startsWith(day))) ||
        (activeFilter === "completed" &&
          Object.keys(completedExercises).some((key) => key.startsWith(day)));

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
            className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
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
              {filter === "favorites" && stats.totalFavorites > 0 && ` (${stats.totalFavorites})`}
              {filter === "completed" && stats.totalCompleted > 0 && ` (${stats.totalCompleted})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDays.length > 0 ? (
          filteredDays.map((day) => (
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
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-slate-800 rounded-xl">
            <p className="text-gray-400">No results found for your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineView;