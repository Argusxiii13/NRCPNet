import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus, ChevronDown, Check, X } from 'lucide-react';
import '../../../css/styles/admin/RoleManagement.css';
import RoleModal from './RoleModal.jsx';

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - will be replaced with API calls
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Superadmin',
      description: 'Full system access with all permissions',
      permissions: {
        users: { create: true, read: true, update: true, delete: true },
        divisions: { create: true, read: true, update: true, delete: true },
        roles: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true }
      }
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with limited system configuration',
      permissions: {
        users: { create: true, read: true, update: true, delete: false },
        divisions: { create: true, read: true, update: true, delete: false },
        roles: { create: false, read: true, update: false, delete: false },
        reports: { create: true, read: true, update: true, delete: true }
      }
    },
    {
      id: 3,
      name: 'Contributor',
      description: 'Can create and modify content but cannot delete',
      permissions: {
        users: { create: false, read: true, update: false, delete: false },
        divisions: { create: false, read: true, update: false, delete: false },
        roles: { create: false, read: true, update: false, delete: false },
        reports: { create: true, read: true, update: true, delete: false }
      }
    },
    {
      id: 4,
      name: 'Visitor',
      description: 'Read-only access to system content',
      permissions: {
        users: { create: false, read: true, update: false, delete: false },
        divisions: { create: false, read: true, update: false, delete: false },
        roles: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false }
      }
    }
  ]);

  const handleOpenModal = (role = null) => {
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRole = (id, e) => {
    e.stopPropagation();
    // In production, this would be an API call
    setRoles(roles.filter(role => role.id !== id));
  };

  // For saving updated or new role data
  const handleSaveRole = (roleData) => {
    if (roleData.id) {
      // Update existing role
      setRoles(roles.map(role => role.id === roleData.id ? roleData : role));
    } else {
      // Add new role
      setRoles([...roles, { ...roleData, id: roles.length + 1 }]);
    }
    handleCloseModal();
  };

  return (
    <div className="role-management">
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Role Management</h2>
          <button 
            className="add-button"
            onClick={() => handleOpenModal()}
          >
            <Plus size={18} />
            <span>Add Role</span>
          </button>
        </div>
        
        <div className="panel-content">
          {/* Search and Filters */}
          <div className="filters-container">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search roles..." 
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Roles List */}
          <div className="roles-list">
            {filteredRoles.map((role) => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <div className="role-title">
                    <span className="role-badge">{role.name}</span>
                    <p className="role-description">{role.description}</p>
                  </div>
                  <div className="role-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleOpenModal(role)}
                    >
                      <Edit size={18} />
                    </button>
                    {role.name !== 'Superadmin' && (
                      <button 
                        className="delete-button"
                        onClick={(e) => handleDeleteRole(role.id, e)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="permissions-container">
                  <h4 className="permissions-title">Access Permissions</h4>
                  <div className="permissions-table">
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
                        {Object.entries(role.permissions).map(([module, permissions]) => (
                          <tr key={module}>
                            <td className="module-name">{module.charAt(0).toUpperCase() + module.slice(1)}</td>
                            <td className={`permission-cell ${permissions.create ? 'permitted' : 'denied'}`}>
                              {permissions.create ? <Check size={16} /> : <X size={16} />}
                            </td>
                            <td className={`permission-cell ${permissions.read ? 'permitted' : 'denied'}`}>
                              {permissions.read ? <Check size={16} /> : <X size={16} />}
                            </td>
                            <td className={`permission-cell ${permissions.update ? 'permitted' : 'denied'}`}>
                              {permissions.update ? <Check size={16} /> : <X size={16} />}
                            </td>
                            <td className={`permission-cell ${permissions.delete ? 'permitted' : 'denied'}`}>
                              {permissions.delete ? <Check size={16} /> : <X size={16} />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Modal */}
      <RoleModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        role={currentRole}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default RoleManagement;