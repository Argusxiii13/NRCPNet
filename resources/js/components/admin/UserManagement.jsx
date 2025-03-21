import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Edit2, Trash2, Plus } from 'lucide-react';
import { debounce } from 'lodash';
import AddUserModal from './AddUserModal';
import UserEditModal from './UserEditModal';
import LoadingIndicator from './LoadingIndicator';
import styles from '../../../css/styles/admin/UserManagement.module.css';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const itemsPerPage = 8;

  const debouncedFetch = useCallback(
    debounce((term, page, div, sec) => {
      fetchUsers(term, page, div, sec);
    }, 300),
    []
  );

  const fetchUsers = async (term, page, div, sec) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (term) queryParams.append('search', term);
      if (page) queryParams.append('page', page);
      if (div) queryParams.append('division', div);
      if (sec) queryParams.append('section', sec);
      queryParams.append('per_page', itemsPerPage);
      
      const response = await fetch(`/api/users?${queryParams}`);
      const data = await response.json();
      
      setUsers(data.data || []);
      setTotalUsers(data.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debouncedFetch(searchTerm, currentPage, division, section);
  }, [searchTerm, currentPage, division, section, debouncedFetch]);

  // Always create placeholders even during loading
  const placeholderRows = Array(itemsPerPage - (loading ? 0 : users.length))
    .fill(null)
    .map((_, index) => ({ id: `placeholder-${index}` }));

  const allRows = loading ? placeholderRows : [...users, ...placeholderRows].slice(0, itemsPerPage);

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      const transformedData = {
        first_name: userData.firstName,
        middle_name: userData.middleName || null,
        surname: userData.lastName,
        email: userData.email,
        position: userData.position,
        section: userData.section,
        division: userData.division,
        status: userData.status,
        role: userData.role,
        password: userData.password,
        password_confirmation: userData.password
      };
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Server returned non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Check server logs.');
      }
      
      const data = await response.json();
      
      if (response.ok) {
        fetchUsers(searchTerm, currentPage, division, section);
        console.log('User added successfully!');
      } else {
        console.error('Failed to add user:', data.message || 'Unknown error');
        if (data.errors) {
          console.error('Validation errors:', data.errors);
        }
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user: ' + error.message);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const transformedData = {
        first_name: userData.firstName,
        middle_name: userData.middleName || null,
        surname: userData.lastName,
        email: userData.email,
        position: userData.position,
        section: userData.section,
        division: userData.division,
        status: userData.status,
        role: userData.role,
      };

      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Server returned non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Check server logs.');
      }
      
      const data = await response.json();
      
      if (response.ok) {
        fetchUsers(searchTerm, currentPage, division, section);
        console.log('User updated successfully!');
      } else {
        console.error('Failed to update user:', data.message || 'Unknown error');
        if (data.errors) {
          console.error('Validation errors:', data.errors);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  const handleViewActivity = (userId) => {
    console.log('View activity for user:', userId);
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchUsers(searchTerm, currentPage, division, section);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    setCurrentPage(1);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    fetchUsers(searchTerm, 1, division, section);
    setCurrentPage(1);
  };

  return (
    <div className={styles['user-management']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <div className={styles['header-content']}>
            <h2>User Management</h2>
          </div>
        </div>
        
        <div className={styles['panel-content']}>
          <div className={styles['um-filters-container']}>
            <div className={styles['um-search-wrapper']}>
              <div className={styles['um-search-box']}>
                <Search className={styles['um-search-icon']} />
                <input
                  type="text"
                  placeholder="Search users..."
                  className={styles['um-search-input']}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <button className={styles['um-add-user-btn']} onClick={handleAddUser}>
                <Plus size={16} />
                Add New User
              </button>
            </div>
            
            <div className={styles['filters']}>
              <select 
                className={styles['filter-dropdown']}
                value={division}
                onChange={handleDivisionChange}
              >
                <option value="">Filter by Division</option>
                <option value="technology">Technology</option>
                <option value="hr">Human Resources</option>
              </select>
              
              <select 
                className={styles['filter-dropdown']}
                value={section}
                onChange={handleSectionChange}
              >
                <option value="">Filter by Section</option>
                <option value="it">IT</option>
                <option value="development">Development</option>
              </select>
              
              <button className={styles['filter-button']} onClick={handleApplyFilters}>
                <Search size={16} />
                Apply Filters
              </button>
            </div>
          </div>

          <div className={styles['table-container']}>
            {/* Table is always rendered, with a position relative for the overlay */}
            <div className={styles['table-wrapper']} style={{ position: 'relative' }}>
              {loading && (
                <div className={styles['loading-overlay']}>
                  <LoadingIndicator />
                </div>
              )}
              <table className={styles['user-table']}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Position</th>
                    <th>Email Address</th>
                    <th>Section</th>
                    <th>Division</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((user) => (
                    <tr key={user.id} className={user.id?.toString().includes('placeholder') ? styles['placeholder-row'] : ''}>
                      {!user.id?.toString().includes('placeholder') ? (
                        <>
                          <td>{user.first_name || ''} {user.middle_name || ''} {user.surname || ''}</td>
                          <td>{user.position || ''}</td>
                          <td>{user.email || ''}</td>
                          <td>
                            <span className={styles['section-badge']}>{user.section || ''}</span>
                          </td>
                          <td>
                            <span className={styles['division-badge']}>{user.division || ''}</span>
                          </td>
                          <td>
                            <span className={`${styles['status-badge']} ${styles[(user.status || '').toLowerCase()]}`}>
                              {user.status || ''}
                            </span>
                          </td>
                          <td className={styles['time-stamp']}>{user.last_login || ''}</td>
                          <td>{user.role || ''}</td>
                          <td>
                            <div className={styles['action-buttons']}>
                              <button 
                                className={`${styles['icon-button']} ${styles['view']}`}
                                onClick={() => handleViewActivity(user.id)}
                                title="View Activity Logs"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                className={`${styles['icon-button']} ${styles['edit']}`}
                                onClick={() => handleEdit(user.id)}
                                title="Edit User"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                className={`${styles['icon-button']} ${styles['delete']}`}
                                onClick={() => handleDelete(user.id)}
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <td colSpan={9}></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
{/* Embedded Pagination with same structure as Pagination component */}
<div className={styles['pagination']}>
  <div className={styles['pagination-info']}>
    <p>
      {loading ? 'Loading...' :
        `Showing ${totalUsers > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalUsers)} of ${totalUsers} users`
      }
    </p>
  </div>
  <div className={styles['pagination-buttons']}>
    <button
      className={styles['filter-button']}
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1 || loading}
    >
      Previous
    </button>
    <button
      className={styles['filter-button']}
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage * itemsPerPage >= totalUsers || loading}
    >
      Next
    </button>
  </div>
</div>
        </div>
      </div>
      
      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveUser}
      />
      
      {/* Edit User Modal */}
      <UserEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleUpdateUser}
        userData={selectedUser}
      />
    </div>
  );
};

export default UserManagement;