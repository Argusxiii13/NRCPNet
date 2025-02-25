import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, Plus } from 'lucide-react';
import '../../../css/styles/admin/UserManagement.css';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data - replace with your actual data fetching logic
  const sampleUsers = Array(5).fill(null).map((_, index) => ({
    id: index + 1,
    fullname: `User ${index + 1}`,
    position: 'Staff',
    email: `user${index + 1}@example.com`,
    section: 'IT',
    division: 'Technology',
    status: 'Active',
    lastLogin: '2024-02-24 10:00',
    role: 'User'
  }));

  // Create placeholder rows when data is less than itemsPerPage
  const placeholderRows = Array(itemsPerPage - sampleUsers.length)
    .fill(null)
    .map((_, index) => ({ id: `placeholder-${index}` }));

  const allRows = [...sampleUsers, ...placeholderRows];

  const handleAddUser = () => {
    console.log('Add new user');
  };

  const handleViewActivity = (userId) => {
    console.log('View activity for user:', userId);
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="user-management">
      <div className="panel">
        <div className="panel-header">
          <div className="header-content">
            <h2>User Management</h2>
          </div>
        </div>
        
        <div className="panel-content">
          <div className="um-filters-container">
            <div className="um-search-wrapper">
              <div className="um-search-box">
                <Search className="um-search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="um-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="um-add-user-btn" onClick={handleAddUser}>
                <Plus size={16} />
                Add New User
              </button>
            </div>
            
            <div className="filters">
              <select className="filter-dropdown">
                <option value="">Filter by Division</option>
                <option value="technology">Technology</option>
                <option value="hr">Human Resources</option>
              </select>
              
              <select className="filter-dropdown">
                <option value="">Filter by Section</option>
                <option value="it">IT</option>
                <option value="development">Development</option>
              </select>
              
              <button className="filter-button">
                <Search size={16} />
                Apply Filters
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="user-table">
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
                  <tr key={user.id} className={!user.fullname ? 'placeholder-row' : ''}>
                    {user.fullname ? (
                      <>
                        <td>{user.fullname}</td>
                        <td>{user.position}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="section-badge">{user.section}</span>
                        </td>
                        <td>
                          <span className="division-badge">{user.division}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="time-stamp">{user.lastLogin}</td>
                        <td>{user.role}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="icon-button view"
                              onClick={() => handleViewActivity(user.id)}
                              title="View Activity Logs"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="icon-button edit"
                              onClick={() => handleEdit(user.id)}
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="icon-button delete"
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
          
          <div className="pagination">
            <div className="pagination-info">
              <p>Showing {sampleUsers.length} of {sampleUsers.length} users</p>
            </div>
            <div className="pagination-buttons">
              <button
                className="filter-button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="filter-button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={sampleUsers.length < itemsPerPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;