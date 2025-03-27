import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/styles/landing/TodaysEvents.module.css';
import { format } from 'date-fns';

const TodaysEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Always use today's date
    const [currentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/calendar/date/${currentDate}`);
                
                if (response.data && response.data.length > 0) {
                    // Sort events by time
                    const sortedEvents = response.data.sort((a, b) => {
                        if (a.time === 'All Day') return -1;
                        if (b.time === 'All Day') return 1;
                        
                        const aStartTime = a.time.split(' - ')[0];
                        const bStartTime = b.time.split(' - ')[0];
                        return aStartTime.localeCompare(bStartTime);
                    });
                    
                    // Format times to AM/PM
                    const formattedEvents = sortedEvents.map(event => {
                        if (event.time === 'All Day') return event;
                        
                        // Handle time ranges (e.g., "09:00 - 10:30")
                        const times = event.time.split(' - ');
                        const formattedTimes = times.map(time => formatTimeToAMPM(time));
                        return {
                            ...event,
                            time: formattedTimes.join(' - ')
                        };
                    });
                    
                    setEvents(formattedEvents);
                } else {
                    setEvents([]);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentDate]);

    // Format the date for display
    const formatDisplayDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (err) {
            return dateString;
        }
    };

    // Format time to AM/PM
    const formatTimeToAMPM = (timeString) => {
        try {
            // Handle 24-hour format (e.g., "14:30")
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12; // Convert 0 to 12
            return `${formattedHour}:${minutes} ${ampm}`;
        } catch (err) {
            return timeString; // Return original if can't parse
        }
    };

    // Get lowercase event type for CSS class
    const getEventTypeClass = (type) => {
        return type.toLowerCase();
    };

    if (loading) {
        return <div className={styles['loading']}>Loading events...</div>;
    }

    if (error) {
        return <div className={styles['error']}>{error}</div>;
    }

    return (
        <div className={styles['special-events-container']}>
            <h3 className={styles['special-events-title']}>Today's Schedule</h3>
            <div className={styles['current-date']}>
                {formatDisplayDate(currentDate)}
            </div>
            <div className={styles['special-events-content']}>
                <div className={styles['special-events-items']}>
                    {events.map((event, index) => (
                        <div key={index} className={styles['special-event-item-container']}>
                            <div className={`${styles['special-event-type-indicator']} ${styles[getEventTypeClass(event.type)]}`}></div>
                            <div className={styles['special-event-date']}>
                                {event.time}
                            </div>
                            <div className={styles['special-event-details']}>
                                <h4 className={styles['event-title']}>{event.title}</h4>
                                <p className={styles['event-location']}>{event.location}</p>
                                {event.description && (
                                    <p className={styles['event-description']}>{event.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodaysEvents;
