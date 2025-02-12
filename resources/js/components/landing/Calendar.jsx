// Calendar.jsx
import React, { useState } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, parseISO, startOfToday } from 'date-fns';
import '../../../css/styles/landing/Calendar.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const Calendar = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h2>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
                <button onClick={previousMonth}>
                    <ChevronLeftIcon className="icon" />
                </button>
                <button onClick={nextMonth}>
                    <ChevronRightIcon className="icon" />
                </button>
            </div>
            <div className="days-grid">
                {days.map((day, dayIdx) => (
                    <button
                        key={day.toString()}
                        className={`day-button ${isEqual(day, selectedDay) ? 'selected' : ''} ${isToday(day) ? 'today' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>
            <div className="schedule-container">
                <h3>Schedule for {format(selectedDay, 'MMM dd, yyyy')}</h3>
                <p>No meetings for today.</p>
            </div>
        </div>
    );
};

export default Calendar;