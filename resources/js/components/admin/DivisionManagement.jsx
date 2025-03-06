import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import '../../../css/styles/admin/DivisionManagement.css';
import DivisionModal from '../admin/DivisionModal';
import LoadingIndicator from './LoadingIndicator'; // Import the LoadingIndicator
import axios from 'axios';

const DivisionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [divisionToDelete, setDivisionToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchDivisions = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoading(false); // End loading regardless of outcome
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const handleOpenModal = (division = null) => {
    setCurrentDivision(division);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDivision(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDivisions = divisions.filter(division => 
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDivision = (id) => {
    setDivisionToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true); // Start loading for delete operation
    try {
      await axios.delete(`/api/divisions/${divisionToDelete}`);
      await fetchDivisions(); // Refetch divisions after deletion
      setIsConfirmOpen(false);
      setDivisionToDelete(null);
    } catch (error) {
      console.error('Error deleting division:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to refresh divisions can be passed to the modal
  const handleDivisionUpdate = async () => {
    await fetchDivisions(); // Refetch divisions after addition or update
  };

  return (
    <div className="division-management">
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Division Management</h2>
          <button 
            className="add-button"
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            <Plus size={18} />
            <span>Add Division</span>
          </button>
        </div>
        
        <div className="panel-content">
          <div className="filters-container">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search divisions..." 
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
                disabled={loading}
              />
            </div>
          </div>

          <div className="divisions-list-container" style={{ position: 'relative' }}>
            {loading && (
              <div className="loading-overlay">
                <LoadingIndicator />
              </div>
            )}
            <div className="divisions-list">
              {filteredDivisions.length > 0 ? (
                filteredDivisions.map((division) => (
                  <div key={division.id} className="division-card">
                    <div className="division-header">
                      <div className="division-title">
                        <span className="division-code">{division.code}</span>
                        <h3 className="division-name">{division.name}</h3>
                      </div>
                      <div className="division-actions">
                        <button 
                          className="edit-button"
                          onClick={() => handleOpenModal(division)}
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteDivision(division.id)}
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {division.has_sections && division.sections && division.sections.length > 0 ? (
                      <div className="sections-container">
                        <h4 className="sections-title">Sections</h4>
                        <div className="sections-list">
                          {division.sections.map((section) => (
                            <div key={section.id} className="section-item">
                              <span className="section-name">{section.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : !loading ? (
                <div className="empty-state">
                  <p>No divisions found</p>
                </div>
              ) : (
                // Show placeholder cards during loading
                Array(3).fill(null).map((_, index) => (
                  <div key={`placeholder-${index}`} className="division-card placeholder-card">
                    <div className="division-header placeholder-header">
                      <div className="division-title">
                        <span className="division-code placeholder-text"></span>
                        <h3 className="division-name placeholder-text"></h3>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Division Modal */}
      <DivisionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        division={currentDivision}
        onDivisionUpdated={handleDivisionUpdate} // Pass the update function
      />

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Confirm Deletion</h4>
              <button className="close-button" onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this division? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className="save-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionManagement;