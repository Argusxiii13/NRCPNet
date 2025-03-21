import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from '../../../css/styles/admin/SuggestionDetailModal.module.css';

const SuggestionDetailModal = ({ isOpen, onClose, suggestion, onSave }) => {
  // Use adminnote to match the database field name
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('new');

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

  // Update state when suggestion changes
  useEffect(() => {
    if (suggestion) {
      setAdminNotes(suggestion.adminnote || '');
      setStatus(suggestion.status || 'new');
    }
  }, [suggestion]);

  if (!isOpen || !suggestion) return null;

  const handleSaveChanges = async () => {
    try {
        const updatedSuggestion = {
            ...suggestion,
            adminnote: adminNotes,
            status: status,
        };

        const response = await axios.put(`http://localhost:8000/api/suggestion/${suggestion.id}`, updatedSuggestion);
        console.log('Suggestion updated successfully:', response.data);
        
        // Call onSave to trigger a refresh in the parent component
        if (onSave) {
          onSave();
        } else {
          onClose(); // Fallback to just closing if onSave isn't provided
        }
    } catch (error) {
        console.error('Error updating suggestion:', error);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <h2>Suggestion Details</h2>
          <button className={styles['modal-close-btn']} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles['modal-content']}>
          <div className={styles['form-section-title']}>Suggestion Information</div>
          
          <div className={styles['suggestion-info']}>
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Division:</div>
              <div className={styles['info-value']}>{suggestion.division}</div>
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Section:</div>
              <div className={styles['info-value']}>{suggestion.section}</div>
            </div>
            
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Date Created:</div>
              <div className={styles['info-value']}>
                {new Date(suggestion.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className={styles['form-section-title']}>Suggestion Content</div>
          <div className={styles['suggestion-content-box']}>
            {suggestion.content}
          </div>
          
          <div className={styles['form-section-title']}>Actions</div>
          <div className={styles['suggestion-actions']}>
            <div className={styles['info-row']}>
              <div className={styles['info-label']}>Status:</div>
              <select 
                className={styles['status-dropdown']}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="In Consideration">In Consideration</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>
            </div>
          </div>
          
          <div className={styles['form-section-title']}>Admin Notes</div>
          <textarea 
            className={styles['admin-notes']} 
            placeholder="Add internal notes about this suggestion..."
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          ></textarea>
          
          <div className={styles['modal-footer']}>
            <button className={`${styles['modal-button']} ${styles['cancel']}`} onClick={onClose}>
              Close
            </button>
            <button className={`${styles['modal-button']} ${styles['submit']}`} onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuggestionDetailModal;