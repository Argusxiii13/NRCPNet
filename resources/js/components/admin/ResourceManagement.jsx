import React, { useState, useEffect } from 'react';
import ResourcePanel from './ResourcePanel';
import ResourceUploadPanel from './ResourceUploadPanel'; 
import styles from '../../../css/styles/admin/SystemsLinkManagement.module.css';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  
  
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
  
  
  useEffect(() => {
    fetchResources();
  }, []);
  
  
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