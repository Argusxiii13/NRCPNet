import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const PdfUploadPanel = ({ refreshForms, publishTo, setPublishTo, selectedDivision, setSelectedDivision, divisions }) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('active');
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

  const handleUpload = (e) => {
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

    // Design-only mock of upload process
    setIsUploading(true);
    setUploadError(null);
    
    // Simulate upload delay for design purposes
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset form after "success"
      setTimeout(() => {
        setFile(null);
        setFilePreview('');
        setTitle('');
        setStatus('active');
        setUploadSuccess(false);
      }, 2000);
    }, 1500);
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {divisions && Object.keys(divisions).length > 0 && (
              <div className="division-controls">
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setPublishTo('');
                  }}
                  className="division-dropdown"
                >
                  <option value="">Select Division</option>
                  {Object.keys(divisions).map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                
                {selectedDivision && divisions[selectedDivision] && divisions[selectedDivision].length > 0 && (
                  <select
                    value={publishTo}
                    onChange={(e) => setPublishTo(e.target.value)}
                    className="section-dropdown"
                  >
                    <option value="">Select Section</option>
                    {divisions[selectedDivision].map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            
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