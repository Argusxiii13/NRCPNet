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
    password: 'NRCPNETEmployee',  // Default password
    section: '',
    division: '',
    role: 'User',
    status: 'Active',  // Default status
  });

  const [divisions, setDivisions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDivisionCode, setSelectedDivisionCode] = useState('');

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDivisions();
      fetchRoles();
    }
  }, [isOpen]);

  const fetchDivisions = async () => {
    const response = await fetch('/api/divisions'); // Adjust endpoint as necessary
    const data = await response.json();
    setDivisions(data);
  };

  const fetchRoles = async () => {
    const response = await fetch('/api/roles'); // Adjust endpoint as necessary
    const data = await response.json();
  
    // Assuming data is an array of objects and each object has a 'name' property
    const filteredRoles = data.filter(role => role.name !== 'Superadmin');
  
    setRoles(filteredRoles);
  };

  const handleDivisionChange = (e) => {
    const divId = parseInt(e.target.value);
    const selectedDivision = divisions.find(div => div.id === divId);
    
    // Store the division code instead of the ID
    setSelectedDivisionCode(selectedDivision?.code || '');
    
    setFormData(prev => ({
      ...prev,
      division: selectedDivision?.code || '', // Use division code here
      section: '', // Reset section when division changes
    }));
    
    setSections(selectedDivision?.has_sections ? selectedDivision.sections : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      fullname: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
    };
    onSave(userData);
    onClose();
  };

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
          {/* Personal Information Section */}
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
          
          {/* Department Information Section */}
          <div className="form-section-title">Department Information</div>
          <div className="form-row">
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="division">Division</label>
                <select
                  id="division"
                  name="division"
                  value={divisions.find(div => div.code === formData.division)?.id || ''}
                  onChange={handleDivisionChange}
                  required
                >
                  <option value="">Select Division</option>
                  {divisions.map(div => (
                    <option key={div.id} value={div.id}>{div.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group half-width">
              <div className="form-input-wrapper">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                  disabled={sections.length === 0} // Disable if no sections are available
                >
                  <option value="">Select Section</option>
                  {sections.map(sec => (
                    <option key={sec.name} value={sec.name}>{sec.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Account Settings Section */}
          <div className="form-section-title">Account Settings</div>
          <div className="form-row">
            <div className="form-group half-width">
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
            <div className="form-group half-width">
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

          {/* Role Dropdown */}
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
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
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