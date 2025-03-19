// ThursdayWellness.jsx
import React from 'react';
import styles from '../../../css/styles/landing/ThursdayWellness.module.css';

const ThursdayWellness = () => {
    const activities = [
        {
            date: '2025-03-06',
            sport: 'Badminton',
            time: '3:00 PM - 5:00 PM',
            location: 'Sports Complex',
            participants: 'Singles & Doubles'
        }
    ];

    return (
        <div className={styles['wellness-container']}>
            <h3 className={styles['wellness-title']}>Thursday Wellness Activities</h3>
            <div className={styles['wellness-content']}>
                <div className={styles['wellness-items']}>
                    {activities.map((activity, index) => (
                        <div key={index} className={styles['wellness-item-container']}>
                            <div className={styles['wellness-date']}>
                                {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className={styles['wellness-details']}>
                                <h4 className={styles['sport-title']}>{activity.sport}</h4>
                                <p className={styles['time-info']}>{activity.time}</p>
                                <p className={styles['location-info']}>{activity.location}</p>
                                <p className={styles['participant-info']}>{activity.participants}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThursdayWellness;