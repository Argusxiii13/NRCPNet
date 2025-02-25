import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import '../../../css/styles/admin/AddUserModal.css';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    position: '',
    email: '',
    section: '',
    division: '',
    role: 'User',
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine the name fields to create a full name
    const userData = {
      ...formData,
      fullname: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`
    };
    onSave(userData);
    onClose();
  };

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

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name Fields Row */}
          <div className="form-section-title">Personal Information</div>
          <div className="form-row">
            <div className="form-group name-field">
              <div className="form-input-wrapper">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                />
              </div>
            </div>
            
            <div className="form-group name-field">
              <div className="form-input-wrapper">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />
              </div>
            </div>
            
            <div className="form-group name-field">
              <div className="form-input-wrapper">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <div className="form-input-wrapper">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Enter position"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-input-wrapper">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section-title">Department Information</div>
          <div className="form-row">
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="IT">IT</option>
                  <option value="Development">Development</option>
                  <option value="QA">QA</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
            
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="division">Division</label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Technology">Technology</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section-title">Account Settings</div>
          <div className="form-row">
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="modal-button cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-button submit">
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddUserModal;