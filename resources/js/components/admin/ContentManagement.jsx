import React from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, Link2, Image, FileText, Type, Brush, Download, Upload
} from 'lucide-react';
import '../../../css/styles/admin/ContentManagement.css';

const ContentManagement = () => {
  return (
    <div className="content-management">
      <div className="content-container">
        <h2 className="text-2xl font-bold mb-6">Content Management</h2>
        
        <div className="editor-wrapper">
          {/* Top Toolbar */}
          <div className="editor-toolbar">
            {/* Text Formatting */}
            <div className="toolbar-group">
              <button className="toolbar-button">
                <Bold size={20} />
              </button>
              <button className="toolbar-button">
                <Italic size={20} />
              </button>
              <button className="toolbar-button">
                <Underline size={20} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Alignment */}
            <div className="toolbar-group">
              <button className="toolbar-button">
                <AlignLeft size={20} />
              </button>
              <button className="toolbar-button">
                <AlignCenter size={20} />
              </button>
              <button className="toolbar-button">
                <AlignRight size={20} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Lists and Links */}
            <div className="toolbar-group">
              <button className="toolbar-button">
                <List size={20} />
              </button>
              <button className="toolbar-button">
                <Link2 size={20} />
              </button>
              <button className="toolbar-button">
                <Image size={20} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Styling */}
            <div className="toolbar-group">
              <button className="toolbar-button">
                <Type size={20} />
              </button>
              <button className="toolbar-button">
                <Brush size={20} />
              </button>
              <button className="toolbar-button">
                <Brush size={20} className="rotate-180" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="editor-content" />

          {/* Action Buttons */}
          <div className="button-container">
            <button className="save-button">
              <Download size={20} />
              <span>Save as PDF</span>
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="upload-section">
          <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
          <div className="upload-area">
            <div className="upload-zone">
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className="upload-info">Supports PDF, DOC, DOCX, TXT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;