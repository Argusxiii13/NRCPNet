import React, { useState, useEffect } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfToday, startOfMonth } from 'date-fns';
import styles from '../../../css/styles/landing/Calendar.module.css'

const Calendar = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [hoveredDay, setHoveredDay] = useState(today);
    const [isHovering, setIsHovering] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false); // State to track if date is locked

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

    // Fetch events for the selected day
    const fetchEvents = async (date) => {
        try {
            setLoading(true);
            // Format the date as YYYY-MM-DD for the API call
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await fetch(`/api/calendar/date/${formattedDate}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle day selection with locking mechanism
    const handleDaySelect = (day) => {
        // Toggle lock if clicking the same day
        if (isEqual(day, selectedDay) && isLocked) {
            setIsLocked(false);
        } else {
            setSelectedDay(day);
            setIsLocked(true);
            // When locking to a day, also set hovered day to match
            setHoveredDay(day);
        }
    };

    // Handle day hover
    const handleDayHover = (day) => {
        // Only update hovered day if not locked
        if (!isLocked) {
            setHoveredDay(day);
        }
    };

    // Fetch events when active day changes (either locked selected day or hovered day)
    useEffect(() => {
        const activeDay = isLocked ? selectedDay : (isHovering ? hoveredDay : selectedDay);
        fetchEvents(activeDay);
    }, [hoveredDay, selectedDay, isHovering, isLocked]);

    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    // Check if a day has events (for visual indicator)
    const hasEvents = (day) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        return days.some(d => 
            format(d, 'yyyy-MM-dd') === formattedDate && 
            events.some(event => event.date === formattedDate)
        );
    };

    // Determine which day to display in the schedule panel
    const activeDay = isLocked ? selectedDay : hoveredDay;

    return (
        <div className={styles['calendar-wrapper']} onMouseEnter={() => {
            setIsHovering(true);
            if (!isLocked) {
                setHoveredDay(selectedDay); // Set hovered day to selected day initially if not locked
            }
        }} onMouseLeave={() => {
            setIsHovering(false);
            setIsLocked(false); // Add this line to remove lock status when hovering out
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
                            } ${isToday(day) ? styles['today'] : ''} ${
                                hasEvents(day) ? styles['has-events'] : ''
                            } ${isLocked && isEqual(day, selectedDay) ? styles['locked'] : ''}`}
                            onClick={() => handleDaySelect(day)}
                            onMouseEnter={() => handleDayHover(day)}
                        >
                            {format(day, 'd')}
                        </button>
                    ))}

                    {emptyDaysEnd.map((_, index) => (
                        <div key={`empty-end-${index}`} className={`${styles['day-button']} ${styles['empty']}`} />
                    ))}
                </div>
            </div>

            <div className={`${styles['schedule-panel']} ${isHovering || isLocked ? styles['visible'] : ''}`}>
                <div className={styles['schedule-header']}>
                    <h3 className={`${styles['text-lg']} ${styles['font-medium']}`}>
                        Schedule for {format(activeDay, 'MMM dd, yyyy')}
                        {isLocked && (
                            <span className={styles['lock-indicator']}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={styles['lock-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <button 
                                    onClick={() => setIsLocked(false)} 
                                    className={styles['unlock-button']}
                                    title="Unlock date"
                                >
                                    Unlock
                                </button>
                            </span>
                        )}
                    </h3>
                </div>
                <div className={styles['schedule-content']}>
                    {loading ? (
                        <p className={styles['loading']}>Loading schedules...</p>
                    ) : events.length > 0 ? (
                        <div className={styles['event-list']}>
                            {events.map((event) => (
                                <div key={event.id} className={`${styles['event-item']} ${styles[`event-${event.type}`]}`}>
                                    <div className={styles['event-time']}>{event.time}</div>
                                    <div className={styles['event-title']}>{event.title}</div>
                                    {event.location && (
                                        <div className={styles['event-location']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={styles['location-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                    )}
                                    {event.description && (
                                        <div className={styles['event-description']}>{event.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles['no-schedule']}>No schedules for this date</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;