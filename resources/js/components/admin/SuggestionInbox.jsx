import React, { useEffect, useState } from 'react';
import { Filter, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../../css/styles/admin/SuggestionInbox.module.css';
import SuggestionDetailModal from './SuggestionDetailModal';
import axios from 'axios';

const SuggestionInbox = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      let url = `/api/paginated/suggestions?page=${page}&per_page=${perPage}`;
      if (filters.division) url += `&division=${encodeURIComponent(filters.division)}`;
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
      
      const response = await axios.get(url);
  
      // Log the response to debug
      console.log('API Response:', response.data);
  
      // Ensure the response structure is valid
      if (response.data && response.data.data) {
        setSuggestions(response.data.data);
        
        // Update pagination based on the nested pagination object
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.last_page);
          setTotalItems(response.data.pagination.total);
        }
      } else {
        console.error('Unexpected response structure:', response.data);
        setSuggestions([]);
        setTotalItems(0);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setTotalItems(0);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch suggestions with current filters and pagination
        await fetchSuggestions({
          division: selectedDivision,
          status: selectedStatus
        }, currentPage);
        
        // Fetch divisions (only once)
        if (!initialDataLoaded) {
          const divisionsResponse = await axios.get('/api/divisions');
          setDivisions(divisionsResponse.data);
        }
        
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setInitialDataLoaded(true);
      }
    };
  
    fetchData();
  }, [refreshTrigger, currentPage, perPage, selectedDivision, selectedStatus]); // Include filter states

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
        status: selectedStatus
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
      status: selectedStatus
    }, 1);
  };

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
    // Again, no need to call fetchSuggestions manually
  };

  // Built-in pagination component renderer
  const renderPagination = () => {
    if (!initialDataLoaded || !totalItems) return null;
  
    const startItem = totalItems > 0 ? (currentPage - 1) * perPage + 1 : 0;
    const endItem = Math.min(currentPage * perPage, totalItems);
  
    return (
      <div className={styles['pagination']}>
        <div className={styles['pagination-info']}>
          <p>
            Showing {startItem} - {endItem} of {totalItems} suggestions
          </p>
        </div>
        <div className={styles['pagination-buttons']}>
          <button
            className={styles['pagination-button']}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || !initialDataLoaded}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            className={styles['pagination-button']}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || !initialDataLoaded}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles['suggestion-inbox']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <h2 className="text-2xl font-bold">Suggestion Inbox</h2>
        </div>
        
        <div className={styles['panel-content']}>
          {/* Filters */}
          <div className={styles['filters-container']}>
            <div className={styles['filters']}>
            
<select 
  className={styles['filter-dropdown']}
  value={selectedDivision}
  onChange={(e) => setSelectedDivision(e.target.value)}
>
  <option value="">All Divisions</option>
  {divisions.map((division) => (
    <option key={division.id} value={division.code}>
      {division.code} - {division.name}
    </option>
  ))}
</select>

              <select 
                className={styles['filter-dropdown']}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="In Consideration">In Consideration</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
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
          
          {/* Embedded Pagination - using the renderPagination function */}
          {renderPagination()}
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