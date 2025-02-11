import React, { useState } from 'react';
import '../../../css/styles/landing/SuggestionBox.css';

const SuggestionBox = () => {
    const [suggestion, setSuggestion] = useState('');

    const handleChange = (e) => {
        setSuggestion(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the suggestion submission logic here
        console.log('Suggestion submitted:', suggestion);
        setSuggestion(''); // Clear the input after submission
    };

    return (
        <div className="suggestion-container">
            <h3>Suggestion Box</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="suggestion-input"
                    placeholder="Be responsible with your words..."
                    value={suggestion}
                    onChange={handleChange}
                />
                <button type="submit" className="suggestion-button">Send</button>
            </form>
        </div>
    );
};

export default SuggestionBox;