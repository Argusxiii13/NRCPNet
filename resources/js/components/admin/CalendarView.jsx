import React from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth } from 'date-fns';
import '../../../css/styles/admin/CalendarView.css';

const CalendarView = ({ selectedDay, setSelectedDay, currentMonth, setCurrentMonth }) => {
    // Sample event data
    const events = [
        { date: '2025-04-01', type: 'meeting', title: 'Team Standup' },
        { date: '2025-04-03', type: 'meeting', title: 'Client Call' },
        { date: '2025-04-07', type: 'event', title: 'Company Event' },
        { date: '2025-04-15', type: 'holiday', title: 'Tax Day' },
        { date: '2025-04-22', type: 'event', title: 'Earth Day' },
        { date: '2025-04-25', type: 'meeting', title: 'Project Review' },
        { date: '2025-04-29', type: 'meeting', title: 'Sprint Planning' },
    ];

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
        return events.find(event => event.date === dateString);
    };

    const getEventType = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        const event = events.find(event => event.date === dateString);
        return event ? event.type : null;
    };

    const getEventTitle = (day) => {
        const dateString = format(day, 'yyyy-MM-dd');
        const event = events.find(event => event.date === dateString);
        return event ? event.title : null;
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
        <div className="admin-calendar-section">
            <div className="panel-sub-header">
                <h3>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h3>
                <div className="admin-calendar-nav">
                    <button onClick={previousMonth} className="nav-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={nextMonth} className="nav-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="calendar-container">
                <div className="admin-weekdays-grid">
                    {weekdays.map((weekday) => (
                        <div key={weekday} className="admin-weekday">{weekday}</div>
                    ))}
                </div>

                <div className="admin-days-grid">
                    {emptyDaysStart.map((_, index) => (
                        <div key={`empty-start-${index}`} className="admin-day-cell empty" />
                    ))}
                    
                    {days.map((day) => {
                        const eventType = getEventType(day);
                        const eventTitle = getEventTitle(day);
                        
                        return (
                            <button
                                key={day.toString()}
                                className={`admin-day-cell ${
                                    isEqual(day, selectedDay) ? 'selected' : ''
                                } ${isToday(day) ? 'today' : ''}`}
                                onClick={() => setSelectedDay(day)}
                                title={eventTitle || ''}
                            >
                                <span className="day-number">{format(day, 'd')}</span>
                                {eventType && (
                                    <div className={`event-indicator ${eventType}`}>
                                        <span className={`event-line ${eventType}`}></span>
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    {emptyDaysEnd.map((_, index) => (
                        <div key={`empty-end-${index}`} className="admin-day-cell empty" />
                    ))}
                </div>
            </div>
            
            <div className="event-legend">
                <div className="legend-item">
                    <span className="legend-indicator meeting"></span>
                    <span>Meeting</span>
                </div>
                <div className="legend-item">
                    <span className="legend-indicator event"></span>
                    <span>Event</span>
                </div>
                <div className="legend-item">
                    <span className="legend-indicator holiday"></span>
                    <span>Holiday</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;