import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css'; 
// vvvv  CHANGED THIS LINE vvvv
import { formatDateToYYYYMMDD } from './utils/helpers'; // Import the new shared helper

// REMOVED the old, incorrect local formatDate function

const WorkoutCalendar = ({ workoutHistory }) => {
    const completedDates = useMemo(() => {
        const dates = new Set();
        if (workoutHistory) {
            workoutHistory.forEach(workout => dates.add(workout.date));
        }
        return dates;
    }, [workoutHistory]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            // vvvv  CHANGED THIS LINE vvvv
            const dateString = formatDateToYYYYMMDD(date); // Use our new timezone-safe function
            if (completedDates.has(dateString)) {
                return <div className="workout-dot"></div>;
            }
        }
        return null;
    };

    return (
        <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-white">🗓️ Workout Calendar</h4>
            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg">
                <Calendar
                    tileContent={tileContent}
                    className="react-calendar-theme"
                    defaultValue={new Date()} 
                />
            </div>
        </div>
    );
};

export default WorkoutCalendar;