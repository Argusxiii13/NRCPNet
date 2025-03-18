import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../../css/styles/admin/SuggestionInbox.module.css';
import SuggestionDetailModal from './SuggestionDetailModal';
import axios from 'axios';

const SuggestionInbox = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Function to fetch suggestions with optional filters and pagination
  const fetchSuggestions = async (filters = {}, page = 1) => {
    try {
      let url = `/api/suggestion?page=${page}&per_page=${perPage}`;
      if (filters.division) url += `&division=${encodeURIComponent(filters.division)}`;
      if (filters.section) url += `&section=${encodeURIComponent(filters.section)}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      
      const response = await axios.get(url);
      
      // Use data returned from Laravel pagination
      setSuggestions(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setTotalItems(response.data.total);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch suggestions with pagination
        const suggestionData = await fetchSuggestions({}, currentPage);
        
        // Fetch divisions with their sections
        const divisionsResponse = await axios.get('/api/divisions');
        setDivisions(divisionsResponse.data);
        
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // If divisions API fails, extract divisions from suggestions
        if (suggestionData && suggestionData.length > 0) {
          const uniqueDivisions = getUniqueDivisionsFromSuggestions(suggestionData);
          setDivisions(uniqueDivisions);
        }
        
        setInitialDataLoaded(true);
      }
    };

    fetchData();
  }, [refreshTrigger, currentPage, perPage]); // Add pagination dependencies

  // Get unique divisions from suggestions
  const getUniqueDivisionsFromSuggestions = (suggestionData) => {
    const uniqueDivisionNames = [...new Set(suggestionData.map(s => s.division))];
    return uniqueDivisionNames.map(name => ({
      name,
      id: name, // Using name as ID for simplicity
      code: name.substring(0, 3).toUpperCase(),
      has_sections: true
    }));
  };

  // Get unique sections for a division from suggestions
  const getUniqueSectionsForDivision = (suggestionData, divisionName) => {
    const relevantSuggestions = suggestionData.filter(s => s.division === divisionName);
    const uniqueSectionNames = [...new Set(relevantSuggestions
      .map(s => s.section)
      .filter(s => s && s.trim() !== '')
    )];
    
    return uniqueSectionNames.map(name => ({
      name,
      id: name // Using name as ID for simplicity
    }));
  };

  // Update available sections when division changes
  useEffect(() => {
    if (!selectedDivision || !initialDataLoaded) return;
    
    // Find selected division in our data
    const selectedDivisionData = divisions.find(div => div.name === selectedDivision);
    
    if (selectedDivisionData) {
      // If we have sections from the API
      if (selectedDivisionData.sections && selectedDivisionData.sections.length > 0) {
        setSections(selectedDivisionData.sections);
      } 
      // Otherwise try to extract from suggestions
      else if (suggestions.length > 0) {
        const extractedSections = getUniqueSectionsForDivision(suggestions, selectedDivision);
        setSections(extractedSections);
      }
      else {
        setSections([]);
      }
    } else {
      setSections([]);
    }
    
    // Reset selected section when division changes
    setSelectedSection('');
  }, [selectedDivision, initialDataLoaded, suggestions]);

  // Handler for modal opening
  const handleOpenModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  // Handler for modal closing with refresh support
  const handleCloseModal = (refreshNeeded = false) => {
    setIsModalOpen(false);
    
    // If changes were made, refresh the suggestions list
    if (refreshNeeded) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Handler for suggestion deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/suggestion/${id}`);
      // Refresh the current page after deletion
      await fetchSuggestions({
        division: selectedDivision,
        section: selectedSection,
        search: searchTerm
      }, currentPage);
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  // Handler for filtering
  const handleFilter = async () => {
    // Reset to page 1 when applying new filters
    setCurrentPage(1);
    await fetchSuggestions({
      division: selectedDivision,
      section: selectedSection,
      search: searchTerm
    }, 1);
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search filter when search term changes (with debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (initialDataLoaded) {
        // Reset to page 1 when search term changes
        setCurrentPage(1);
        fetchSuggestions({
          division: selectedDivision,
          section: selectedSection,
          search: searchTerm
        }, 1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initialDataLoaded]);

  // Handle pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Handle per page selection change
  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className={styles['suggestion-inbox']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <h2 className="text-2xl font-bold">Suggestion Inbox</h2>
        </div>
        
        <div className={styles['panel-content']}>
          {/* Filters and Search */}
          <div className={styles['filters-container']}>
            <div className={styles['search-box']}>
              <Search size={20} className={styles['search-icon']} />
              <input 
                type="text" 
                placeholder="Search suggestions..." 
                className={styles['search-input']}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className={styles['filters']}>
              <select 
                className={styles['filter-dropdown']}
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">All Divisions</option>
                {divisions.map((division) => (
                  <option key={division.id || division.name} value={division.name}>
                    {division.name}
                  </option>
                ))}
              </select>

              <select 
                className={styles['filter-dropdown']}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedDivision}
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section.id || section.name} value={section.name}>
                    {section.name}
                  </option>
                ))}
              </select>

              <button className={styles['filter-button']} onClick={handleFilter}>
                <Filter size={20} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          <div className={styles['suggestions-list']}>
            {suggestions.length === 0 ? (
              <div className={styles['no-suggestions']}>No suggestions found</div>
            ) : (
              suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className={styles['suggestion-card']}
                  onClick={() => handleOpenModal(suggestion)}
                >
                  <div className={styles['suggestion-header']}>
                    <div className={styles['suggestion-meta']}>
                      <span className={styles['division-badge']}>
                        {suggestion.division}
                      </span>
                      {suggestion.section && (
                        <span className={styles['section-badge']}>
                          {suggestion.section}
                        </span>
                      )}
                      <span className={styles['time-stamp']}>
                        {new Date(suggestion.created_at).toLocaleString()}
                      </span>
                      {suggestion.status && (
                        <span className={`${styles['status-badge']} ${styles[`status-${suggestion.status.toLowerCase()}`]}`}>
                          {suggestion.status}
                        </span>
                      )}
                    </div>
                    <button 
                      className={styles['delete-button']}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the modal
                        handleDelete(suggestion.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className={styles['suggestion-content']}>
                    {suggestion.content.length > 100 
                      ? suggestion.content.substring(0, 100) + '...' 
                      : suggestion.content}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination Controls */}
          {suggestions.length > 0 && (
            <div className={styles['pagination']}>
              <div className={styles['pagination-info']}>
                <p>
                  {initialDataLoaded ? 
                    `Showing ${suggestions.length > 0 ? (currentPage - 1) * perPage + 1 : 0}-${Math.min(currentPage * perPage, totalItems)} of ${totalItems} suggestions` :
                    'Loading...'
                  }
                </p>
              </div>
              <div className={styles['pagination-buttons']}>
                <button
                  className={styles['filter-button']}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || !initialDataLoaded}
                >
                  Previous
                </button>
                <button
                  className={styles['filter-button']}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * perPage >= totalItems || !initialDataLoaded}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion Detail Modal */}
      <SuggestionDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        suggestion={selectedSuggestion}
        onSave={() => handleCloseModal(true)} // Pass refreshNeeded=true when saved
      />
    </div>
  );
};

export default SuggestionInbox;