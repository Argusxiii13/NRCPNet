import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import styles from '../../../css/styles/admin/AnnouncementListPanel.module.css';

const AnnouncementListPanel = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedAnnouncement, setEditedAnnouncement] = useState({ title: '', status: '' });
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this number
  const [totalItems, setTotalItems] = useState(0);

  // Fetch paginated announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/paginated/announcements?page=${currentPage}&perPage=${itemsPerPage}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Transform the data to match our component's expected format
        const formattedData = result.data.map(item => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          title: item.title || 'Untitled Announcement',
          status: item.status || 'Active',
          content: item.content,
          type: item.type,
          author: item.author || 'Admin',
          division: item.division || 'General'
        }));
        
        // Log the current announcements data to console
        console.log('Current announcements data:', formattedData);
        
        setAnnouncements(formattedData);
        setTotalItems(result.pagination.total);
        setError(null);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentPage, itemsPerPage]);

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(selectedAnnouncement?.id === announcement.id ? null : announcement);
  };

  const openConfirmModal = (announcement) => {
    setAnnouncementToDelete(announcement);
    setIsConfirmOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditedAnnouncement({
      id: announcement.id,
      title: announcement.title,
      status: announcement.status,
      content: announcement.content,
      type: announcement.type,
      author: announcement.author,
      division: announcement.division
    });
    setIsEditOpen(true);
  };

  const openImageModal = (announcement) => {
    setAnnouncementContent(announcement.content);
    setIsImageOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    
    try {
      // Implement delete API call here
      const response = await fetch(`/api/announcements/${announcementToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete announcement');
      
      // After successful deletion, check if we need to adjust the current page
      if (announcements.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refresh the current page
        const refreshResponse = await fetch(`/api/paginated/announcements?page=${currentPage}&perPage=${itemsPerPage}`);
        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          setAnnouncements(result.data);
          setTotalItems(result.pagination.total);
        }
      }
      
    } catch (err) {
      console.error('Error deleting announcement:', err);
      // Show error message to user
    } finally {
      setIsConfirmOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleEditSubmit = async () => {
    if (!editedAnnouncement.id) return;
    
    try {
      // Implement update API call here
      const response = await fetch(`/api/announcements/${editedAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAnnouncement),
      });
      
      if (!response.ok) throw new Error('Failed to update announcement');
      
      // Refresh the current page after successful update
      const refreshResponse = await fetch(`/api/paginated/announcements?page=${currentPage}&perPage=${itemsPerPage}`);
      if (refreshResponse.ok) {
        const result = await refreshResponse.json();
        setAnnouncements(result.data);
      }
      
    } catch (err) {
      console.error('Error updating announcement:', err);
      // Show error message to user
    } finally {
      setIsEditOpen(false);
      setEditedAnnouncement({ id: null, title: '', status: '' });
    }
  };

  const renderContentPreview = (content) => {
    if (!content) return null;

    if (content.toLowerCase().endsWith('.html')) {
      return (
        <div className={styles['iframe-container']}>
          <iframe 
            src={content} 
            frameBorder="0" 
            width="100%" 
            height="100%" 
            title="Announcement Content"
          ></iframe>
        </div>
      );
    } else {
      return (
        <img 
          src={content} 
          alt="Announcement" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      );
    }
  };

  return (
    <div className={styles['panel'] + ' ' + styles['announcements-list-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Announcements</h2>
      </div>
      <div className={styles['panel-announcements']}>
        {loading ? (
          <div className={styles['loading-state']}>Loading announcements...</div>
        ) : error ? (
          <div className={styles['error-state']}>{error}</div>
        ) : announcements.length === 0 ? (
          <div className={styles['empty-state']}>No announcements found.</div>
        ) : (
          <>
            <div className={styles['announcements-list']}>
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`${styles['announcement-item']} ${selectedAnnouncement?.id === announcement.id ? styles['selected'] : ''}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className={styles['announcement-info']}>
                    <h3 className={styles['announcement-title']}>{announcement.title}</h3>
                    <span className={`${styles['announcement-status']} ${styles[announcement.status]}`}>
                      {announcement.status}
                    </span>
                  </div>
                  <div className={styles['announcement-meta']}>
                    <span className={styles['announcement-author']}>Author: {announcement.author}</span>
                    <span className={styles['announcement-division']}>Division: {announcement.division}</span>
                    <span className={styles['announcement-type']}>Type: {announcement.type}</span>
                  </div>
                  <div className={styles['announcement-actions']}>
                    <button className={styles['action-button']} title="View" onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(announcement);
                    }}>
                      <Eye size={16} />
                    </button>
                    <button className={styles['action-button']} title="Edit" onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(announcement);
                    }}>
                      <Edit2 size={16} />
                    </button>
                    <button className={`${styles['action-button']} ${styles['delete']}`} title="Delete" onClick={(e) => {
                      e.stopPropagation();
                      openConfirmModal(announcement);
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Component */}
            <div className={styles['pagination']}>
              <div className={styles['pagination-info']}>
                <p>
                  {loading ? 'Loading...' :
                    `Showing ${totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} announcements`
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
                  disabled={currentPage * itemsPerPage >= totalItems || loading}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Confirm Deletion</h4>
              <button className={styles['close-button']} onClick={() => setIsConfirmOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <p>Are you sure you want to delete this announcement? This action cannot be undone.</p>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsConfirmOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container-large']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Edit Announcement</h4>
              <button className={styles['close-button']} onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              {/* Display readonly details */}
              <div className={styles['details-section']}>
                <div className={styles['details-row']}>
                  <div className={styles['detail-item']}>
                    <label>Author:</label>
                    <span>{editedAnnouncement.author}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>Division:</label>
                    <span>{editedAnnouncement.division}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>Type:</label>
                    <span>{editedAnnouncement.type}</span>
                  </div>
                </div>
              </div>
              
              {/* Content preview */}
              <div className={styles['content-preview-large']}>
                {renderContentPreview(editedAnnouncement.content)}
              </div>
              
              {/* Editable fields */}
              <div className={styles['modal-field']}>
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={editedAnnouncement.title}
                  onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, title: e.target.value })}
                  className={styles['modal-input']}
                />
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedAnnouncement.status}
                  onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, status: e.target.value })}
                  className={styles['modal-select']}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className={styles['save-button']} onClick={handleEditSubmit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Image/HTML Content Viewer Modal */}
      {isImageOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-container-large']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Announcement</h4>
              <button className={styles['close-button']} onClick={() => setIsImageOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']} style={{ padding: '0', overflow: 'hidden' }}>
              <div className={styles['content-display-large']}>
                {renderContentPreview(announcementContent)}
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['cancel-button']} onClick={() => setIsImageOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementListPanel;