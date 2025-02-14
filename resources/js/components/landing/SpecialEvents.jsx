// SpecialEvents.jsx
import React from 'react';
import '../../../css/styles/landing/SpecialEvents.css';

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
        <div className="special-events-container">
            <h3 className="special-events-title">Special Events</h3>
            <div className="special-events-content">
                <div className="event-header">
                    <div className="event-title">{valentinesEvent.title}</div>
                    <div className="event-date">{valentinesEvent.date}</div>
                </div>
                <div className="event-timeline">
                    {valentinesEvent.events.map((event, index) => (
                        <div key={index} className="timeline-item">
                            <div className="time-marker">
                                <div className="time">{event.time}</div>
                                <div className="marker"></div>
                            </div>
                            <div className="event-details">
                                <div className="activity">{event.activity}</div>
                                <div className="location">{event.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecialEvents;