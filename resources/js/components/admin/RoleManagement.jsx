import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, X, Check, SquarePen, Trash } from 'lucide-react'; 
import styles from '../../../css/styles/admin/RoleManagement.module.css';
import RoleModal from './RoleModal.jsx';
import LoadingIndicator from './LoadingIndicator';

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch roles from API
  const fetchRoles = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await axios.delete(`/api/roles/${roleToDelete}`);
      await fetchRoles();
      setIsConfirmOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error('Error deleting role:', error);
      setIsLoading(false);
    }
  };

  const handleSaveRole = async (roleData) => {
    setIsLoading(true);
    try {
      if (roleData.id) {
        const response = await axios.put(`/api/roles/${roleData.id}`, roleData);
        setRoles(roles.map(role => role.id === roleData.id ? response.data : role));
      } else {
        const response = await axios.post('/api/roles', roleData);
        setRoles([...roles, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder cards when loading
  const renderPlaceholderCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={`placeholder-${index}`} className={`${styles['role-card']} ${styles['placeholder-card']}`}>
        <div className={`${styles['role-header']} ${styles['placeholder-header']}`}>
          <div className={styles['role-title']}>
            <div className={`${styles['role-badge']} ${styles['placeholder-text']}`} style={{ width: '80px' }}></div>
            <div className={`${styles['role-description']} ${styles['placeholder-text']}`} style={{ width: '200px' }}></div>
          </div>
        </div>
        <div className={styles['permissions-container']}>
          <h4 className={styles['permissions-title']}>Access Permissions</h4>
          <div className={styles['permissions-table']}>
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
                {Array(3).fill(0).map((_, i) => (
                  <tr key={`placeholder-row-${i}`} className={styles['placeholder-row']}>
                    <td className={`${styles['module-name']} ${styles['placeholder-text']}`} style={{ width: '100px' }}></td>
                    <td className={styles['permission-cell']}></td>
                    <td className={styles['permission-cell']}></td>
                    <td className={styles['permission-cell']}></td>
                    <td className={styles['permission-cell']}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles['role-management']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <button 
            className={styles['add-button']}
            onClick={() => handleOpenModal()}
            disabled={isLoading}
          >
            <Plus size={18} />
            <span>Add Role</span>
          </button>
        </div>
        
        <div className={styles['panel-content']}>
          {/* Search Box */}
          <div className={styles['filters-container']}>
            <div className={styles['search-box']}>
              <Search size={20} className={styles['search-icon']} />
              <input 
                type="text" 
                placeholder="Search roles..." 
                className={styles['search-input']}
                value={searchTerm}
                onChange={handleSearch}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Roles List with relative positioning for overlay */}
          <div className={styles['roles-list-container']} style={{ position: 'relative', minHeight: '400px' }}>
            {isLoading && (
              <div className={styles['loading-overlay']}>
                <LoadingIndicator />
              </div>
            )}
            
            <div className={styles['roles-list']}>
              {isLoading ? (
                renderPlaceholderCards()
              ) : filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <div key={role.id} className={styles['role-card']}>
                    <div className={styles['role-header']}>
                      <div className={styles['role-title']}>
                        <span className={styles['role-badge']}>{role.name}</span>
                        <p className={styles['role-description']}>{role.description}</p>
                      </div>
                      <div className={styles['role-actions']}>
                        <button 
                          className={styles['edit-button']}
                          onClick={() => handleOpenModal(role)}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button 
                          className={styles['delete-button']}
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>

                    <div className={styles['permissions-container']}>
                      <h4 className={styles['permissions-title']}>Access Permissions</h4>
                      <div className={styles['permissions-table']}>
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
                                <td className={styles['module-name']}>{module.charAt(0).toUpperCase() + module.slice(1)}</td>
                                <td className={`${styles['permission-cell']} ${permissions.create ? styles['permitted'] : styles['denied']}`}>
                                  {permissions.create ? <Check size={16} /> : <X size={16} />}
                                </td>
                                <td className={`${styles['permission-cell']} ${permissions.read ? styles['permitted'] : styles['denied']}`}>
                                  {permissions.read ? <Check size={16} /> : <X size={16} />}
                                </td>
                                <td className={`${styles['permission-cell']} ${permissions.update ? styles['permitted'] : styles['denied']}`}>
                                  {permissions.update ? <Check size={16} /> : <X size={16} />}
                                </td>
                                <td className={`${styles['permission-cell']} ${permissions.delete ? styles['permitted'] : styles['denied']}`}>
                                  {permissions.delete ? <Check size={16} /> : <X size={16} />}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles['empty-state']}>
                  <p>No roles found. Try adjusting your search or add a new role.</p>
                </div>
              )}
            </div>
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
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Confirm Deletion</h4>
              <button className={styles['close-button']} onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <p>Are you sure you want to delete this role? This action cannot be undone.</p>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;