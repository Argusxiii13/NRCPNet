import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/styles/landing/SuggestionBox.css';

const SuggestionBox = () => {
    const [suggestion, setSuggestion] = useState('');
    const [selectedDivisionCode, setSelectedDivisionCode] = useState('');
    const [selectedSectionName, setSelectedSectionName] = useState('');
    const [availableSections, setAvailableSections] = useState([]);
    const [submitStatus, setSubmitStatus] = useState({ 
        message: '', 
        type: '' // 'success' or 'error'
    });
    const [divisions, setDivisions] = useState([]);

    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/divisions');
                setDivisions(response.data); // Assuming the response is directly the divisions array
            } catch (error) {
                console.error('Error fetching divisions:', error);
            }
        };

        fetchDivisions();
    }, []);

    const handleChange = (e) => {
        setSuggestion(e.target.value);
    };

    const handleDivisionChange = (e) => {
        const divisionCode = e.target.value;
        setSelectedDivisionCode(divisionCode);
        
        // Reset section when division changes
        setSelectedSectionName('');
        
        // Find the selected division
        const division = divisions.find(div => div.code === divisionCode);
        
        // Update available sections based on selected division
        if (division && division.has_sections) {
            setAvailableSections(division.sections);
        } else {
            setAvailableSections([]);
        }
    };

    const handleSectionChange = (e) => {
        setSelectedSectionName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: '', type: '' });
        
        const suggestionData = {
            content: suggestion,
            division: selectedDivisionCode, // Send division code
            section: selectedSectionName || null // Send section name
        };
    
        try {
            const response = await axios.post('http://localhost:8000/api/suggestion', suggestionData);
            console.log('Suggestion submitted:', response.data);
    
            // Show success message
            setSubmitStatus({
                message: 'Suggestion submitted successfully!',
                type: 'success'
            });
    
            // Clear form after submission
            setSuggestion('');
            setSelectedDivisionCode('');
            setSelectedSectionName('');
            setAvailableSections([]);
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    
            setSubmitStatus({
                message: errorMessage,
                type: 'error'
            });
        }
    };

    return (
        <div className="suggestion-container">
            <h4>Suggestion Box</h4>
            {submitStatus.message && (
                <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="dropdown-container">
                    <select 
                        className="suggestion-dropdown"
                        value={selectedDivisionCode}
                        onChange={handleDivisionChange}
                        required
                    >
                        <option value="">Select Division</option>
                        {divisions.map(division => (
                            <option key={division.id} value={division.code}>
                                {division.code} - {division.name}
                            </option>
                        ))}
                    </select>
                    
                    <select 
                        className="suggestion-dropdown"
                        value={selectedSectionName}
                        onChange={handleSectionChange}
                        disabled={!availableSections.length}
                        required={availableSections.length > 0}
                    >
                        <option value="">Select Section</option>
                        {availableSections.map(section => (
                            <option key={section.id} value={section.name}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <textarea
                    className="suggestion-input"
                    placeholder="Place Suggestion Here :D"
                    value={suggestion}
                    onChange={handleChange}
                    required
                />
                <div className="button-container">
                    <button type="submit" className="suggestion-button">Send</button>
                </div>
            </form>
        </div>
    );
};

export default SuggestionBox;