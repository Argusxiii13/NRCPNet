import React, { useState } from 'react';
import { startOfToday } from 'date-fns';
import CalendarView from './CalendarView.jsx'; // Add the file extension
import EventsView from './EventsView.jsx'; // Add the file extension
import styles from '../../../css/styles/admin/CalendarManagement.module.css';

const CalendarManagement = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(today);
    const [isManageMode, setIsManageMode] = useState(false);

    return (
        <div className={styles['admin-calendar-page']}>
            {/* First Panel - Calendar View */}
            <div className={styles['panel']}>
                <div className={styles['panel-header']}>
                    <h2>Calendar View</h2>
                </div>
                <div className={styles['panel-content']}>
                    <CalendarView 
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                    />
                </div>
            </div>

            {/* Second Panel - Manage Events */}
            <div className={styles['panel']}>
                <div className={styles['panel-header']}>
                    <h2>Manage Events</h2>
                </div>
                <div className={styles['panel-content']}>
                    <EventsView 
                        selectedDay={selectedDay}
                        isManageMode={isManageMode}
                        setIsManageMode={setIsManageMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarManagement;