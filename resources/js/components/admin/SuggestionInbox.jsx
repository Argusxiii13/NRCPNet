import React, { useState } from 'react';
import { Search, Filter, Trash2, ChevronDown } from 'lucide-react';
import '../../../css/styles/admin/SuggestionInbox.css';
import SuggestionDetailModal from './SuggestionDetailModal';

const SuggestionInbox = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data - replace with your actual data
  const divisions = {
    'Division 1': ['Section 1', 'Section 2'],
    'Division 2': ['Section 1', 'Section 2', 'Section 3'],
    'Division 3': ['Section 1', 'Section 2', 'Section 3', 'Section 4']
  };

  const [suggestions] = useState([
    {
      id: 1,
      division: 'Division 1',
      section: 'Section 1',
      time: '2024-02-21 09:30',
      content: 'We need more collaborative spaces in the office. The current layout makes it difficult for teams to work together effectively. Perhaps we could redesign some of the common areas to facilitate better team interactions.',
      status: 'new'
    },
    {
      id: 2,
      division: 'Division 2',
      section: 'Section 3',
      time: '2024-02-21 10:15',
      content: 'The current scheduling system could be more efficient. It often leads to double bookings and confusion about meeting room availability. We should consider implementing a more robust scheduling solution with automated notifications.',
      status: 'in-progress'
    },
    // Add more sample suggestions as needed
  ]);

  const handleOpenModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="suggestion-inbox">
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Suggestion Inbox</h2>
        </div>
        
        <div className="panel-content">
          {/* Filters and Search */}
          <div className="filters-container">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search suggestions..." 
                className="search-input"
              />
            </div>

            <div className="filters">
              <select 
                className="filter-dropdown"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">All Divisions</option>
                {Object.keys(divisions).map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>

              <select 
                className="filter-dropdown"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedDivision}
              >
                <option value="">All Sections</option>
                {selectedDivision && divisions[selectedDivision].map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>

              <button className="filter-button">
                <Filter size={20} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="suggestion-card"
                onClick={() => handleOpenModal(suggestion)}
              >
                <div className="suggestion-header">
                  <div className="suggestion-meta">
                    <span className="division-badge">{suggestion.division}</span>
                    <span className="section-badge">{suggestion.section}</span>
                    <span className="time-stamp">{suggestion.time}</span>
                    {suggestion.status && (
                      <span className={`status-badge status-${suggestion.status}`}>
                        {suggestion.status}
                      </span>
                    )}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the modal
                      // Handle delete logic here
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="suggestion-content">
                  {suggestion.content.length > 100 
                    ? suggestion.content.substring(0, 100) + '...' 
                    : suggestion.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestion Detail Modal */}
      <SuggestionDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        suggestion={selectedSuggestion}
      />
    </div>
  );
};

export default SuggestionInbox;