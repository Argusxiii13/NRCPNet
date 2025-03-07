import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Pagination from '../reusable/Pagination'; // Adjust the import path as necessary
import '../../../css/styles/admin/FeatureListPanel.css';

const FeatureListPanel = ({ features, loading, totalFeatures, itemsPerPage, currentPage, setCurrentPage, refreshFeatures }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedFeature, setEditedFeature] = useState({ title: '', status: '' });

  // Image viewer modal state
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFeatureClick = (feature) => {
    if (selectedFeature?.id === feature.id) {
      setSelectedFeature(null); // Deselect if already selected
    } else {
      setSelectedFeature(feature);
    }
  };

  const openConfirmModal = (feature) => {
    setFeatureToDelete(feature);
    setIsConfirmOpen(true);
  };

  const openEditModal = (feature) => {
    setEditedFeature({ title: feature.title, status: feature.status });
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
    console.log('Submitting edited feature:', editedFeature); // Log the data being sent
    try {
      const response = await fetch(`/api/features/${selectedFeature.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedFeature),
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
      setEditedFeature({ title: '', status: '' });
      setSelectedFeature(null);
    }
  };

  return (
    <div className="panel features-list-panel">
      <div className="panel-header">
        <h2 className="text-2xl font-bold">Features</h2>
      </div>
      <div className="panel-Feature">
        <div className="features-list">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-item ${selectedFeature?.id === feature.id ? 'selected' : ''}`}
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="feature-info">
                <h3 className="feature-title">{feature.title}</h3>
                <span className={`feature-status ${feature.status}`}>
                  {feature.status}
                </span>
              </div>
              <div className="feature-meta">
                <span className="feature-division">{feature.author}</span>
                <span className="feature-section">{feature.content}</span>
              </div>
              <div className="feature-actions">
                <button className="action-button" title="View" onClick={() => openImageModal(feature)}>
                  <Eye size={16} />
                </button>
                <button className="action-button" title="Edit" onClick={() => openEditModal(feature)}>
                  <Edit2 size={16} />
                </button>
                <button className="action-button delete" title="Delete" onClick={() => openConfirmModal(feature)}>
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
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Confirm Deletion</h4>
              <button className="close-button" onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this feature? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className="save-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Edit Feature</h4>
              <button className="close-button" onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <div className="modal-field">
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={editedFeature.title}
                  onChange={(e) => setEditedFeature({ ...editedFeature, title: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedFeature.status}
                  onChange={(e) => setEditedFeature({ ...editedFeature, status: e.target.value })}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className="save-button" onClick={handleEditSubmit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {isImageOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Image Viewer</h4>
              <button className="close-button" onClick={() => setIsImageOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <img src={imageUrl} alt="Feature" className="image-viewer" />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsImageOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureListPanel;