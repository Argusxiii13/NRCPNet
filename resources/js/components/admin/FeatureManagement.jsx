import React, { useState, useEffect } from 'react';
import FeatureListPanel from './FeatureListPanel';
import FileUploadPanel from './PdfUploadPanel';
import styles from '../../../css/styles/admin/FeatureManagement.module.css';

const FeatureManagement = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [features, setFeatures] = useState([]);
  const [divisions, setDivisions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFeatures, setTotalFeatures] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Minimum 4 items per page

  // Fetch features from the API
  const fetchFeatures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/features');
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      const data = await response.json();
      setTotalFeatures(data.length);
      
      // Mock pagination by slicing the array
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedFeatures = data.slice(startIndex, endIndex);
      setFeatures(paginatedFeatures);
      
    } catch (error) {
      console.error('Error fetching features:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of features
  useEffect(() => {
    fetchFeatures();
  }, [currentPage, itemsPerPage]);

  // Fetch divisions from the API
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch('/api/divisions');
        const data = await response.json();
        
        const formattedDivisions = {};
        data.forEach(division => {
          if (division.has_sections && division.sections.length > 0) {
            formattedDivisions[division.name] = division.sections.map(section => section.name);
          } else {
            formattedDivisions[division.name] = [];
          }
        });
        
        setDivisions(formattedDivisions);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };
  
    fetchDivisions();
  }, []);

  // Handle page change manually
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to refresh the features list
  const refreshFeatures = () => {
    fetchFeatures();
  };

  return (
    <div className={styles['Feature-management']}>
      {error && (
        <div className={styles['error-message']}>
          <p>Error loading features: {error}</p>
        </div>
      )}
      <FeatureListPanel 
        features={features} 
        selectedFeature={selectedFeature} 
        setSelectedFeature={setSelectedFeature}
        loading={isLoading}
        totalFeatures={totalFeatures}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        refreshFeatures={refreshFeatures} // Pass the refresh function
      />
      <FileUploadPanel 
        refreshFeatures={refreshFeatures} // Ensure this line is present
        publishTo={publishTo} 
        setPublishTo={setPublishTo} 
        selectedDivision={selectedDivision} 
        setSelectedDivision={setSelectedDivision} 
        divisions={divisions} 
      />
    </div>
  );
};

export default FeatureManagement;