import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../../../css/styles/admin/SuggestionDetailModal.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Suggestion Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="form-section-title">Suggestion Information</div>
          
          <div className="suggestion-info">
            <div className="info-row">
              <div className="info-label">Division:</div>
              <div className="info-value">{suggestion.division}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Section:</div>
              <div className="info-value">{suggestion.section}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Date Created:</div>
              <div className="info-value">
                {new Date(suggestion.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="form-section-title">Suggestion Content</div>
          <div className="suggestion-content-box">
            {suggestion.content}
          </div>
          
          <div className="form-section-title">Actions</div>
          <div className="suggestion-actions">
            <div className="info-row">
              <div className="info-label">Status:</div>
              <select 
                className="status-dropdown"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="in-consideration">In Consideration</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
          
          <div className="form-section-title">Admin Notes</div>
          <textarea 
            className="admin-notes" 
            placeholder="Add internal notes about this suggestion..."
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          ></textarea>
          
          <div className="modal-footer">
            <button className="modal-button cancel" onClick={onClose}>
              Close
            </button>
            <button className="modal-button submit" onClick={handleSaveChanges}>
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