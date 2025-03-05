import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, X, Check, SquarePen, Trash } from 'lucide-react'; 
import '../../../css/styles/admin/RoleManagement.css';
import RoleModal from './RoleModal.jsx';

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      const rolesWithPermissions = response.data.map(role => ({
        ...role,
        permissions: typeof role.permissions === 'string' 
          ? JSON.parse(role.permissions) 
          : role.permissions
      }));
      setRoles(rolesWithPermissions);
      console.log('Fetched roles:', response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

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

  const handleDeleteRole = (id) => {
    setRoleToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/roles/${roleToDelete}`); // Adjust the URL according to your API
      await fetchRoles(); // Refetch roles after deletion
      setIsConfirmOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleSaveRole = async (roleData) => {
    try {
      if (roleData.id) {
        const response = await axios.put(`/api/roles/${roleData.id}`, roleData); // Update existing role
        setRoles(roles.map(role => role.id === roleData.id ? response.data : role));
      } else {
        const response = await axios.post('/api/roles', roleData); // Add new role
        setRoles([...roles, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving role:', error);
    }
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
          {/* Search Box */}
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
                      onClick={() => handleOpenModal(role)} // Open the modal for editing
                    >
                      <SquarePen size={18} />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteRole(role.id)} // Open confirmation modal
                    >
                      <Trash size={18} />
                    </button>
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

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Confirm Deletion</h4>
              <button className="close-button" onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this role? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className="save-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;