import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import styles from '../../../css/styles/admin/PdfUploadPanel.module.css';
import { useAuth } from '../../hooks/useAuth'; // Import the useAuth hook

const PdfUploadPanel = ({ refreshForms }) => {
  const { user, isAuthenticated, loading } = useAuth(); // Use the auth hook
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('Active');
  const [division, setDivision] = useState('General');
  const [type, setType] = useState('Miscellaneous'); // Change from 'Regular' to a valid type
  const [divisions, setDivisions] = useState([]);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Set author from user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Format author as "FirstName Surname"
      const authorName = `${user.first_name} ${user.surname}`;
      setAuthor(authorName);
      
      // If user has a division, set it as default
      if (user.division) {
        setDivision(user.division);
      }
    }
  }, [isAuthenticated, user]);

  // Fetch divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setLoadingDivisions(true);
      const response = await fetch('/api/divisions');
      if (!response.ok) {
        throw new Error('Failed to fetch divisions');
      }
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    } finally {
      setLoadingDivisions(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if the file is a PDF - just UI for now
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFilePreview(selectedFile.name); // For PDFs we just show the filename
        setUploadError(null); // Clear any previous errors
      } else {
        setUploadError('Only PDF files are allowed.');
        setFilePreview(''); // Clear preview for non-PDF files
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Basic form validation for UI design
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    if (!title.trim()) {
      setUploadError('Please enter a title');
      return;
    }
  
    if (!author.trim()) {
      setUploadError('Please enter an author');
      return;
    }
  
    if (!division) {
      setUploadError('Please select a division');
      return;
    }
  
    setIsUploading(true);
    setUploadError(null);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('status', status);
    formData.append('division', division);
    formData.append('type', type);
    
    try {
      // Use the new endpoint for uploading with metadata
      const response = await fetch('/api/downloadables/with-metadata', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header when sending FormData
      });
      
      // First check if response is OK before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          // If we got JSON, parse the error
          const errorData = await response.json();
          throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
        } else {
          // If not JSON (like HTML error page), just use status text
          throw new Error(`Upload failed with status: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      setUploadSuccess(true);
      console.log('Upload successful:', data);
      
      // Reset form after success, but keep author from user data
      setTimeout(() => {
        setFile(null);
        setFilePreview('');
        setTitle('');
        setStatus('Active');
        // Reset division to user's division or General if none
        if (user && user.division) {
          setDivision(user.division);
        } else {
          setDivision('General');
        }
        setType('Regular');
        setUploadSuccess(false);
        
        // Refresh the forms list to show the new upload
        refreshForms();
      }, 2000);
      
    } // Inside your catch block in handleUpload
    catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setUploadError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (filePreview) {
      return (
        <div className={styles['pdf-preview']}>
          <div className={styles['pdf-icon']}>
            <i className="far fa-file-pdf"></i>
          </div>
          <p className={styles['file-name']}>{filePreview}</p>
        </div>
      );
    } else {
      return <p className={styles['no-file-text']}>No file uploaded</p>;
    }
  };

  // Show loading state while authentication is in progress
  if (loading) {
    return (
      <div className={styles['panel'] + ' ' + styles['upload-panel']}>
        <div className={styles['panel-header']}>
          <h2 className="text-2xl font-bold">Upload PDF Form</h2>
        </div>
        <div className={styles['panel-content']} style={{ textAlign: 'center', padding: '40px' }}>
          Loading user information...
        </div>
      </div>
    );
  }

  return (
    <div className={styles['panel'] + ' ' + styles['upload-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Upload PDF Form</h2>
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['upload-section']}>
          <div className={styles['upload-area']}>
            <div className={styles['file-holder']}>
              {renderPreview()}
            </div>
            
            <div className={styles['upload-zone']}>
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className={styles['upload-info']}>Only PDF files are allowed</span>
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles['upload-label']}>Browse Files</label>
            </div>
            
            <div className={styles['form-controls']}>
              <div className={styles['control-group']}>
                <label htmlFor="title-input" className={styles['control-label']}>Title:</label>
                <input 
                  id="title-input"
                  type="text" 
                  placeholder="Enter form title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className={styles['title-input']}
                />
              </div>
              
              {/* Author field - pre-filled and disabled if authenticated */}
              <div className={styles['control-group']}>
                <label htmlFor="author-input" className={styles['control-label']}>Author:</label>
                <input 
                  id="author-input"
                  type="text" 
                  placeholder="Enter form author" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  className={styles['title-input']}
                  disabled={isAuthenticated} // Disable editing if authenticated
                  title={isAuthenticated ? "Author is automatically set to your name" : ""}
                />
                {isAuthenticated && (
                  <span className={styles['field-hint']}>Automatically set from your profile</span>
                )}
              </div>
              
              <div className={styles['control-group']}>
                <label htmlFor="division-select" className={styles['control-label']}>Division:</label>
                <select 
                  id="division-select"
                  value={division} 
                  onChange={(e) => setDivision(e.target.value)}
                  className={styles['status-dropdown']}
                  disabled={loadingDivisions}
                >
                  {loadingDivisions ? (
                    <option value="">Loading divisions...</option>
                  ) : (
                    <>
                      <option value="General">General</option>
                      {divisions.map((division) => (
                        <option key={division.code} value={division.code}>
                          {division.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {isAuthenticated && user.division && (
                  <span className={styles['field-hint']}>Default set to your division</span>
                )}
              </div>
              
              <div className={styles['control-group']}>
                <label htmlFor="type-select" className={styles['control-label']}>Type:</label>
                <select 
                  id="type-select"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className={styles['status-dropdown']}
                >
                  <option value="Request">Request</option>
                  <option value="Memo">Memo</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              
              <div className={styles['control-group']}>
                <label htmlFor="status-select" className={styles['control-label']}>Status:</label>
                <select 
                  id="status-select"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className={styles['status-dropdown']}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            {uploadError && (
              <div className={styles['error-message']}>
                {uploadError}
              </div>
            )}
            
            {uploadSuccess && (
              <div className={styles['success-message']}>
                File uploaded successfully!
              </div>
            )}
            
            <div className={styles['publish-controls']}>
              <button 
                className={styles['upload-button']}
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUploadPanel;