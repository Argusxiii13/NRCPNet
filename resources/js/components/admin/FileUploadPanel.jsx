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

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    if (!title) {
      setErrorMessage('Please provide a title');
      return;
    }

    const formData = {
      title,
      author,
      status,
      division: selectedDivision,
      publishTo,
      file: selectedFile,
      fileType
    };
    
    console.log("Form Data to Upload:", formData);
    // Insert your API call to upload with formData here
    setErrorMessage('');
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
            </div>

            {/* First Row: Title, Author, Status */}
            <div className={styles['first-row']}>
              <input 
                type="text" 
                className={styles['text-input']}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input 
                type="text" 
                className={styles['text-input']} 
                placeholder="Author"
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
                  <option value="">Select Publishing Option</option>
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
                    <option key={division.id} value={division.id}>
                      ({division.code}) {division.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className={styles['upload-button']} onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPanel;