import React, { useState, useEffect } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth } from 'date-fns';
import axios from 'axios';
import styles from '../../../css/styles/landing/Calendar.module.css';

// Function to convert 24-hour time to 12-hour time with AM/PM
const formatTime = (timeString) => {
    if (!timeString) return '';

    // Split the time range if it exists
    const times = timeString.split(' - ');
    
    // Convert each time in the range
    const formattedTimes = times.map(time => {
        const [hours, minutes] = time.split(':');
        const parsedHours = parseInt(hours, 10);
        const period = parsedHours >= 12 ? 'PM' : 'AM';
        const formattedHours = parsedHours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    });

    // Join back with ' - ' if it was a range
    return formattedTimes.join(' - ');
};

const Calendar = ({user, isAuthenticated}) => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [hoveredDay, setHoveredDay] = useState(today);
    const [isHovering, setIsHovering] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    console.log('User in Calendar:', user);
    console.log('Is Authenticated in Calendar:', isAuthenticated);

    const days = eachDayOfInterval({
        start: startOfMonth(firstDayCurrentMonth),
        end: endOfMonth(firstDayCurrentMonth),
    });

    const startDay = getDay(startOfMonth(firstDayCurrentMonth));
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const emptyDaysStart = Array(startDay).fill(null);
    const totalCells = 42;
    const emptyDaysEnd = Array(totalCells - days.length - startDay).fill(null);

// Fetch events for the current month
const fetchEvents = async () => {
    try {
        setLoading(true);
        
        // Set up parameters
        const params = { month: currentMonth };
        
        // Add division parameter if user is authenticated
        if (isAuthenticated && user && user.division) {
            params.division = user.division;
        }
        
        // Use the new endpoint
        const response = await axios.get('/api/calendar-filtered', { params });
        setEvents(response.data);
    } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchEvents();
    }, [currentMonth]);

    const previousMonth = () => {
        const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
    };

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    };

    const getEventTypes = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter(event => event.date === dateString);
        return [...new Set(dayEvents.map(event => event.type.toLowerCase()))];
    };

    const handleDaySelect = (day) => {
        if (isEqual(day, selectedDay) && isLocked) {
            setIsLocked(false);
        } else {
            setSelectedDay(day);
            setIsLocked(true);
            setHoveredDay(day);
        }
    };

    const handleDayHover = (day) => {
        if (!isLocked) {
            setHoveredDay(day);
        }
    };

    return (
        <div className={styles['calendar-wrapper']} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className={styles['calendar-container']}>
                <div className={styles['calendar-header']}>
                    <h3 className={styles['text-xl'] + ' ' + styles['font-semibold']}>
                        {format(firstDayCurrentMonth, 'MMMM yyyy')}
                    </h3>
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
                                isLocked && isEqual(day, selectedDay) ? styles['locked'] : ''
                            }`}
                            onClick={() => handleDaySelect(day)}
                            onMouseEnter={() => handleDayHover(day)}
                        >
                            <span className={styles['day-number']}>{format(day, 'd')}</span>
                            {/* Show event indicators */}
                            {getEventTypes(day).length > 0 && (
                                <div className={styles['event-indicator-container']}>
                                    {getEventTypes(day).map((type, index) => (
                                        <span
                                            key={`${day}-${type}-${index}`}
                                            className={`${styles['event-line']} ${styles[type]}`}
                                        ></span>
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}

                    {emptyDaysEnd.map((_, index) => (
                        <div key={`empty-end-${index}`} className={`${styles['day-button']} ${styles['empty']}`} />
                    ))}
                </div>

                <div className={styles['event-legend']}>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-indicator']} ${styles['meeting']}`}></span>
                        <span>Meeting</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-indicator']} ${styles['event']}`}></span>
                        <span>Event</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-indicator']} ${styles['holiday']}`}></span>
                        <span>Holiday</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-indicator']} ${styles['wellness']}`}></span>
                        <span>Wellness</span>
                    </div>
                </div>
            </div>

            <div className={`${styles['schedule-panel']} ${isHovering ? styles['visible'] : ''}`}>
                <div className={styles['schedule-header']}>
                    <h3 className={`${styles['text-lg']} ${styles['font-medium']}`}>
                        Schedule for {format(isLocked ? selectedDay : hoveredDay, 'MMM dd, yyyy')}
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
                    ) : (
                        <div className={styles['event-list']}>
                            {events.filter(event => event.date === format(isLocked ? selectedDay : hoveredDay, 'yyyy-MM-dd')).map((event) => (
                                <div key={event.id} className={`${styles['event-card']} ${styles[event.type.toLowerCase()]}`}>
                                    <div className={styles['event-header']}>
                                        <h5 className={styles['event-title']}>{event.title}</h5>
                                        <span className={styles['event-time']}>{formatTime(event.time)}</span>
                                    </div>
                                    <div className={styles['event-info']}>
                                        <div className={styles['event-location']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314-13.314 8 8 0 010 13.314z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                        <p className={styles['event-description']}>{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;