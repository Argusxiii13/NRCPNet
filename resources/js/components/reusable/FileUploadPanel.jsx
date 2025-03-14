import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import '../../../css/styles/reusable/FileUploadPanel.css';

const FileUploadPanel = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('active');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
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
            <div className="upload-zone">
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className="upload-info">Supports JPG, PNG, PDF, DOC, DOCX, TXT</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-label">Browse Files</label>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="preview-image" />
              </div>
            )}

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

            <div className="publish-controls">
              <button className="upload-button">
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