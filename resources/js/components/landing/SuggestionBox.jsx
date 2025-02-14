import React, { useState } from 'react';
import '../../../css/styles/landing/SuggestionBox.css';

const SuggestionBox = () => {
    const [suggestion, setSuggestion] = useState('');

    const handleChange = (e) => {
        setSuggestion(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Suggestion submitted:', suggestion);
        setSuggestion(''); // Clear the input after submission
    };

    return (
        <div className="suggestion-container">
            <h4>Suggestion Box</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="suggestion-input"
                    placeholder="Place Suggestion Here :D"
                    value={suggestion}
                    onChange={handleChange}
                />
                <button type="submit" className="suggestion-button">Send</button>
            </form>
        </div>
    );
};

export default SuggestionBox;