import React, { useState } from 'react';
import styles from '../../../css/styles/admin/UserProfilePanel.module.css';
import { useAuth } from '../../hooks/useAuth';

const UserProfilePanel = () => {
  const { user, loading, logout } = useAuth();
  
  // Hardcoded session and activity data
  const sessionData = {
    last_login: '2025-04-26T14:30:22',
    created_at: '2024-08-15T09:45:32',
    updated_at: '2025-03-12T11:20:45'
  };
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordChangeStatus, setPasswordChangeStatus] = useState({
    isSubmitting: false,
    success: false,
    error: null
  });
  
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Reset form state when closing
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setPasswordChangeStatus({
      isSubmitting: false,
      success: false,
      error: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setPasswordChangeStatus({
      isSubmitting: true,
      success: false,
      error: null
    });
    
    try {
      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          new_password_confirmation: passwordForm.confirmPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPasswordChangeStatus({
          isSubmitting: false,
          success: true,
          error: null
        });
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          closePasswordModal();
        }, 1500);
      } else {
        setPasswordChangeStatus({
          isSubmitting: false,
          success: false,
          error: data.message || 'Failed to change password'
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeStatus({
        isSubmitting: false,
        success: false,
        error: 'An unexpected error occurred'
      });
    }
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles['panel-content']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data is available
  if (!user) {
    return (
      <div className={styles.panel}>
        <div className={styles['panel-content']} style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Unable to load user profile. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles['action-button']}
            style={{ marginTop: '1rem' }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles['panel-header']}>
        <h2>User Profile</h2>
        <div>
          <button 
            className={`${styles['action-button']} ${styles.password}`}
            onClick={openPasswordModal}
          >
            Change Password
          </button>
        </div>
      </div>
      
      <div className={styles['panel-content']}>
        {/* Profile Header */}
        <div className={styles['profile-header']}>
          <div className={styles.avatar}>
            {user.first_name?.charAt(0)}{user.surname?.charAt(0)}
          </div>
          <div className={styles['profile-info']}>
            <h1 className={styles['profile-name']}>
              {user.first_name} {user.middle_name} {user.surname}
            </h1>
            <p className={styles['profile-email']}>{user.email}</p>
            <div>
              <span className={`${styles['status-badge']} ${styles[`status-${user.status?.toLowerCase()}`]}`}>
                {user.status}
              </span>
              <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
                Last login: {sessionData.last_login ? new Date(sessionData.last_login).toLocaleString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles['tab-navigation']}>
          <button 
            className={`${styles.tab} ${activeTab === 'profile' ? styles['tab-active'] : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'activity' ? styles['tab-active'] : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles['tab-content']}>
          {activeTab === 'profile' && (
            <div>
              <h3 className={styles['section-title']}>User Information</h3>
              
              <div className={styles['info-grid']}>
                {/* Personal Info */}
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>First Name</label>
                  <div className={styles['info-value']}>{user.first_name || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Middle Name</label>
                  <div className={styles['info-value']}>{user.middle_name || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Surname</label>
                  <div className={styles['info-value']}>{user.surname || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Email</label>
                  <div className={styles['info-value']}>{user.email || '-'}</div>
                </div>
                
                {/* Job Info */}
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Position</label>
                  <div className={styles['info-value']}>{user.position || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Section</label>
                  <div className={styles['info-value']}>{user.section || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Division</label>
                  <div className={styles['info-value']}>{user.division || '-'}</div>
                </div>
                <div className={styles['info-item']}>
                  <label className={styles['info-label']}>Role</label>
                  <div className={styles['info-value']}>{user.role || '-'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className={styles['section-title']}>User Activity</h3>
              
              <div>
                <div className={`${styles['timeline-item']} ${styles['timeline-primary']}`}>
                  <div className={styles['timeline-label']}>Last Login</div>
                  <div>{sessionData.last_login ? new Date(sessionData.last_login).toLocaleString() : 'Never'}</div>
                </div>
                <div className={`${styles['timeline-item']} ${styles['timeline-secondary']}`}>
                  <div className={styles['timeline-label']}>Account Created</div>
                  <div>{sessionData.created_at ? new Date(sessionData.created_at).toLocaleString() : 'Unknown'}</div>
                </div>
                <div className={`${styles['timeline-item']} ${styles['timeline-secondary']}`}>
                  <div className={styles['timeline-label']}>Profile Updated</div>
                  <div>{sessionData.updated_at ? new Date(sessionData.updated_at).toLocaleString() : 'Unknown'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles.modal}>
            <div className={styles['modal-header']}>
              <h3 className={styles['modal-title']}>Change Password</h3>
              <button 
                className={styles['close-button']} 
                onClick={closePasswordModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles['modal-body']}>
                {passwordChangeStatus.success && (
                  <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                    Password changed successfully!
                  </div>
                )}
                
                {passwordChangeStatus.error && (
                  <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                    {passwordChangeStatus.error}
                  </div>
                )}
                
                <div className={styles['form-group']}>
                  <label className={styles['form-label']} htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handleInputChange}
                    className={styles['form-input']}
                    disabled={passwordChangeStatus.isSubmitting}
                  />
                  {formErrors.currentPassword && (
                    <div style={{ color: '#ef4444', marginTop: '4px', fontSize: '14px' }}>
                      {formErrors.currentPassword}
                    </div>
                  )}
                </div>
                <div className={styles['form-group']}>
                  <label className={styles['form-label']} htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handleInputChange}
                    className={styles['form-input']}
                    disabled={passwordChangeStatus.isSubmitting}
                  />
                  {formErrors.newPassword && (
                    <div style={{ color: '#ef4444', marginTop: '4px', fontSize: '14px' }}>
                      {formErrors.newPassword}
                    </div>
                  )}
                </div>
                <div className={styles['form-group']}>
                  <label className={styles['form-label']} htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handleInputChange}
                    className={styles['form-input']}
                    disabled={passwordChangeStatus.isSubmitting}
                  />
                  {formErrors.confirmPassword && (
                    <div style={{ color: '#ef4444', marginTop: '4px', fontSize: '14px' }}>
                      {formErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles['modal-footer']}>
                <button
                  type="button"
                  className={styles['cancel-button']}
                  onClick={closePasswordModal}
                  disabled={passwordChangeStatus.isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles['save-button']}
                  disabled={passwordChangeStatus.isSubmitting || passwordChangeStatus.success}
                >
                  {passwordChangeStatus.isSubmitting ? 'Processing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePanel;