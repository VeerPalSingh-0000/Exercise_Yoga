import React from "react";
import { meditationTracks } from "../data/yogaData";

const MeditationView = ({
  currentTrack,
  isPlaying,
  audioLoading,
  volume,
  playMeditationTrack,
  pauseMusic,
  onVolumeChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-300 mb-6">🧘‍♂️ Meditation & Mindfulness</h2>

      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-800">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">🔊 Audio Player</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={onVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-300 min-w-[3rem]">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meditationTracks.map((track, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{track.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">{track.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{track.duration}</p>

              {currentTrack?.name === track.name && isPlaying ? (
                <button
                  onClick={pauseMusic}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={() => playMeditationTrack(track)}
                  disabled={audioLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {audioLoading && currentTrack?.name === track.name ? "⏳ Loading..." : "▶️ Play"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeditationView;