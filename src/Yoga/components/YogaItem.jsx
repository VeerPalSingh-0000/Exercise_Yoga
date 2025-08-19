import React, { useState } from "react";
import { asanaImages } from "../data/yogaData";

const YogaItem = React.memo(
  ({ item, itemKey, isCompleted, isFavorite, onToggleComplete, onToggleFavorite }) => {
    const [isHowToExpanded, setIsHowToExpanded] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const { name, Sanskrit, duration, benefits, howTo, youtubeLink } = item;

    return (
      <div className="bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h5 className="text-lg font-semibold text-blue-300 break-words">
              {name}
              <span className="text-sm font-normal text-gray-400 ml-2">({Sanskrit})</span>
            </h5>
            <p className="text-sm text-gray-400">
              ⏱️ {duration} • 💫 {Array.isArray(benefits) ? benefits.join(", ") : benefits}
            </p>
          </div>

          <div className="flex items-center justify-start sm:justify-end space-x-2 flex-shrink-0">
            <button
              onClick={onToggleComplete}
              className={`p-2 rounded-full transition-all ${
                isCompleted
                  ? "bg-green-500 text-white scale-110"
                  : "bg-gray-600 hover:bg-green-800 text-gray-300"
              }`}
              title="Mark as completed"
            >
              ✓
            </button>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-all ${
                isFavorite
                  ? "bg-red-500 text-white scale-110"
                  : "bg-gray-600 hover:bg-red-800 text-gray-300"
              }`}
              title="Add to favorites"
            >
              ❤️
            </button>
            {asanaImages[name] && (
              <button
                onClick={() => setIsImageExpanded(!isImageExpanded)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
              >
                🖼️ {isImageExpanded ? "Hide" : "Show"}
              </button>
            )}
            <button
              onClick={() => setIsHowToExpanded(!isHowToExpanded)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-all"
            >
              {isHowToExpanded ? "Hide" : "How To"}
              <span
                className={`ml-1 inline-block transform transition-transform ${isHowToExpanded ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {youtubeLink && (
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all flex items-center"
                title="Watch on YouTube"
              >
                📺
              </a>
            )}
          </div>
        </div>

        {isImageExpanded && asanaImages[name] && (
          <div className="mb-3 text-center">
            <img
              src={asanaImages[name]}
              alt={name}
              className="max-w-full h-auto max-h-64 rounded-lg shadow-lg mx-auto"
            />
          </div>
        )}

        {isHowToExpanded && (
          <div className="bg-slate-600 rounded-lg p-4 border-l-4 border-blue-400">
            <h6 className="font-semibold text-gray-200 mb-2">How to practice:</h6>
            {Array.isArray(howTo) ? (
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                {howTo.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {howTo}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default YogaItem;