import React, { useState, useEffect } from 'react';
import DownloadableFormsList from '../admin/DownloadableFormsList';
import PdfUploadPanel from '../admin/PdfUploadPanel';
import styles from '../../../css/styles/admin/FormsManagement.module.css';

const FormsManagement = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalForms, setTotalForms] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Fetch downloadable forms from the API
  const fetchDownloadableForms = async () => {
    try {
      // Updated to use 'downloadables' (plural) endpoint
      const response = await fetch(`/api/downloadables?per_page=${itemsPerPage}&page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Error fetching forms');
      }
      const data = await response.json();
      setForms(data.data);
      setTotalForms(data.total);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDownloadableForms();
  }, [currentPage, itemsPerPage]);

  const refreshForms = () => {
    setIsLoading(true);
    fetchDownloadableForms();
  };

  return (
    <div className={styles['forms-management']}>
      {error && (
        <div className={styles['error-message']}>
          <p>Error loading forms: {error}</p>
        </div>
      )}
      <DownloadableFormsList 
        forms={forms} 
        selectedForm={selectedForm} 
        setSelectedForm={setSelectedForm}
        loading={isLoading}
        totalForms={totalForms}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        refreshForms={refreshForms}
      />
      <PdfUploadPanel 
        refreshForms={refreshForms}
      />
    </div>
  );
};

export default FormsManagement;