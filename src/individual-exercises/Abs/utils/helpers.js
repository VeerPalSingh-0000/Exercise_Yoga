// src/components/AbsWorkout/utils/helpers.js

export const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const getDifficultyColor = (difficulty) => {
    const colors = {1: 'text-green-400', 2: 'text-yellow-400', 3: 'text-orange-400', 4: 'text-red-400', 5: 'text-purple-400'};
    return colors[difficulty] || 'text-gray-400';
};

export const getDifficultyStars = (difficulty) => '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

/**
 * ADDED: This is the new, timezone-safe function.
 * It formats a Date object into a 'YYYY-MM-DD' string based on the user's local timezone,
 * preventing the "off-by-one-day" error.
 */
export const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};