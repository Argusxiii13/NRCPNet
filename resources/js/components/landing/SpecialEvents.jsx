// SpecialEvents.jsx
import React from 'react';
import styles from '../../../css/styles/landing/SpecialEvents.module.css';

const SpecialEvents = () => {
    const valentinesEvent = {
        title: "Valentine's Day Celebration 2025",
        date: "February 14, 2025",
        events: [
            {
                time: "10:00 AM - 11:00 AM",
                activity: "Opening Ceremony & Message",
                location: "Main Hall"
            },
            {
                time: "11:00 AM - 1:00 PM",
                activity: "Valentine's Day Lunch Social",
                location: "Cafeteria"
            },
            {
                time: "2:00 PM - 4:00 PM",
                activity: "Team Building Activities",
                location: "Activity Center"
            },
            {
                time: "4:00 PM - 5:00 PM",
                activity: "Gift Giving & Recognition",
                location: "Main Hall"
            }
        ]
    };

    return (
        <div className={styles['special-events-container']}>
            <h3 className={styles['special-events-title']}>Special Events</h3>
            <div className={styles['special-events-content']}>
                <div className={styles['event-header']}>
                    <div className={styles['event-title']}>{valentinesEvent.title}</div>
                    <div className={styles['event-date']}>{valentinesEvent.date}</div>
                </div>
                <div className={styles['event-timeline']}>
                    {valentinesEvent.events.map((event, index) => (
                        <div key={index} className={styles['timeline-item']}>
                            <div className={styles['time-marker']}>
                                <div className={styles['time']}>{event.time}</div>
                                <div className={styles['marker']}></div>
                            </div>
                            <div className={styles['event-details']}>
                                <div className={styles['activity']}>{event.activity}</div>
                                <div className={styles['location']}>{event.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecialEvents;