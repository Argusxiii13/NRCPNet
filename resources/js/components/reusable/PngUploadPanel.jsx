import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import '../../../css/styles/reusable/PngUploadPanel.css';

const FileUploadPanel = ({ refreshFeatures }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('active');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if the file is a PNG image
      if (selectedFile.type === 'image/png') {
        setFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
        setUploadError(null); // Clear any previous errors
      } else {
        setUploadError('Only PNG files are allowed.');
        setImagePreview(''); // Clear preview for non-PNG files
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
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
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('status', status);
      
      const response = await fetch('/api/features', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      if (refreshFeatures) {
        refreshFeatures(); // This refreshes the feature list
      }
      
      // Reset form
      setFile(null);
      setImagePreview('');
      setTitle('');
      setStatus('active');
      setUploadSuccess(true);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (imagePreview) {
      return <img src={imagePreview} alt="Preview" className="preview-image" />;
    } else if (file) {
      return (
        <div className="file-info">
          <p className="file-name">{file.name}</p>
          <p className="file-type">{file.type}</p>
        </div>
      );
    } else {
      return <p className="no-image-text">No file uploaded</p>;
    }
  };

  return (
    <div className="panel upload-panel">
      <div className="panel-header">
        <h2 className="text-2xl font-bold">Upload Files</h2>
      </div>
      <div className="panel-Feature">
        <div className="upload-section">
          <div className="upload-area">
            <div className="image-holder">
              {renderPreview()}
            </div>
            
            <div className="upload-zone">
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className="upload-info">Only PNG files are allowed</span>
              <input 
                type="file" 
                accept="image/png" 
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

export default FileUploadPanel;