import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText } from 'lucide-react';
import styles from '../../../css/styles/admin/FileUploadPanel.module.css';

const FileUploadPanel = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('Active');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Fetch divisions from the server when the component mounts
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch('/api/divisions');
        const data = await response.json();
        setDivisions(data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchDivisions();
  }, []);

  // Cleanup URL objects when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check if file type is PNG or HTML
    if (file.type !== 'image/png' && file.type !== 'text/html') {
      setErrorMessage('Only PNG and HTML files are supported');
      setSelectedFile(null);
      setPreviewUrl('');
      setFileType('');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setFileType(file.type);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Set title to filename if title is empty
    if (!title) {
      setTitle(file.name.split('.')[0]);
    }
  };

  const handleDropBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file type is PNG or HTML
      if (file.type !== 'image/png' && file.type !== 'text/html') {
        setErrorMessage('Only PNG and HTML files are supported');
        return;
      }
      
      setErrorMessage('');
      setSelectedFile(file);
      setFileType(file.type);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Set title to filename if title is empty
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setStatus('Active');
    setSelectedFile(null);
    setPreviewUrl('');
    setFileType('');
    setSelectedDivision('');
    setPublishTo('');
    setErrorMessage('');
  };

  const handleUpload = async () => {
    // Validate form data
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    if (!title) {
      setErrorMessage('Please provide a title');
      return;
    }

    if (!author) {
      setErrorMessage('Please provide an author name');
      return;
    }

    if (!publishTo) {
      setErrorMessage('Please select a publishing option');
      return;
    }

    if (publishTo === 'specific' && !selectedDivision) {
      setErrorMessage('Please select a division');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData object to send file and other form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('status', status);
      formData.append('publishTo', publishTo);
      
      if (publishTo === 'specific') {
        // Send division code directly - this assumes selectedDivision is the division code
        const divisionCode = selectedDivision;
        formData.append('division', divisionCode);
      }
      
      formData.append('file', selectedFile);
      
      // Try to get CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Make the API call
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: csrfToken ? {
          'X-CSRF-TOKEN': csrfToken
        } : {},
        body: formData,
      });
      
      // First check if response is HTML (error page)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("text/html") !== -1) {
        const htmlText = await response.text();
        console.error("Server returned HTML instead of JSON:", htmlText);
        throw new Error("Server error occurred. Check server logs for details.");
      }

      // Try to parse response as JSON
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }
      
      // Handle successful upload
      setUploadSuccess(true);
      setErrorMessage('');
      
      // Reset the form after 2 seconds
      setTimeout(() => {
        resetForm();
        setUploadSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Upload Files</h2>
      </div>
      <div className={styles['panel-content']}>
        {/* Content Preview Section - Always visible */}
        <div className={styles['preview-container']}>
          {previewUrl ? (
            fileType === 'image/png' ? (
              <img 
                src={previewUrl}
                alt="Preview"
                className={styles['preview-content']}
              />
            ) : (
              <iframe
                src={previewUrl}
                title="HTML Preview"
                className={styles['preview-content']}
                sandbox="allow-same-origin"
              />
            )
          ) : (
            <div className={styles['preview-placeholder']}>
              <div className={styles['placeholder-content']}>
                <ImageIcon size={48} />
                <FileText size={48} />
                <p>Preview will appear here</p>
                <span>Upload a PNG or HTML file to see a preview</span>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles['upload-section']}>
          <div className={styles['upload-area']}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelection}
              accept=".png,.html"
            />
            
            <div 
              className={styles['upload-zone']}
              onClick={handleDropBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className={styles['upload-info']}>Supports PNG, HTML</span>
              {selectedFile && (
                <span className={styles['selected-file']}>
                  Selected: {selectedFile.name}
                </span>
              )}
              {errorMessage && (
                <span className={styles['error-message']}>
                  {errorMessage}
                </span>
              )}
              {uploadSuccess && (
                <span className={styles['success-message']}>
                  File uploaded successfully!
                </span>
              )}
            </div>

            {/* First Row: Title, Author, Status */}
            <div className={styles['first-row']}>
              <input 
                type="text" 
                className={styles['text-input']}
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input 
                type="text" 
                className={styles['text-input']} 
                placeholder="Author *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />

              <select 
                className={styles['publish-dropdown']} 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Second Row: Publishing Options */}
            <div className={styles['publish-controls']}>
              <div className={styles['dropdowns-container']}>
                <select 
                  className={styles['publish-dropdown']}
                  value={publishTo}
                  onChange={(e) => setPublishTo(e.target.value)}
                >
                  <option value="everyone">Publish To Everyone</option>
                  <option value="specific">Publish To Specific Division</option>
                </select>

                <select 
                  className={styles['publish-dropdown']}
                  disabled={publishTo !== 'specific'}
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.code}>
                      ({division.code}) {division.name}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className={`${styles['upload-button']} ${isUploading ? styles['uploading'] : ''}`} 
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

export default FileUploadPanel;