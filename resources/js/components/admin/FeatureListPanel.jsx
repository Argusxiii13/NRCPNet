import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import styles from '../../../css/styles/admin/FeatureListPanel.module.css';

const FeatureListPanel = ({ selectedFeature, setSelectedFeature }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedFeature, setEditedFeature] = useState({ title: '', status: '' });

  // Image viewer modal state
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Feature data and loading state
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Fixed items per page
  const [totalFeatures, setTotalFeatures] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Fetch features from the API with pagination
  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build the URL with pagination parameters only
      const url = new URL('/api/paginated/features', window.location.origin);
      url.searchParams.append('page', currentPage);
      url.searchParams.append('per_page', itemsPerPage);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set features from data.data (Laravel pagination format)
      setFeatures(data.data);
      
      // Set pagination information
      setTotalFeatures(data.total);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      
    } catch (error) {
      console.error('Error fetching features:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of features and when page changes
  useEffect(() => {
    fetchFeatures();
  }, [currentPage]);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(selectedFeature?.id === feature.id ? null : feature);
  };

  const openConfirmModal = (feature, e) => {
    e.stopPropagation(); // Prevent feature selection
    setFeatureToDelete(feature);
    setIsConfirmOpen(true);
  };

  const openEditModal = (feature, e) => {
    e.stopPropagation(); // Prevent feature selection
    setEditedFeature({
        id: feature.id,
        title: feature.title, 
        status: feature.status 
    });
    setIsEditOpen(true);
    setSelectedFeature(feature);
  };

  const openImageModal = (feature, e) => {
    e.stopPropagation(); // Prevent feature selection
    setImageUrl(`http://localhost:8000${feature.content}`);
    setIsImageOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/features/${featureToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Feature deleted successfully');
        fetchFeatures(); // Refresh the features list
      } else {
        console.error('Failed to delete feature');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
    } finally {
      setIsConfirmOpen(false);
      setFeatureToDelete(null);
    }
  };

  const handleEditSubmit = async () => {
    if (!editedFeature || !editedFeature.id) {
        console.error('No feature selected for editing.');
        return;
    }

    try {
        const response = await fetch(`/api/features/${editedFeature.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: editedFeature.title,
                status: editedFeature.status
            }),
        });
        if (response.ok) {
            console.log('Feature updated successfully');
            fetchFeatures(); // Refresh the features list
        } else {
            const errorData = await response.json();
            console.error('Failed to update feature:', errorData);
        }
    } catch (error) {
        console.error('Error updating feature:', error);
    } finally {
        setIsEditOpen(false);
        setEditedFeature({ id: null, title: '', status: '' });
    }
  };

  return (
    <div className={styles['panel'] + ' ' + styles['features-list-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Features</h2>
      </div>
      
      <div className={styles['panel-Feature']}>
        {error && (
          <div className={styles['error-message']}>
            <p>Error loading features: {error}</p>
          </div>
        )}
        <div className={styles['features-list']}>
          {features.length === 0 && !loading ? (
            <div className={styles['no-features']}>
              <p>No features found.</p>
            </div>
          ) : (
            features.map((feature) => (
              <div
                key={feature.id}
                className={`${styles['feature-item']} ${selectedFeature?.id === feature.id ? styles['selected'] : ''}`}
                onClick={() => handleFeatureClick(feature)}
              >
                <div className={styles['feature-info']}>
                  <h3 className={styles['feature-title']}>{feature.title}</h3>
                  <span className={`${styles['feature-status']} ${styles[feature.status]}`}>
                    {feature.status}
                  </span>
                </div>
                <div className={styles['feature-meta']}>
                  <span className={styles['feature-division']}>{feature.author}</span>
                  <span className={styles['feature-section']}>{feature.content}</span>
                </div>
                <div className={styles['feature-actions']}>
                  <button className={styles['action-button']} title="View" onClick={(e) => openImageModal(feature, e)}>
                    <Eye size={16} />
                  </button>
                  <button className={styles['action-button']} title="Edit" onClick={(e) => openEditModal(feature, e)}>
                    <Edit2 size={16} />
                  </button>
                  <button className={`${styles['action-button']} ${styles['delete']}`} title="Delete" onClick={(e) => openConfirmModal(feature, e)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className={styles['loading-indicator']}>
              <p>Loading features...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination controls */}
      <div className={styles['pagination']}>
        <div className={styles['pagination-info']}>
          <p>
            {loading ? 'Loading...' :
              `Showing ${totalFeatures > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalFeatures)} of ${totalFeatures} features`
            }
          </p>
        </div>
        <div className={styles['pagination-buttons']}>
          <button
            className={styles['filter-button']}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <button
            className={styles['filter-button']}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= lastPage || loading}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Confirm Deletion</h4>
              <button className={styles['close-button']} onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <p>Are you sure you want to delete this feature? This action cannot be undone.</p>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Edit Feature</h4>
              <button className={styles['close-button']} onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <div className={styles['modal-field']}>
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={editedFeature.title}
                  onChange={(e) => setEditedFeature({ ...editedFeature, title: e.target.value })}
                  className={styles['modal-input']}
                />
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedFeature.status}
                  onChange={(e) => setEditedFeature({ ...editedFeature, status: e.target.value })}
                  className={styles['modal-select']}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={handleEditSubmit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {isImageOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Image Viewer</h4>
              <button className={styles['close-button']} onClick={() => setIsImageOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <img src={imageUrl} alt="Feature" className={styles['image-viewer']} />
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsImageOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureListPanel;