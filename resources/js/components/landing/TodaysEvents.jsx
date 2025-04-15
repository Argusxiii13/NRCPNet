import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/styles/landing/TodaysEvents.module.css';
import { format } from 'date-fns';

const TodaysEvents = ({user, isAuthenticated}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    console.log('User in Todays Event:', user);
    console.log('Is Authenticated in Todays Event:', isAuthenticated);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                let url = `/api/calendar/date/${currentDate}`;
                
                // Add user division as a parameter if user is authenticated
                if (isAuthenticated && user && user.division) {
                    url += `?division=${user.division}`;
                }
                
                const response = await axios.get(url);
                
                if (response.data && response.data.length > 0) {
                    const sortedEvents = response.data.sort((a, b) => {
                        if (a.time === 'All Day') return -1;
                        if (b.time === 'All Day') return 1;
                        
                        const aStartTime = a.time.split(' - ')[0];
                        const bStartTime = b.time.split(' - ')[0];
                        return aStartTime.localeCompare(bStartTime);
                    });
                    
                    const formattedEvents = sortedEvents.map(event => {
                        if (event.time === 'All Day') return event;
                        
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
    }, [currentDate, isAuthenticated, user]);

    const formatDisplayDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (err) {
            return dateString;
        }
    };

    const formatTimeToAMPM = (timeString) => {
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        } catch (err) {
            return timeString;
        }
    };

    const getEventTypeClass = (type) => {
        return type.toLowerCase();
    };

    // Return null if no events and not loading
    if (!loading && (events.length === 0 || error)) {
        return null;
    }

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