import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Pagination from '../reusable/Pagination'; // Adjust the import path as necessary
import styles from '../../../css/styles/admin/FeatureListPanel.module.css';

const FeatureListPanel = ({ features, loading, totalFeatures, itemsPerPage, currentPage, setCurrentPage, refreshFeatures, selectedFeature, setSelectedFeature }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedFeature, setEditedFeature] = useState({ title: '', status: '' });

  // Image viewer modal state
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFeatureClick = (feature) => {
    setSelectedFeature(selectedFeature?.id === feature.id ? null : feature);
  };

  const openConfirmModal = (feature) => {
    setFeatureToDelete(feature);
    setIsConfirmOpen(true);
  };

  const openEditModal = (feature) => {
    setEditedFeature({
        id: feature.id,  // Store the ID in the editedFeature state
        title: feature.title, 
        status: feature.status 
    });
    setIsEditOpen(true);
  };

  const openImageModal = (feature) => {
    setImageUrl(`http://localhost:8000${feature.content}`); // Correctly set the image URL
    setIsImageOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/features/${featureToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Feature deleted successfully');
        refreshFeatures(); // Refresh the features list
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
            refreshFeatures(); // Refresh the features list
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
        <div className={styles['features-list']}>
          {features.map((feature) => (
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
                <button className={styles['action-button']} title="View" onClick={() => openImageModal(feature)}>
                  <Eye size={16} />
                </button>
                <button className={styles['action-button']} title="Edit" onClick={() => { openEditModal(feature); setSelectedFeature(feature); }}>
                  <Edit2 size={16} />
                </button>
                <button className={`${styles['action-button']} ${styles['delete']}`} title="Delete" onClick={() => openConfirmModal(feature)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination 
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalFeatures}
        itemsPerPage={itemsPerPage}
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