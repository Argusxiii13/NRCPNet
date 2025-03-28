import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import styles from '../../../css/styles/admin/ResourceDetailModal.module.css';

const ResourceDetailModal = ({ isOpen, onClose, resourceItem, onSave }) => {
  const [editedResourceData, setEditedResourceData] = useState({});
  const [resourceStatus, setResourceStatus] = useState('Active');
  const [iconFileToUpload, setIconFileToUpload] = useState(null);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Update state when resourceItem changes
  useEffect(() => {
    if (resourceItem) {
      setEditedResourceData({
        id: resourceItem.id,
        name: resourceItem.name,
        link: resourceItem.link,
        icon: resourceItem.icon,
        description: resourceItem.description
      });
      setResourceStatus(resourceItem.status || 'Active');
    }
  }, [resourceItem]);

  if (!isOpen || !resourceItem) return null;

  const handleIconFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedResourceData({ 
          ...editedResourceData, 
          icon: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveResourceChanges = () => {
    // Prepare the full updated resource item object
    const updatedResourceItemData = {
      id: resourceItem.id,
      name: editedResourceData.name,
      link: editedResourceData.link,
      description: editedResourceData.description,
      status: resourceStatus,
      icon: editedResourceData.icon
    };
  
    // Call the onSave method from the parent component
    onSave(updatedResourceItemData, iconFileToUpload);
  };

  return ReactDOM.createPortal(
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <h2>Resource Details</h2>
          <button className={styles['modal-close-btn']} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles['modal-content']}>
          <div className={styles['form-section-title']}>Resource Information</div>
          
          <div className={styles['resource-info']}>
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Resource ID:</div>
              <div className={styles['info-value']}>{resourceItem.id}</div>
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Creation Date:</div>
              <div className={styles['info-value']}>
                {new Date(resourceItem.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className={styles['form-section-title']}>Resource Details</div>
          
          <div className={styles['resource-edit-section']}>
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Name:</div>
              <input
                type="text"
                className={styles['edit-input']}
                value={editedResourceData.name || ''}
                onChange={(e) => setEditedResourceData({
                  ...editedResourceData,
                  name: e.target.value
                })}
              />
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Description:</div>
              <textarea
                className={styles['edit-input']}
                value={editedResourceData.description || ''}
                onChange={(e) => setEditedResourceData({
                  ...editedResourceData,
                  description: e.target.value
                })}
              />
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>URL:</div>
              <input
                type="text"
                className={styles['edit-input']}
                value={editedResourceData.link || ''}
                onChange={(e) => setEditedResourceData({
                  ...editedResourceData,
                  link: e.target.value
                })}
              />
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Status:</div>
              <select 
                className={styles['status-dropdown']}
                value={resourceStatus}
                onChange={(e) => setResourceStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Icon:</div>
              <div className={styles['icon-upload-container']}>
                {editedResourceData.icon && (
                  <img 
                    src={editedResourceData.icon} 
                    alt="Resource Icon" 
                    className={styles['icon-preview']} 
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconFileUpload}
                  className={styles['file-input']}
                />
              </div>
            </div>
          </div>
          
          <div className={styles['modal-footer']}>
            <button 
              className={`${styles['modal-button']} ${styles['cancel']}`} 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              className={`${styles['modal-button']} ${styles['submit']}`} 
              onClick={handleSaveResourceChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResourceDetailModal;