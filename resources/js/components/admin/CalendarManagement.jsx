import React, { useState } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfToday, startOfMonth } from 'date-fns';
import '../../../css/styles/admin/CalendarManagement.css';

const AdminCalendar = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [isManageMode, setIsManageMode] = useState(false);

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
        <div className="admin-calendar-page">
            {/* Left Side - Calendar */}
            <div className="admin-calendar-section">
                <div className="admin-calendar-wrapper">
                    <div className="admin-calendar-header">
                        <h2>{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
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

                    <div className="admin-weekdays-grid">
                        {weekdays.map((weekday) => (
                            <div key={weekday} className="admin-weekday">{weekday}</div>
                        ))}
                    </div>

                    <div className="admin-days-grid">
                        {emptyDaysStart.map((_, index) => (
                            <div key={`empty-start-${index}`} className="admin-day-cell empty" />
                        ))}
                        
                        {days.map((day) => (
                            <button
                                key={day.toString()}
                                className={`admin-day-cell ${
                                    isEqual(day, selectedDay) ? 'selected' : ''
                                } ${isToday(day) ? 'today' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                <span className="day-number">{format(day, 'd')}</span>
                                <div className="event-indicator">
                                    <span className="event-dot"></span>
                                </div>
                            </button>
                        ))}

                        {emptyDaysEnd.map((_, index) => (
                            <div key={`empty-end-${index}`} className="admin-day-cell empty" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Events List/Management */}
            <div className="admin-events-section">
                <div className="events-header">
                    <h3>{format(selectedDay, 'MMMM dd, yyyy')}</h3>
                    <button 
                        className={`toggle-button ${isManageMode ? 'active' : ''}`}
                        onClick={() => setIsManageMode(!isManageMode)}
                    >
                        {isManageMode ? 'View Events' : 'Manage Events'}
                    </button>
                </div>

                {isManageMode ? (
                    /* Event Management Form */
                    <div className="event-management-form">
                        <h4>Add New Event</h4>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input type="text" placeholder="Enter event title" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea placeholder="Enter event description"></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input type="time" />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input type="time" />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button 
                                className="cancel-button"
                                onClick={() => setIsManageMode(false)}
                            >
                                Cancel
                            </button>
                            <button className="save-button-cal">Save Event</button>
                        </div>
                    </div>
                ) : (
                    /* Events List */
                    <div className="events-list">
                        <div className="event-item">
                            <div className="event-time">9:00 AM - 10:00 AM</div>
                            <div className="event-content">
                                <h4>Sample Event 1</h4>
                                <p>This is a sample event description...</p>
                            </div>
                            <button className="edit-button">Edit</button>
                        </div>

                        <div className="event-item">
                            <div className="event-time">2:00 PM - 3:00 PM</div>
                            <div className="event-content">
                                <h4>Sample Event 2</h4>
                                <p>Another sample event description...</p>
                            </div>
                            <button className="edit-button">Edit</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCalendar;