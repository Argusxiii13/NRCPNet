import React from 'react';
import { Upload } from 'lucide-react';
import '../../../css/styles/reusable/FileUploadPanel.css';

const FileUploadPanel = ({ publishTo, setPublishTo, selectedDivision, setSelectedDivision, divisions }) => {
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
              <span className="upload-info">Supports PDF, DOC, DOCX, TXT</span>
            </div>
            
            <div className="publish-controls">
              <div className="dropdowns-container">
                <select
                  className="publish-dropdown"
                  value={publishTo}
                  onChange={(e) => setPublishTo(e.target.value)}
                >
                  <option value="">Select Publishing Option</option>
                  <option value="everyone">Publish To Everyone</option>
                  <option value="specific">Publish To Specific Division</option>
                </select>

                <select
                  className="publish-dropdown"
                  disabled={publishTo !== 'specific'}
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {Object.keys(divisions).map((division) => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>

                <select 
                  className="publish-dropdown"
                  disabled={!selectedDivision}
                >
                  <option value="">Select Section</option>
                  {selectedDivision && divisions[selectedDivision].map((section) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

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