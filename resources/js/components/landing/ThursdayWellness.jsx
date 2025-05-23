// ThursdayWellness.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/styles/landing/ThursdayWellness.module.css';

const formatTime = (timeString) => {
    // If time is already in AM/PM format, return as is
    if (/[AP]M/.test(timeString)) return timeString;

    // Split the time string into start and end times
    const [startTime, endTime] = timeString.split(' - ');

    // Helper function to convert 24-hour time to 12-hour AM/PM format
    const convert24To12 = (time) => {
        if (!time) return '';
        
        const [hours, minutes] = time.split(':');
        const hourNum = parseInt(hours, 10);
        
        if (hourNum === 0) return `12:${minutes} AM`;
        if (hourNum === 12) return `12:${minutes} PM`;
        
        if (hourNum > 12) {
            return `${hourNum - 12}:${minutes} PM`;
        } else {
            return `${hourNum}:${minutes} AM`;
        }
    };

    // Convert both start and end times
    const formattedStartTime = convert24To12(startTime);
    const formattedEndTime = convert24To12(endTime);

    return `${formattedStartTime} - ${formattedEndTime}`;
};

// Modified to accept and use onContentChange prop
const ThursdayWellness = ({ user, isAuthenticated, onContentChange }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log('User in Wellness:', user);
    console.log('Is Authenticated in Wellness:', isAuthenticated);

    useEffect(() => {
        const fetchWellnessActivities = async () => {
            try {
                setIsLoading(true);
                
                // Fetch wellness activities regardless of authentication
                let url = '/api/wellness-activities';
                
                // Only add division parameter if user is authenticated and has a division
                if (isAuthenticated && user && user.division) {
                    url += `?division=${user.division}`;
                }
                
                const response = await axios.get(url);
                setActivities(response.data);
                
                // Notify parent component about content status
                if (onContentChange) {
                    onContentChange(response.data && response.data.length > 0);
                }
                
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
                if (onContentChange) {
                    onContentChange(false);
                }
            }
        };
    
        fetchWellnessActivities();
    }, [onContentChange, isAuthenticated, user]);

    // Return null if no activities and not loading
    if (!isLoading && (activities.length === 0 || error)) {
        return null;
    }

    // If loading, return null
    if (isLoading) {
        return null;
    }

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
                                <h4 className={styles['sport-title']}>{activity.title}</h4>
                                <p className={styles['time-info']}>{formatTime(activity.time)}</p>
                                <p className={styles['location-info']}>{activity.location}</p>
                                <p className={styles['participant-info']}>{activity.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThursdayWellness;