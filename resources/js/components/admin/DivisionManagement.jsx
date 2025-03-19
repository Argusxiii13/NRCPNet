import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import styles from '../../../css/styles/admin/DivisionManagement.module.css';
import DivisionModal from '../admin/DivisionModal';
import LoadingIndicator from './LoadingIndicator';
import axios from 'axios';

const DivisionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [divisionToDelete, setDivisionToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDivisions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await axios.delete(`/api/divisions/${divisionToDelete}`);
      await fetchDivisions();
      setIsConfirmOpen(false);
      setDivisionToDelete(null);
    } catch (error) {
      console.error('Error deleting division:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDivisionUpdate = async () => {
    await fetchDivisions();
  };

  return (
    <div className={styles['division-management']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <h2 className="text-2xl font-bold">Division Management</h2>
          <button 
            className={styles['add-button']}
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            <Plus size={18} />
            <span>Add Division</span>
          </button>
        </div>
        
        <div className={styles['panel-content']}>
          <div className={styles['filters-container']}>
            <div className={styles['search-box']}>
              <Search size={20} className={styles['search-icon']} />
              <input 
                type="text" 
                placeholder="Search divisions..." 
                className={styles['search-input']}
                value={searchTerm}
                onChange={handleSearch}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles['divisions-list-container']}>
            {loading && (
              <div className={styles['loading-overlay']}>
                <LoadingIndicator />
              </div>
            )}
            <div className={styles['divisions-list']}>
              {filteredDivisions.length > 0 ? (
                filteredDivisions.map((division) => (
                  <div key={division.id} className={styles['division-card']}>
                    <div className={styles['division-header']}>
                      <div className={styles['division-title']}>
                        <span className={styles['division-code']}>{division.code}</span>
                        <h3 className={styles['division-name']}>{division.name}</h3>
                      </div>
                      <div className={styles['division-actions']}>
                        <button 
                          className={styles['edit-button']}
                          onClick={() => handleOpenModal(division)}
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className={styles['delete-button']}
                          onClick={() => handleDeleteDivision(division.id)}
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {division.has_sections && division.sections && division.sections.length > 0 ? (
                      <div className={styles['sections-container']}>
                        <h4 className={styles['sections-title']}>Sections</h4>
                        <div className={styles['sections-list']}>
                          {division.sections.map((section) => (
                            <div key={section.id} className={styles['section-item']}>
                              <span className={styles['section-name']}>{section.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : !loading ? (
                <div className={styles['empty-state']}>
                  <p>No divisions found</p>
                </div>
              ) : (
                Array(3).fill(null).map((_, index) => (
                  <div key={`placeholder-${index}`} className={`${styles['division-card']} ${styles['placeholder-card']}`}>
                    <div className={`${styles['division-header']} ${styles['placeholder-header']}`}>
                      <div className={styles['division-title']}>
                        <span className={`${styles['division-code']} ${styles['placeholder-text']}`}></span>
                        <h3 className={`${styles['division-name']} ${styles['placeholder-text']}`}></h3>
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
        onDivisionUpdated={handleDivisionUpdate}
      />

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Confirm Deletion</h4>
              <button className={styles['close-button']} onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <p>Are you sure you want to delete this division? This action cannot be undone.</p>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionManagement;