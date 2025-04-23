import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios'; // Make sure axios is installed
import styles from '../../../css/styles/admin/EventsView.module.css';
import { useAuth } from '../../hooks/useAuth'; // Update path as needed


const EventsView = ({ selectedDay, isManageMode, setIsManageMode }) => {
    const [eventDate, setEventDate] = useState(selectedDay);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        date: format(selectedDay, 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        location: '',
        author: user ? `${user.first_name} ${user.surname}` : '',  // Set author from user name
        description: '',
        division: user?.division || 'General' // Set division from user division if available
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeDisabled, setTimeDisabled] = useState(false);
    const [divisions, setDivisions] = useState([]); // Added state for divisions list
    const [loadingDivisions, setLoadingDivisions] = useState(false); // Added loading state for divisions
    
    // Validation errors state
    const [validationErrors, setValidationErrors] = useState({
        title: false,
        type: false,
        date: false,
        startTime: false,
        endTime: false,
        location: false,
        author: false,  // Added author validation
        description: false,
        division: false // Added division validation
    });

    // Format date for date input (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Check if the selected date is a Thursday
    const isThursday = (date) => {
        return new Date(date).getDay() === 4; // 0 is Sunday, 4 is Thursday
    };

    // Fetch divisions from API
    useEffect(() => {
        const fetchDivisions = async () => {
            setLoadingDivisions(true);
            try {
                const response = await axios.get('/api/divisions');
                // Filter out 'General' if it exists in the API response to avoid duplicates
                const filteredDivisions = response.data.filter(div => div.code !== 'General');
                setDivisions(filteredDivisions);
            } catch (err) {
                console.error('Error fetching divisions:', err);
                setError('Failed to load divisions. Please refresh the page.');
            } finally {
                setLoadingDivisions(false);
            }
        };

        fetchDivisions();
    }, []);

    // Validation function
    const validateFields = () => {
        const newValidationErrors = {
            title: !formData.title.trim(),
            type: !formData.type,
            date: !formData.date,
            startTime: !timeDisabled && !formData.startTime,
            endTime: !timeDisabled && !formData.endTime,
            location: !formData.location.trim(),
            author: !formData.author.trim(),  // Added author validation
            description: !formData.description.trim(),
            division: !formData.division // Modified division validation
        };

        setValidationErrors(newValidationErrors);

        // Return true if all fields are valid (no errors)
        return !Object.values(newValidationErrors).some(error => error);
    };

    // Load events when selected day changes
    useEffect(() => {
        fetchEventsByDate(formatDateForInput(selectedDay));
        setEventDate(selectedDay);
        
        const isSelectedDayThursday = isThursday(selectedDay);
        
        // Update form data with new date
        let updatedFormData = {
            ...formData,
            date: formatDateForInput(selectedDay)
        };
        
        // If changing from Thursday to non-Thursday and type is Wellness, reset type
        if (!isSelectedDayThursday && formData.type === 'Wellness') {
            updatedFormData = {
                ...updatedFormData,
                type: ''
            };
        }
        
        setFormData(updatedFormData);
        
        // Set time disabled only if it's Thursday AND type is Wellness
        setTimeDisabled(isSelectedDayThursday && formData.type === 'Wellness');
    }, [selectedDay]);

    useEffect(() => {
        if (user && !formData.author) {
            setFormData(prev => ({
                ...prev,
                author: `${user.first_name} ${user.surname}`,
                division: user.division || prev.division
            }));
        }
    }, [user]);

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
        
        let updatedFormData = {
            ...formData,
            [fieldName]: value
        };
        
        // Clear validation error for this field
        setValidationErrors(prev => ({
            ...prev,
            [fieldName]: !value.trim()
        }));
        
        // If event type changes to Wellness, set the specific time
        if (fieldName === 'type' && value === 'Wellness' && isThursday(formData.date)) {
            updatedFormData = {
                ...updatedFormData,
                startTime: '15:00',
                endTime: '17:00'
            };
            setTimeDisabled(true);
        } 
        // If changing from Wellness to another type, enable time fields
        else if (fieldName === 'type' && formData.type === 'Wellness' && value !== 'Wellness') {
            setTimeDisabled(false);
        }
        
        setFormData(updatedFormData);
    };

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setEventDate(newDate);
        
        const isNewDateThursday = isThursday(e.target.value);
        
        let updatedFormData = {
            ...formData,
            date: e.target.value
        };
        
        // If changing from Thursday to non-Thursday and type is Wellness, reset type
        if (!isNewDateThursday && formData.type === 'Wellness') {
            updatedFormData = {
                ...updatedFormData,
                type: '',
                startTime: '',
                endTime: ''
            };
            setTimeDisabled(false);
        }
        // If changing to Thursday and type is already set to Wellness, lock time to 3PM-5PM
        else if (isNewDateThursday && formData.type === 'Wellness') {
            updatedFormData = {
                ...updatedFormData,
                startTime: '15:00',
                endTime: '17:00'
            };
            setTimeDisabled(true);
        }
        
        setFormData(updatedFormData);
        
        // If we're in view mode, fetch events for the new date
        if (!isManageMode) {
            fetchEventsByDate(e.target.value);
        }
    };

    // Save event (create or update)
    const handleSaveEvent = async (e) => {
        e.preventDefault();
        
        // Validate fields first
        if (!validateFields()) {
            return; // Stop if validation fails
        }

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
                author: formData.author,  // Added author to payload
                description: formData.description,
                division: formData.division // Added division to payload
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
            
            // Reset validation errors
            setValidationErrors({
                title: false,
                type: false,
                date: false,
                startTime: false,
                endTime: false,
                location: false,
                author: false,  // Added author validation reset
                description: false,
                division: false
            });
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
            startTime = convertTo24HourFormat(start);
            endTime = convertTo24HourFormat(end);
        }

        const eventFormData = {
            title: event.title,
            type: event.type,
            date: event.date,
            startTime: startTime,
            endTime: endTime,
            location: event.location || '',
            author: event.author || '',  // Added author field
            description: event.description || '',
            division: event.division || 'General' // Set to General if empty
        };

        // Set time disabled based on event type and day
        setTimeDisabled(isThursday(event.date) && event.type === 'Wellness');

        setFormData(eventFormData);
    };

    // Convert 12-hour format (e.g., "9:00 AM") to 24-hour format (e.g., "09:00")
    const convertTo24HourFormat = (timeStr) => {
        if (!timeStr || !timeStr.trim()) return '';
        
        try {
            // Check if the time already has AM/PM indicator
            if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
                const timeParts = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
                if (!timeParts) return timeStr;
                
                let hours = parseInt(timeParts[1], 10);
                const minutes = timeParts[2];
                const period = timeParts[3].toLowerCase();
                
                // Convert to 24-hour format
                if (period === 'pm' && hours < 12) {
                    hours += 12;
                } else if (period === 'am' && hours === 12) {
                    hours = 0;
                }
                
                return `${hours.toString().padStart(2, '0')}:${minutes}`;
            } else {
                // Assume it's already in 24-hour format
                return timeStr;
            }
        } catch (e) {
            console.error('Error converting time format:', e);
            return timeStr;
        }
    };

    // Convert 24-hour format (e.g., "09:00") to 12-hour format (e.g., "9:00 AM")
    const formatTimeTo12Hour = (timeStr) => {
        if (!timeStr || !timeStr.trim()) return '';
        
        try {
            // Check if the time is in 24-hour format ("HH:MM")
            const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
            if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = match[2];
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                return `${displayHours}:${minutes} ${period}`;
            }
            
            // If not in 24-hour format, return as is
            return timeStr;
        } catch (e) {
            console.error('Error formatting time:', e);
            return timeStr;
        }
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
// Update resetForm function to keep author set
const resetForm = () => {
    setFormData({
        title: '',
        type: '',
        date: formatDateForInput(selectedDay),
        startTime: '',
        endTime: '',
        location: '',
        author: user ? `${user.first_name} ${user.surname}` : '',  // Keep author set to user
        description: '',
        division: user?.division || 'General' // Keep user's division as default
    });
    setTimeDisabled(false);
};

    // Format time for display (e.g., "9:00 AM - 10:00 AM")
    const formatTimeForDisplay = (timeString) => {
        if (!timeString) return '';
        
        // If the timeString already contains a dash (e.g., "09:00 - 10:00")
        if (timeString.includes('-')) {
            const [startTime, endTime] = timeString.split('-').map(t => t.trim());
            const formattedStartTime = formatTimeTo12Hour(startTime);
            const formattedEndTime = formatTimeTo12Hour(endTime);
            return (
                <>
                    {formattedStartTime}<br />
                    {formattedEndTime}
                </>
            );
        }
        
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

    // Get event type class for styling
    const getEventTypeClass = (type) => {
        if (!type) return '';
        return styles[type.toLowerCase()];
    };

    // Check if current date is Thursday
    const isCurrentDateThursday = isThursday(formData.date);

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
                                <div className={`${styles['form-group']} ${validationErrors.title ? styles['error-field'] : ''}`}>
                                    <label htmlFor="eventTitle">Event Title</label>
                                    <input 
                                        type="text" 
                                        id="eventTitle" 
                                        placeholder="Enter event title" 
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.title && <span className={styles['error-message']}>Title is required</span>}
                                </div>
                                <div className={`${styles['form-group']} ${validationErrors.type ? styles['error-field'] : ''}`}>
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
                                        {/* Only show Wellness option on Thursdays */}
                                        {isCurrentDateThursday && <option value="Wellness">Wellness</option>}
                                    </select>
                                    {validationErrors.type && <span className={styles['error-message']}>Type is required</span>}
                                </div>
                            </div>
                            
                            {/* Second Row: Date and Division (new) */}
                            <div className={styles['form-row']}>
                                <div className={`${styles['form-group']} ${validationErrors.date ? styles['error-field'] : ''}`}>
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
                                    {validationErrors.date && <span className={styles['error-message']}>Date is required</span>}
                                </div>
                                <div className={`${styles['form-group']} ${validationErrors.division ? styles['error-field'] : ''}`}>
                                    <label htmlFor="division">Division</label>
                                    <select 
                                        id="division"
                                        value={formData.division} // Use the value from state, which defaults to 'General'
                                        onChange={handleInputChange}
                                        required
                                        disabled={loadingDivisions}
                                    >
                                        <option value="General">General</option>
                                        {/* Render all divisions from API */}
                                        {loadingDivisions ? (
                                            <option value="" disabled>Loading divisions...</option>
                                        ) : (
                                            divisions.map(division => (
                                                <option key={division.id} value={division.code}>
                                                    {division.code}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    {validationErrors.division && <span className={styles['error-message']}>Division is required</span>}
                                </div>
                            </div>
                            
                            {/* Third Row: Location and Author (new) */}
                            <div className={styles['form-row']}>
                                <div className={`${styles['form-group']} ${validationErrors.location ? styles['error-field'] : ''}`}>
                                    <label htmlFor="eventLocation">Location</label>
                                    <input 
                                        type="text" 
                                        id="eventLocation" 
                                        placeholder="Enter event location" 
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.location && <span className={styles['error-message']}>Location is required</span>}
                                </div>
                                
                                {/* New Author field */}
                                <div className={`${styles['form-group']} ${validationErrors.author ? styles['error-field'] : ''}`}>
        <label htmlFor="author">Author</label>
        <input 
            type="text" 
            id="author" 
            placeholder="Event author" 
            value={formData.author}
            onChange={handleInputChange}
            disabled={true} // Disable the field
            title="Automatically set to your name" // Add helpful tooltip
            required
        />
        {validationErrors.author && <span className={styles['error-message']}>Author is required</span>}
    </div>
                            </div>
                            
                            {/* Fourth Row: Start Time and End Time */}
                            <div className={styles['form-row']}>
                                <div className={`${styles['form-group']} ${!timeDisabled && validationErrors.startTime ? styles['error-field'] : ''}`}>
                                    <label htmlFor="startTime">Start Time</label>
                                    <input 
                                        type="time" 
                                        id="startTime" 
                                        value={formData.startTime || ''}
                                        onChange={handleInputChange}
                                        disabled={timeDisabled}
                                        title={timeDisabled ? 'Time is fixed for Wellness events on Thursday' : ''}
                                        required={!timeDisabled}
                                    />
                                    {!timeDisabled && validationErrors.startTime && <span className={styles['error-message']}>Start Time is required</span>}
                                </div>
                                <div className={`${styles['form-group']} ${!timeDisabled && validationErrors.endTime ? styles['error-field'] : ''}`}>
                                    <label htmlFor="endTime">End Time</label>
                                    <input 
                                        type="time" 
                                        id="endTime" 
                                        value={formData.endTime || ''}
                                        onChange={handleInputChange}
                                        disabled={timeDisabled}
                                        title={timeDisabled ? 'Time is fixed for Wellness events on Thursday' : ''}
                                        required={!timeDisabled}
                                    />
                                    {!timeDisabled && validationErrors.endTime && <span className={styles['error-message']}>End Time is required</span>}
                                </div>
                            </div>
                            
                            {/* Description field taking remaining space */}
                            <div className={`${styles['form-group']} ${validationErrors.description ? styles['error-field'] : ''}`}>
                                <label htmlFor="eventDescription">Description</label>
                                <textarea 
                                    id="eventDescription" 
                                    placeholder="Enter event description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.description && <span className={styles['error-message']}>Description is required</span>}
                            </div>
                            
                            {/* Show message about Wellness events if applicable */}
                            {isCurrentDateThursday && formData.type === 'Wellness' && (
                                <div className={styles['info-message'] || ''}>
                                    Wellness events on Thursday are automatically scheduled from 3:00 PM to 5:00 PM.
                                </div>
                            )}
                            
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
                                <div key={event.id} className={`${styles['event-item']} ${getEventTypeClass(event.type)}`}>
                                    <div className={styles['event-time']}>
                                        {formatTimeForDisplay(event.time)}
                                    </div>
                                    <div className={styles['event-content']}>
                                        <h4>{event.title}</h4>
                                        <div className={`${styles['event-type']} ${getEventTypeClass(event.type)}`}>{event.type}</div>
                                        {event.location && <div className={styles['event-location']}>Location: {event.location}</div>}
                                        {event.author && <div className={styles['event-author']}>Author: {event.author}</div>}
                                        {event.division && <div className={styles['event-division']}>Division: {event.division}</div>}
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