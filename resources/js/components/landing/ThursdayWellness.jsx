// ThursdayWellness.jsx
import React from 'react';
import '../../../css/styles/landing/ThursdayWellness.css';


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
        <div className="wellness-container">
            <h3 className="wellness-title">Thursday Wellness Activities</h3>
            <div className="wellness-content">
                <div className="wellness-items">
                    {activities.map((activity, index) => (
                        <div key={index} className="wellness-item">
                            <div className="wellness-date">
                                {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="wellness-details">
                                <h4 className="sport-title">{activity.sport}</h4>
                                <p className="time-info">{activity.time}</p>
                                <p className="location-info">{activity.location}</p>
                                <p className="participant-info">{activity.participants}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThursdayWellness;