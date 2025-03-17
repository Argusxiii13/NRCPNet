import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const PdfUploadPanel = ({ refreshForms }) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Active'); 
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

    setIsUploading(true);
    setUploadError(null);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('status', status);
    
    try {
      // Fixed endpoint to match Laravel API route (plural 'downloadables')
      const response = await fetch('/api/downloadables', {
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
      
      // Reset form after success
      setTimeout(() => {
        setFile(null);
        setFilePreview('');
        setTitle('');
        setStatus('Active');
        setUploadSuccess(false);
        
        // Refresh the forms list to show the new upload
        refreshForms();
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (filePreview) {
      return (
        <div className="pdf-preview">
          <div className="pdf-icon">
            <i className="far fa-file-pdf"></i>
          </div>
          <p className="file-name">{filePreview}</p>
        </div>
      );
    } else {
      return <p className="no-file-text">No file uploaded</p>;
    }
  };

  return (
    <div className="panel upload-panel">
      <div className="panel-header">
        <h2 className="text-2xl font-bold">Upload PDF Form</h2>
      </div>
      <div className="panel-content">
        <div className="upload-section">
          <div className="upload-area">
            <div className="file-holder">
              {renderPreview()}
            </div>
            
            <div className="upload-zone">
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className="upload-info">Only PDF files are allowed</span>
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-label">Browse Files</label>
            </div>
            
            <div className="form-controls">
              <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="title-input"
              />
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="status-dropdown"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            {uploadError && (
              <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {uploadError}
              </div>
            )}
            
            {uploadSuccess && (
              <div className="success-message" style={{ color: 'green', marginTop: '10px' }}>
                File uploaded successfully!
              </div>
            )}
            
            <div className="publish-controls">
              <button 
                className="upload-button"
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