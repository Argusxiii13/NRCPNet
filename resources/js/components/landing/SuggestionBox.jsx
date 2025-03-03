import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/styles/landing/SuggestionBox.css';

const SuggestionBox = () => {
    const [suggestion, setSuggestion] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [availableSections, setAvailableSections] = useState([]);
    const [submitStatus, setSubmitStatus] = useState({ 
        message: '', 
        type: '' // 'success' or 'error'
    });

    // Sample data - will be replaced with API calls
    const [divisions, setDivisions] = useState([
        {
            id: 1,
            code: 'OP',
            name: 'Office of the President',
            hasSections: false,
            sections: []
        },
        {
            id: 2,
            code: 'OED',
            name: 'Office of the Executive Directory',
            hasSections: false,
            sections: []
        },
        {
            id: 3,
            code: 'FAD',
            name: 'Finance and Administrative Division',
            hasSections: true,
            sections: [
                { id: 1, name: 'Budget Section' },
                { id: 2, name: 'Accounting Section' },
                { id: 3, name: 'Cash Section' },
                { id: 4, name: 'HR Section' },
                { id: 5, name: 'Records Section' }
            ]
        },
        {
            id: 4,
            code: 'RDMD',
            name: 'Research and Development Management Division',
            hasSections: true,
            sections: [
                { id: 6, name: 'REMS' },
                { id: 7, name: 'TCDS' }
            ]
        },
        {
            id: 5,
            code: 'RIDD',
            name: 'Research Information and Data Division',
            hasSections: true,
            sections: [
                { id: 8, name: 'IDS' },
                { id: 9, name: 'LS' },
                { id: 10, name: 'MIS' }
            ]
        }
    ]);

    // Configure axios to work with Laravel
    useEffect(() => {
        // Get the CSRF token from the meta tag if it exists
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }
        
        // Set up axios to include credentials in requests
        axios.defaults.withCredentials = true;
    }, []);

    const handleChange = (e) => {
        setSuggestion(e.target.value);
    };

    const handleDivisionChange = (e) => {
        const divisionId = parseInt(e.target.value);
        setSelectedDivision(divisionId);
        
        // Reset section when division changes
        setSelectedSection('');
        
        // Find the selected division
        const division = divisions.find(div => div.id === divisionId);
        
        // Update available sections based on selected division
        if (division && division.hasSections) {
            setAvailableSections(division.sections);
        } else {
            setAvailableSections([]);
        }
    };

    const handleSectionChange = (e) => {
        setSelectedSection(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: '', type: '' });
        
        const suggestionData = {
            content: suggestion,
            division: String(selectedDivision), // Convert to string for varchar
            section: selectedSection || null // Ensure null when empty
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
            setSelectedDivision('');
            setSelectedSection('');
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
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                        required
                    >
                        <option value="">Select Division</option>
                        {divisions.map(division => (
                            <option key={division.id} value={division.id}>
                                {division.code} - {division.name}
                            </option>
                        ))}
                    </select>
                    
                    <select 
                        className="suggestion-dropdown"
                        value={selectedSection}
                        onChange={handleSectionChange}
                        disabled={!availableSections.length}
                        required={availableSections.length > 0}
                    >
                        <option value="">Select Section</option>
                        {availableSections.map(section => (
                            <option key={section.id} value={section.id}>
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