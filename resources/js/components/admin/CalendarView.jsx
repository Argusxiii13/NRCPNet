import React, { useState, useEffect } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth } from 'date-fns';
import styles from '../../../css/styles/admin/CalendarView.module.css';

const CalendarView = ({ selectedDay, setSelectedDay, currentMonth, setCurrentMonth }) => {
    // Sample event data - expanded with more details
    const events = [
        { id: 1, date: '2025-03-03', type: 'meeting', title: 'Team Standup', time: '09:00 - 09:30', location: 'Conference Room A', description: 'Daily team status update.' },
        { id: 2, date: '2025-03-07', type: 'meeting', title: 'Client Call', time: '14:00 - 15:00', location: 'Zoom', description: 'Project progress review with client.' },
        { id: 3, date: '2025-03-14', type: 'event', title: 'Pi Day', time: 'All Day', location: 'Office', description: 'Celebration with pie for everyone!' },
        { id: 4, date: '2025-03-17', type: 'holiday', title: "St. Patrick's Day", time: 'All Day', location: '-', description: 'Office closed for holiday.' },
        { id: 5, date: '2025-03-20', type: 'event', title: 'Spring Equinox', time: '15:30 - 16:30', location: 'Courtyard', description: 'Team building activity to welcome spring.' },
        { id: 6, date: '2025-03-25', type: 'meeting', title: 'Project Review', time: '11:00 - 12:00', location: 'Conference Room B', description: 'Quarterly review of ongoing projects.' },
        { id: 7, date: '2025-03-31', type: 'meeting', title: 'Sprint Planning', time: '10:00 - 11:30', location: 'Main Hall', description: 'Planning session for next sprint.' },
        
        { id: 8, date: '2025-03-20', type: 'meeting', title: 'Department Sync', time: '09:30 - 10:30', location: 'Conference Room C', description: 'Sync meeting with department heads.' },
        { id: 9, date: '2025-03-20', type: 'meeting', title: 'Department Sync', time: '09:30 - 10:30', location: 'Conference Room C', description: 'Sync meeting with department heads.' },
        { id: 10, date: '2025-03-20', type: 'meeting', title: 'Department Sync', time: '09:30 - 10:30', location: 'Conference Room C', description: 'Sync meeting with department heads.' },

    ];

    // Get selected day's events
    const [selectedDayEvents, setSelectedDayEvents] = useState([]);
    
    useEffect(() => {
        const dateString = format(selectedDay, 'yyyy-MM-dd');
        const filteredEvents = events.filter(event => event.date === dateString);
        setSelectedDayEvents(filteredEvents);
    }, [selectedDay]);

    const firstDayCurrentMonth = typeof currentMonth === 'string' 
        ? parse(currentMonth, 'MMM-yyyy', new Date())
        : currentMonth;
    
    const formattedMonth = format(firstDayCurrentMonth, 'MMM-yyyy');
    
    const days = eachDayOfInterval({
        start: startOfMonth(firstDayCurrentMonth),
        end: endOfMonth(firstDayCurrentMonth),
    });

    const startDay = getDay(startOfMonth(firstDayCurrentMonth));
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const emptyDaysStart = Array(startDay).fill(null);
    const totalCells = 42; // 6 rows of 7 days
    const emptyDaysEnd = Array(Math.max(0, totalCells - days.length - startDay)).fill(null);

    const hasEvent = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        return events.some(event => event.date === dateString);
    };

    const getEventTypes = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter(event => event.date === dateString);
        // Get unique event types
        return [...new Set(dayEvents.map(event => event.type))];
    };

    const getDayEventCount = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        return events.filter(event => event.date === dateString).length;
    };

    const previousMonth = () => {
        const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(firstDayPrevMonth);
    };

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(firstDayNextMonth);
    };

    return (
        <div className={styles['admin-calendar-section']}>
            <div className={styles['panel-sub-header']}>
                <h3>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h3>
                <div className={styles['admin-calendar-nav']}>
                    <button onClick={previousMonth} className={styles['nav-button']}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={nextMonth} className={styles['nav-button']}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={styles['split-view-container']}>
                <div className={styles['calendar-container']}>
                    <div className={styles['admin-weekdays-grid']}>
                        {weekdays.map((weekday) => (
                            <div key={weekday} className={styles['admin-weekday']}>{weekday}</div>
                        ))}
                    </div>

                    <div className={styles['admin-days-grid']}>
                        {emptyDaysStart.map((_, index) => (
                            <div key={`empty-start-${index}`} className={`${styles['admin-day-cell']} ${styles['empty']}`} />
                        ))}
                        
                        {days.map((day) => {
                            const eventTypes = getEventTypes(day);
                            const eventCount = getDayEventCount(day);
                            
                            return (
                                <button
                                    key={day.toString()}
                                    className={`${styles['admin-day-cell']} ${
                                        isEqual(day, selectedDay) ? styles['selected'] : ''
                                    } ${isToday(day) ? styles['today'] : ''}`}
                                    onClick={() => setSelectedDay(day)}
                                    title={`${eventCount} event${eventCount !== 1 ? 's' : ''}`}
                                >
                                    <span className={styles['day-number']}>{format(day, 'd')}</span>
                                    
                                    {/* Show event indicators */}
                                    {eventTypes.length > 0 && (
                                        <div className={styles['event-indicator-container']}>
                                            {eventTypes.map((type, index) => (
                                                <span 
                                                    key={`${day}-${type}-${index}`} 
                                                    className={`${styles['event-line']} ${styles[type]}`}
                                                ></span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {emptyDaysEnd.map((_, index) => (
                            <div key={`empty-end-${index}`} className={`${styles['admin-day-cell']} ${styles['empty']}`} />
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
                    </div>
                </div>
                
                <div className={styles['event-details-container']}>
                    <h4 className={styles['selected-date-header']}>
                        {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                    </h4>
                    
                    {selectedDayEvents.length > 0 ? (
                        <div className={styles['event-list']}>
                            {selectedDayEvents.map((event) => (
                                <div key={event.id} className={`${styles['event-card']} ${styles[event.type]}`}>
                                    <div className={styles['event-header']}>
                                        <h5 className={styles['event-title']}>{event.title}</h5>
                                        <span className={styles['event-time']}>{event.time}</span>
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
                    ) : (
                        <div className={styles['no-events']}>
                            <p>No events scheduled for this day</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;