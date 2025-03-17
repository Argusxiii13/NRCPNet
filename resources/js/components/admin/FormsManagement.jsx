import React, { useState, useEffect } from 'react';
import DownloadableFormsList from '../admin/DownloadableFormsList';
import PdfUploadPanel from '../admin/PdfUploadPanel';
import '../../../css/styles/admin/FormsManagement.css';

const FormsManagement = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');
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
      const response = await fetch('/api/downloadables'); // Adjust the API endpoint as necessary
      if (!response.ok) {
        throw new Error('Error fetching forms');
      }
      const data = await response.json();
      setForms(data);
      setTotalForms(data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloadableForms();
  }, []);

  const refreshForms = () => {
    fetchDownloadableForms();
  };

  return (
    <div className="forms-management">
      {error && (
        <div className="error-message">
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
        publishTo={publishTo} 
        setPublishTo={setPublishTo} 
        selectedDivision={selectedDivision} 
        setSelectedDivision={setSelectedDivision} 
      />
    </div>
  );
};

export default FormsManagement;