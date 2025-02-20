import React, { useState } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, Link2, Image, FileText, Type, Brush, Download, Upload
} from 'lucide-react';
import '../../../css/styles/admin/ContentManagement.css';

const ContentManagement = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');

  const divisions = {
    'Division 1': ['Section 1', 'Section 2'],
    'Division 2': ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
    'Division 3': ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6']
  };

  return (
    <div className="content-management">
      {/* File Upload Panel */}
      <div className="panel upload-panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Upload Files</h2>
        </div>
        <div className="panel-content">
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

      {/* Content Management Panel */}
      <div className="panel editor-panel">
        <div className="panel-header">
          <h2 className="text-2xl font-bold">Content Management</h2>
        </div>
        <div className="panel-content">
          <div className="editor-wrapper">
            <div className="editor-toolbar">
              <div className="toolbar-group">
                <button className="toolbar-button"><Bold size={20} /></button>
                <button className="toolbar-button"><Italic size={20} /></button>
                <button className="toolbar-button"><Underline size={20} /></button>
              </div>

              <div className="toolbar-divider" />

              <div className="toolbar-group">
                <button className="toolbar-button"><AlignLeft size={20} /></button>
                <button className="toolbar-button"><AlignCenter size={20} /></button>
                <button className="toolbar-button"><AlignRight size={20} /></button>
              </div>

              <div className="toolbar-divider" />

              <div className="toolbar-group">
                <button className="toolbar-button"><List size={20} /></button>
                <button className="toolbar-button"><Link2 size={20} /></button>
                <button className="toolbar-button"><Image size={20} /></button>
              </div>

              <div className="toolbar-divider" />

              <div className="toolbar-group">
                <button className="toolbar-button"><Type size={20} /></button>
                <button className="toolbar-button"><Brush size={20} /></button>
                <button className="toolbar-button"><Brush size={20} className="rotate-180" /></button>
              </div>
            </div>

            <div className="editor-content" />

            <div className="button-container">
              <button className="save-button">
                <Download size={20} />
                <span>Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;