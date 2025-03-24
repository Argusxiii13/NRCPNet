import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios'; // Make sure axios is installed
import styles from '../../../css/styles/admin/EventsView.module.css';

const EventsView = ({ selectedDay, isManageMode, setIsManageMode }) => {
    const [eventDate, setEventDate] = useState(selectedDay);
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        date: formatDateForInput(selectedDay),
        startTime: '',
        endTime: '',
        location: '',
        description: ''
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format date for date input (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Load events when selected day changes
    useEffect(() => {
        fetchEventsByDate(formatDateForInput(selectedDay));
        setEventDate(selectedDay);
        setFormData({
            ...formData,
            date: formatDateForInput(selectedDay)
        });
    }, [selectedDay]);

    // Fetch events for a specific date
    const fetchEventsByDate = async (date) => {
        setIsLoading(true);
        setError(null);
        try {
            // Updated to match the Laravel route
            const response = await axios.get(`/api/calendar/date/${date}`);
            setEvents(response.data);
        } catch (err) {
            setError('Failed to load events. Please try again.');
            console.error('Error fetching events:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Remove the 'event' prefix and convert to lowercase if present
        const fieldName = id.startsWith('event') ? id.replace('event', '').toLowerCase() : id;
        
        setFormData({
            ...formData,
            [fieldName]: value
        });
    };

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setEventDate(newDate);
        setFormData({
            ...formData,
            date: e.target.value
        });
        
        // If we're in view mode, fetch events for the new date
        if (!isManageMode) {
            fetchEventsByDate(e.target.value);
        }
    };

    // Save event (create or update)
    const handleSaveEvent = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Debugging - log the form data
            console.log("Saving event with data:", formData);
            
            const payload = {
                title: formData.title,
                type: formData.type,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
                description: formData.description
            };

            let response;
            if (editingEvent) {
                // Update existing event
                response = await axios.put(`/api/calendar/${editingEvent.id}`, payload);
            } else {
                // Create new event
                response = await axios.post('/api/calendar', payload);
            }

            // Refresh events list
            fetchEventsByDate(formData.date);
            
            // Reset form
            resetForm();
            setEditingEvent(null);
            setIsManageMode(false);
        } catch (err) {
            setError('Failed to save event. Please check your inputs and try again.');
            console.error('Error saving event:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Edit event
    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsManageMode(true);
        
        // Parse time if it's in "startTime - endTime" format
        let startTime = '';
        let endTime = '';
        if (event.time && event.time.includes('-')) {
            const [start, end] = event.time.split('-').map(t => t.trim());
            startTime = start;
            endTime = end;
        }

        setFormData({
            title: event.title,
            type: event.type,
            date: event.date,
            startTime: startTime,
            endTime: endTime,
            location: event.location || '',
            description: event.description || ''
        });
    };

    // Delete event
    const handleDeleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        setIsLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/calendar/${id}`);
            // Refresh events list
            fetchEventsByDate(formatDateForInput(eventDate));
        } catch (err) {
            setError('Failed to delete event. Please try again.');
            console.error('Error deleting event:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            type: '',
            date: formatDateForInput(selectedDay),
            startTime: '',
            endTime: '',
            location: '',
            description: ''
        });
    };

    // Format time for display (e.g., "9:00 AM - 10:00 AM")
    const formatTimeForDisplay = (timeString) => {
        if (!timeString) return '';
        return timeString;
    };

    // Navigate to the previous day
    const goToPreviousDay = () => {
        const prevDay = new Date(eventDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setEventDate(prevDay);
        const formattedDate = formatDateForInput(prevDay);
        fetchEventsByDate(formattedDate);
    };

    // Navigate to the next day
    const goToNextDay = () => {
        const nextDay = new Date(eventDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setEventDate(nextDay);
        const formattedDate = formatDateForInput(nextDay);
        fetchEventsByDate(formattedDate);
    };

    return (
        <div className={styles['admin-events-section']}>
            <div className={styles['panel-sub-header']}>
                <div className={styles['date-container']}>
                    {!isManageMode ? (
                        <div className={styles['date-navigation']}>
                            <button 
                                onClick={goToPreviousDay}
                                className={styles['date-nav-button']}
                                type="button"
                            >
                                &lt;
                            </button>
                            <div className={styles['date-picker-container']}>
                                <h3>{format(eventDate, 'MMMM dd, yyyy')}</h3>
                                <input 
                                    type="date" 
                                    value={formatDateForInput(eventDate)}
                                    onChange={handleDateChange}
                                    className={styles['date-picker-input']}
                                />
                            </div>
                            <button 
                                onClick={goToNextDay}
                                className={styles['date-nav-button']}
                                type="button"
                            >
                                &gt;
                            </button>
                        </div>
                    ) : (
                        <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                    )}
                </div>
                <button 
                    className={`${styles['toggle-button']} ${isManageMode ? styles['active'] : ''}`}
                    onClick={() => {
                        resetForm();
                        setEditingEvent(null);
                        setIsManageMode(!isManageMode);
                    }}
                    type="button"
                >
                    {isManageMode ? 'View Events' : 'Manage Events'}
                </button>
            </div>

            {error && <div className={styles['error-message']}>{error}</div>}

            <div className={styles['events-container']}>
                {isManageMode ? (
                    /* Event Management Form */
                    <div className={styles['event-management-form']}>
                        <h4>{editingEvent ? 'Edit Event' : 'Add New Event'}</h4>
                        
                        <form onSubmit={handleSaveEvent}>
                            {/* First Row: Title and Event Type */}
                            <div className={styles['form-row']}>
                                <div className={styles['form-group']}>
                                    <label htmlFor="eventTitle">Event Title</label>
                                    <input 
                                        type="text" 
                                        id="eventTitle" 
                                        placeholder="Enter event title" 
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="eventType">Event Type</label>
                                    <select 
                                        id="eventType"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Event">Event</option>
                                        <option value="Holiday">Holiday</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Second Row: Date and Location */}
                            <div className={styles['form-row']}>
                                <div className={styles['form-group']}>
                                    <label htmlFor="eventDate">Event Date</label>
                                    <div className={styles['date-picker']}>
                                        <input 
                                            type="date" 
                                            id="eventDate" 
                                            value={formData.date}
                                            onChange={handleDateChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="eventLocation">Location</label>
                                    <input 
                                        type="text" 
                                        id="eventLocation" 
                                        placeholder="Enter event location" 
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            {/* Third Row: Start Time and End Time */}
                            <div className={styles['form-row']}>
                                <div className={styles['form-group']}>
                                    <label htmlFor="startTime">Start Time</label>
                                    <input 
                                        type="time" 
                                        id="startTime" 
                                        value={formData.startTime || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="endTime">End Time</label>
                                    <input 
                                        type="time" 
                                        id="endTime" 
                                        value={formData.endTime || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            {/* Description field taking remaining space */}
                            <div className={styles['form-group']}>
                                <label htmlFor="eventDescription">Description</label>
                                <textarea 
                                    id="eventDescription" 
                                    placeholder="Enter event description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            
                            <div className={styles['form-buttons']}>
                                <button 
                                    type="button"
                                    className={styles['cancel-button']}
                                    onClick={() => {
                                        resetForm();
                                        setEditingEvent(null);
                                        setIsManageMode(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles['save-button-cal']}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Events List */
                    <div className={styles['events-list']}>
                        {isLoading ? (
                            <div className={styles['loading']}>Loading events...</div>
                        ) : events.length > 0 ? (
                            events.map(event => (
                                <div key={event.id} className={styles['event-item']}>
                                    <div className={styles['event-time']}>
                                        {formatTimeForDisplay(event.time)}
                                    </div>
                                    <div className={styles['event-content']}>
                                        <h4>{event.title}</h4>
                                        {event.location && <div className={styles['event-location']}>{event.location}</div>}
                                        {event.description && <p>{event.description}</p>}
                                    </div>
                                    <div className={styles['event-actions']}>
                                        <button 
                                            className={styles['edit-button']}
                                            onClick={() => handleEditEvent(event)}
                                            type="button"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className={styles['delete-button']}
                                            onClick={() => handleDeleteEvent(event.id)}
                                            type="button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles['no-events']}>
                                No events scheduled for this day.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsView;