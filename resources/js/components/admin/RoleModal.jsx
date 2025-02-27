import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const RoleModal = ({ isOpen, onClose, role, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    permissions: {
      users: { create: false, read: false, update: false, delete: false },
      divisions: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: false, update: false, delete: false }
    }
  });

  // Initialize form data when editing existing role
  useEffect(() => {
    if (role) {
      setFormData({ ...role });
    } else {
      // Reset form for new role
      setFormData({
        id: null,
        name: '',
        description: '',
        permissions: {
          users: { create: false, read: false, update: false, delete: false },
          divisions: { create: false, read: false, update: false, delete: false },
          roles: { create: false, read: false, update: false, delete: false },
          reports: { create: false, read: false, update: false, delete: false }
        }
      });
    }
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePermissionChange = (module, action, value) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [action]: value
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{role ? 'Edit Role' : 'Add New Role'}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {/* Basic Role Information */}
            <div className="form-group">
              <label htmlFor="name">Role Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={role && role.name === 'Superadmin'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>
            
            {/* Permissions Table */}
            <div className="form-group">
              <label>Access Permissions</label>
              <div className="permissions-form-table">
                <table>
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Create</th>
                      <th>Read</th>
                      <th>Update</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(formData.permissions).map(([module, permissions]) => (
                      <tr key={module}>
                        <td className="module-name">{module.charAt(0).toUpperCase() + module.slice(1)}</td>
                        {Object.entries(permissions).map(([action, value]) => (
                          <td key={action} className="permission-checkbox-cell">
                            <input
                              type="checkbox"
                              id={`${module}-${action}`}
                              checked={value}
                              onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                              disabled={role && role.name === 'Superadmin'}
                              className="form-checkbox"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              {role ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;