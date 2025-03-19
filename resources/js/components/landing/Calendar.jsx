import React, { useState } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfToday, startOfMonth } from 'date-fns';
import styles from '../../../css/styles/landing/Calendar.module.css'

const Calendar = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [hoveredDay, setHoveredDay] = useState(today);
    const [isHovering, setIsHovering] = useState(false);

    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const startDay = getDay(startOfMonth(firstDayCurrentMonth));
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const emptyDaysStart = Array(startDay).fill(null);
    const totalCells = 42;
    const emptyDaysEnd = Array(totalCells - days.length - startDay).fill(null);

    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    return (
        <div className={styles['calendar-wrapper']} onMouseEnter={() => {
            setIsHovering(true);
            setHoveredDay(today); // Reset hovered day to today on mouse enter
        }} onMouseLeave={() => {
            setIsHovering(false);
        }}>
            <div className={styles['calendar-container']}>
                <div className={styles['calendar-header']}>
                    <h2 className={styles['text-xl'] + ' ' + styles['font-semibold']}>
                        {format(firstDayCurrentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className={styles['flex'] + ' ' + styles['gap-2']}>
                        <button onClick={previousMonth} className={styles['p-1'] + ' ' + styles['hover:bg-gray-100'] + ' ' + styles['rounded']}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles['icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={nextMonth} className={styles['p-1'] + ' ' + styles['hover:bg-gray-100'] + ' ' + styles['rounded']}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles['icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={styles['weekdays-grid']}>
                    {weekdays.map((weekday) => (
                        <div key={weekday} className={styles['weekday']}>
                            {weekday}
                        </div>
                    ))}
                </div>

                <div className={styles['days-grid']}>
                    {emptyDaysStart.map((_, index) => (
                        <div key={`empty-start-${index}`} className={`${styles['day-button']} ${styles['empty']}`} />
                    ))}
                    
                    {days.map((day) => (
                        <button
                            key={day.toString()}
                            className={`${styles['day-button']} ${
                                isEqual(day, selectedDay) ? styles['selected'] : ''
                            } ${isToday(day) ? styles['today'] : ''}`}
                            onClick={() => setSelectedDay(day)}
                            onMouseEnter={() => setHoveredDay(day)}
                        >
                            {format(day, 'd')}
                        </button>
                    ))}

                    {emptyDaysEnd.map((_, index) => (
                        <div key={`empty-end-${index}`} className={`${styles['day-button']} ${styles['empty']}`} />
                    ))}
                </div>
            </div>

            <div className={`${styles['schedule-panel']} ${isHovering ? styles['visible'] : ''}`}>
                <div className={styles['schedule-header']}>
                    <h3 className={`${styles['text-lg']} ${styles['font-medium']}`}>
                        Schedule for {format(hoveredDay, 'MMM dd, yyyy')}
                    </h3>
                </div>
                <div className={styles['schedule-content']}>
                    <p className={styles['no-schedule']}>No schedules for this date</p>
                </div>
            </div>
        </div>
    );
};

export default Calendar;