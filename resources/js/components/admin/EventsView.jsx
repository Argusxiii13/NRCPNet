import React from 'react';
import { format } from 'date-fns';
import styles from '../../../css/styles/admin/EventsView.module.css';

const EventsView = ({ selectedDay, isManageMode, setIsManageMode }) => {
    return (
        <div className={styles['admin-events-section']}>
            <div className={styles['panel-sub-header']}>
                <h3>{format(selectedDay, 'MMMM dd, yyyy')}</h3>
                <button 
                    className={`${styles['toggle-button']} ${isManageMode ? styles['active'] : ''}`}
                    onClick={() => setIsManageMode(!isManageMode)}
                >
                    {isManageMode ? 'View Events' : 'Manage Events'}
                </button>
            </div>

            <div className={styles['events-container']}>
                {isManageMode ? (
                    /* Event Management Form */
                    <div className={styles['event-management-form']}>
                        <h4>Add New Event</h4>
                        <div className={styles['form-group']}>
                            <label htmlFor="eventTitle">Event Title</label>
                            <input type="text" id="eventTitle" placeholder="Enter event title" />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="eventDescription">Description</label>
                            <textarea id="eventDescription" placeholder="Enter event description"></textarea>
                        </div>
                        <div className={styles['form-row']}>
                            <div className={styles['form-group']}>
                                <div className={styles['time-input']}>
                                    <label htmlFor="startTime">Start Time</label>
                                    <input type="time" id="startTime" />
                                </div>
                                <div className={styles['time-input']}>
                                    <label htmlFor="endTime">End Time</label>
                                    <input type="time" id="endTime" />
                                </div>
                            </div>
                        </div>
                        <div className={styles['form-buttons']}>
                            <button 
                                className={styles['cancel-button']}
                                onClick={() => setIsManageMode(false)}
                            >
                                Cancel
                            </button>
                            <button className={styles['save-button-cal']}>Save Event</button>
                        </div>
                    </div>
                ) : (
                    /* Events List */
                    <div className={styles['events-list']}>
                        <div className={styles['event-item']}>
                            <div className={styles['event-time']}>9:00 AM - 10:00 AM</div>
                            <div className={styles['event-content']}>
                                <h4>Sample Event 1</h4>
                                <p>This is a sample event description...</p>
                            </div>
                            <button className={styles['edit-button']}>Edit</button>
                        </div>

                        <div className={styles['event-item']}>
                            <div className={styles['event-time']}>2:00 PM - 3:00 PM</div>
                            <div className={styles['event-content']}>
                                <h4>Sample Event 2</h4>
                                <p>Another sample event description...</p>
                            </div>
                            <button className={styles['edit-button']}>Edit</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsView;