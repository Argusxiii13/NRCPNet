import React, { useState } from 'react';
import DownloadableFormsList from '../admin/DownloadableFormsList';
import PdfUploadPanel from '../admin/PdfUploadPanel';
import '../../../css/styles/admin/FormsManagement.css';

const FormsManagement = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [forms, setForms] = useState([
    {
      id: 1,
      title: "Employee Onboarding Form",
      status: "Active",
      division: "Human Resources",
      section: "Recruitment",
      uploadDate: "2025-01-15",
      fileUrl: "/forms/onboarding.pdf"
    },
    {
      id: 2,
      title: "Travel Expense Claim",
      status: "Active",
      division: "Finance",
      section: "Reimbursements",
      uploadDate: "2025-02-03",
      fileUrl: "/forms/expense-claim.pdf"
    },
    {
      id: 3,
      title: "Time Off Request",
      status: "Active",
      division: "Human Resources",
      section: "Leave Management",
      uploadDate: "2025-01-22",
      fileUrl: "/forms/time-off.pdf"
    },
    {
      id: 4,
      title: "Equipment Request Form",
      status: "Inactive",
      division: "IT",
      section: "",
      uploadDate: "2024-12-10",
      fileUrl: "/forms/equipment.pdf"
    }
  ]);
  const [divisions, setDivisions] = useState({
    "Human Resources": ["Recruitment", "Leave Management", "Benefits"],
    "Finance": ["Accounting", "Reimbursements", "Payroll"],
    "IT": [],
    "Marketing": ["Digital", "Events"]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalForms, setTotalForms] = useState(4);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Function to refresh the forms list - design only, no functionality
  const refreshForms = () => {
    // Just for design, no actual functionality
    console.log("Design mock: Refresh forms list requested");
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
        divisions={divisions} 
      />
    </div>
  );
};

export default FormsManagement;