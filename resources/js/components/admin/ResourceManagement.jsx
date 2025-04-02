import React, { useState, useEffect } from 'react';
import ResourcePanel from './ResourcePanel';
import ResourceUploadPanel from './ResourceUploadPanel'; // Import the new component
import styles from '../../../css/styles/admin/SystemsLinkManagement.module.css';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  
  // Function to fetch resources from the API
  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };
  
  // Fetch resources when component mounts
  useEffect(() => {
    fetchResources();
  }, []);
  
  // This function will be passed to ResourceUploadPanel to refresh the list after adding a new resource
  const refreshResources = () => {
    fetchResources();
  };
  
  return (
    <div className={styles['linklist-management']}>
      {/* Pass the existing resources and refresh function to ResourcePanel if needed */}
      <ResourcePanel resources={resources} refreshResources={refreshResources} />
      
      {/* Add the new ResourceUploadPanel component */}
      <ResourceUploadPanel refreshResources={refreshResources} />
    </div>
  );
};

export default ResourceManagement;