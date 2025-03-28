import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import styles from '../../../css/styles/admin/ResourcePanel.module.css';

const ResourcePanel = () => {
  // Feature data and loading state
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalResources, setTotalResources] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedResource, setEditedResource] = useState({ 
    id: null, 
    name: '', 
    link: '', 
    status: '' 
  });

  // Fetch resources from the API with pagination
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/paginated/resources?page=${currentPage}&per_page=${itemsPerPage}`);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setResources(data.data);
      setTotalResources(data.total);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of resources and when page changes
  useEffect(() => {
    fetchResources();
  }, [currentPage]);

  const openConfirmModal = (resource, e) => {
    e.stopPropagation();
    setResourceToDelete(resource);
    setIsConfirmOpen(true);
  };

  const openEditModal = (resource, e) => {
    e.stopPropagation();
    setEditedResource({
      id: resource.id,
      name: resource.name,
      link: resource.link,
      status: resource.status
    });
    setIsEditOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Resource deleted successfully');
        // If this would make the current page empty, go back a page
        if (resources.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchResources(); // Refresh the resources list
        }
      } else {
        console.error('Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setIsConfirmOpen(false);
      setResourceToDelete(null);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/resources/${editedResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedResource.name,
          link: editedResource.link,
          status: editedResource.status
        }),
      });
      
      if (response.ok) {
        console.log('Resource updated successfully');
        fetchResources(); // Refresh the resources list
      } else {
        const errorData = await response.json();
        console.error('Failed to update resource:', errorData);
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    } finally {
      setIsEditOpen(false);
      setEditedResource({ id: null, name: '', link: '', status: '' });
    }
  };

  return (
    <div className={styles['panel'] + ' ' + styles['resources-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Resources</h2>
      </div>
      
      <div className={styles['panel-resources']}>
        {error && (
          <div className={styles['error-message']}>
            <p>Error loading resources: {error}</p>
          </div>
        )}
        <div className={styles['resources-list']}>
          {resources.length === 0 && !loading ? (
            <div className={styles['no-resources']}>
              <p>No resources found.</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                className={styles['resource-item']}
              >
                <div className={styles['resource-info']}>
                  <h3 className={styles['resource-name']}>{resource.name}</h3>
                  <span 
                    className={`${styles['resource-status']} ${styles[resource.status.toLowerCase()]}`}
                  >
                    {resource.status}
                  </span>
                </div>
                <div className={styles['resource-meta']}>
                  <span className={styles['resource-url']}>{resource.link}</span>
                  {resource.icon && (
                    <img 
                      src={resource.icon} 
                      alt="Resource Icon" 
                      className={styles['resource-icon']} 
                    />
                  )}
                </div>
                <div className={styles['resource-actions']}>
                  <button 
                    className={styles['action-button']} 
                    title="View" 
                    onClick={() => window.open(resource.link, '_blank')}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className={styles['action-button']} 
                    title="Edit" 
                    onClick={(e) => openEditModal(resource, e)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className={`${styles['action-button']} ${styles['delete']}`} 
                    title="Delete" 
                    onClick={(e) => openConfirmModal(resource, e)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className={styles['loading-indicator']}>
              <p>Loading resources...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination controls */}
      <div className={styles['pagination']}>
        <div className={styles['pagination-info']}>
          <p>
            {loading ? 'Loading...' :
              `Showing ${totalResources > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-${Math.min(currentPage * itemsPerPage, totalResources)} of ${totalResources} resources`
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
            disabled={currentPage >= lastPage || loading}
          >
            Next
          </button>
        </div>
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
              <p>Are you sure you want to delete this resource? This action cannot be undone.</p>
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
          <div className={styles['modal-container']}>
            <div className={styles['modal-header']}>
              <h4 className={styles['modal-title']}>Edit Resource</h4>
              <button className={styles['close-button']} onClick={() => setIsEditOpen(false)}>✖</button>
            </div>
            <div className={styles['modal-content']}>
              <div className={styles['modal-field']}>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={editedResource.name}
                  onChange={(e) => setEditedResource({ ...editedResource, name: e.target.value })}
                  className={styles['modal-input']}
                />
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="link">Link:</label>
                <input
                  id="link"
                  type="text"
                  value={editedResource.link}
                  onChange={(e) => setEditedResource({ ...editedResource, link: e.target.value })}
                  className={styles['modal-input']}
                />
              </div>
              <div className={styles['modal-field']}>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={editedResource.status}
                  onChange={(e) => setEditedResource({ ...editedResource, status: e.target.value })}
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
    </div>
  );
};

export default ResourcePanel;