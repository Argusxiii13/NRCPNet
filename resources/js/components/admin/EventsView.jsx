import React from 'react';
import { format } from 'date-fns';
import '../../../css/styles/admin/EventsView.css';

const EventsView = ({ selectedDay, isManageMode, setIsManageMode }) => {
    return (
        <div className="admin-events-section">
            <div className="panel-sub-header">
                <h3>{format(selectedDay, 'MMMM dd, yyyy')}</h3>
                <button 
                    className={`toggle-button ${isManageMode ? 'active' : ''}`}
                    onClick={() => setIsManageMode(!isManageMode)}
                >
                    {isManageMode ? 'View Events' : 'Manage Events'}
                </button>
            </div>

            <div className="events-container">
                {isManageMode ? (
                    /* Event Management Form */
                    <div className="event-management-form">
                        <h4>Add New Event</h4>
                        <div className="form-group">
                            <label htmlFor="eventTitle">Event Title</label>
                            <input type="text" id="eventTitle" placeholder="Enter event title" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventDescription">Description</label>
                            <textarea id="eventDescription" placeholder="Enter event description"></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <div className="time-input">
                                    <label htmlFor="startTime">Start Time</label>
                                    <input type="time" id="startTime" />
                                </div>
                                <div className="time-input">
                                    <label htmlFor="endTime">End Time</label>
                                    <input type="time" id="endTime" />
                                </div>
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

export default EventsView;