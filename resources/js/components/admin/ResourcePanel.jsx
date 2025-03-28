import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import ResourceDetailModal from './ResourceDetailModal';
import styles from '../../../css/styles/admin/ResourcePanel.module.css';

const ResourcePanel = () => {
  const [resourceCollection, setResourceCollection] = useState([
    // Example initial data - replace with your actual data source
    {
      id: '1',
      name: 'Sample Resource',
      description: 'A sample resource description',
      status: 'active',
      link: 'https://example.com',
      icon: null
    },
    {
      id: '2',
      name: 'Sample Resource',
      description: 'A sample resource description',
      status: 'active',
      link: 'https://example.com',
      icon: null
    },
    {
      id: '3',
      name: 'Sample Resource',
      description: 'A sample resource description',
      status: 'active',
      link: 'https://example.com',
      icon: null
    },
    {
      id: '4',
      name: 'Sample Resource',
      description: 'A sample resource description',
      status: 'active',
      link: 'https://example.com',
      icon: null
    },
  ]);

  // Pagination state
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const itemsPerPageLimit = 3;

  // Modal states
  const [selectedResourceItem, setSelectedResourceItem] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [resourceItemToRemove, setResourceItemToRemove] = useState(null);

  // Pagination calculations
  const indexOfLastResourceItem = currentPageIndex * itemsPerPageLimit;
  const indexOfFirstResourceItem = indexOfLastResourceItem - itemsPerPageLimit;
  
  const currentPageResourceItems = resourceCollection.slice(
    indexOfFirstResourceItem, 
    indexOfLastResourceItem
  );
  
  const totalPageCount = Math.ceil(resourceCollection.length / itemsPerPageLimit);

  // Handlers
  const handleResourceItemSelection = (resourceItem) => {
    setSelectedResourceItem(
      selectedResourceItem?.id === resourceItem.id ? null : resourceItem
    );
  };

  const openDetailModalForItem = (resourceItem) => {
    setSelectedResourceItem(resourceItem);
    setIsDetailModalVisible(true);
  };

  const openConfirmRemovalModal = (resourceItem) => {
    setResourceItemToRemove(resourceItem);
    setIsConfirmModalVisible(true);
  };

  // Update Resource Item Handler
  const handleUpdateResourceItem = (updatedResourceData, iconFileToUpload) => {
    // Local update logic - replace with your actual update mechanism
    const updatedCollection = resourceCollection.map(item => 
      item.id === updatedResourceData.id 
        ? { ...item, ...updatedResourceData } 
        : item
    );
    
    setResourceCollection(updatedCollection);
    setIsDetailModalVisible(false);
  };

  const confirmItemRemoval = () => {
    // Local removal logic - replace with your actual removal mechanism
    const filteredCollection = resourceCollection.filter(
      item => item.id !== resourceItemToRemove.id
    );
    
    setResourceCollection(filteredCollection);
    setIsConfirmModalVisible(false);
    setResourceItemToRemove(null);
  };

  // Pagination handlers
  const goToPreviousPage = () => {
    setCurrentPageIndex(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPageIndex(prevPage => Math.min(prevPage + 1, totalPageCount));
  };

  const ConfirmRemovalModal = () => {
    return ReactDOM.createPortal(
      <div className={styles['modal-overlay']}>
        <div className={styles['modal-container']}>
          <div className={styles['modal-header']}>
            <h4 className={styles['modal-title']}>Confirm Deletion</h4>
            <button 
              className={styles['close-button']} 
              onClick={() => setIsConfirmModalVisible(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles['modal-content']}>
            <p>Are you sure you want to delete this Resource? This action cannot be undone.</p>
          </div>
          <div className={styles['modal-footer']}>
            <button 
              className={styles['cancel-button']} 
              onClick={() => setIsConfirmModalVisible(false)}
            >
              Cancel
            </button>
            <button 
              className={styles['save-button']} 
              onClick={confirmItemRemoval}
            >
              Delete
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={`${styles['panel']} ${styles['resources-panel']}`}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Resources</h2>
      </div>
      <div className={styles['panel-resources']}>
        <div className={styles['resources-list']}>
          {currentPageResourceItems.map((resourceItem) => (
            <div
              key={resourceItem.id}
              className={`${styles['resource-item']} ${
                selectedResourceItem?.id === resourceItem.id ? styles['selected'] : ''
              }`}
              onClick={() => handleResourceItemSelection(resourceItem)}
            >
              <div className={styles['resource-info']}>
                <h3 className={styles['resource-name']}>{resourceItem.name}</h3>
                <span 
                  className={`${styles['resource-status']} ${styles[resourceItem.status]}`}
                >
                  {resourceItem.status}
                </span>
              </div>
              <div className={styles['resource-meta']}>
                <span className={styles['resource-url']}>{resourceItem.link}</span>
                {resourceItem.icon && (
                  <img 
                    src={resourceItem.icon} 
                    alt="Resource Icon" 
                    className={styles['resource-icon']} 
                  />
                )}
              </div>
              <div className={styles['resource-actions']}>
                <button 
                  className={styles['action-button']} 
                  title="View" 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(resourceItem.link, '_blank');
                  }}
                >
                  <Eye size={16} />
                </button>
                <button 
                  className={styles['action-button']} 
                  title="Edit" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetailModalForItem(resourceItem);
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className={`${styles['action-button']} ${styles['delete']}`} 
                  title="Delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmRemovalModal(resourceItem);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles['pagination']}>
          <div className={styles['pagination-info']}>
            <p>
              Showing {indexOfFirstResourceItem + 1}-
              {Math.min(indexOfLastResourceItem, resourceCollection.length)} 
              of {resourceCollection.length} Resources
            </p>
          </div>
          <div className={styles['pagination-buttons']}>
            <button
              className={styles['filter-button']}
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 1}
            >
              Previous
            </button>
            <button
              className={styles['filter-button']}
              onClick={goToNextPage}
              disabled={currentPageIndex === totalPageCount}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {isConfirmModalVisible && <ConfirmRemovalModal />}
      <ResourceDetailModal 
        isOpen={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        resourceItem={selectedResourceItem}
        onSave={handleUpdateResourceItem}
      />
    </div>
  );
};

export default ResourcePanel;