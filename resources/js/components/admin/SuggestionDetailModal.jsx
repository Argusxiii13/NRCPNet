import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import '../../../css/styles/admin/SuggestionDetailModal.css';

const SuggestionDetailModal = ({ isOpen, onClose, suggestion }) => {
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

  if (!isOpen || !suggestion) return null;

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
              <div className="info-label">Submitted:</div>
              <div className="info-value">{suggestion.time}</div>
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
              <select className="status-dropdown">
                <option value="new">New</option>
                <option value="in-progress">In Consideration</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            
            <div className="info-row">
              <div className="info-label">Assigned To:</div>
              <select className="assignee-dropdown">
                <option value="">Select Assignee</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="alex-johnson">Alex Johnson</option>
              </select>
            </div>
          </div>
          
          <div className="form-section-title">Admin Notes</div>
          <textarea 
            className="admin-notes" 
            placeholder="Add internal notes about this suggestion..."
            rows={4}
          ></textarea>
          
          <div className="modal-footer">
            <button className="modal-button cancel" onClick={onClose}>
              Close
            </button>
            <button className="modal-button submit">
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