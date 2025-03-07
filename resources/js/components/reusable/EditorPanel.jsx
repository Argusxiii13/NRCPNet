import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Link2, Image, Type, Brush, Download } from 'lucide-react';
import '../../../css/styles/reusable/EditorPanel.css';

const EditorPanel = ({ selectedFeature }) => {
  return (
    <div className="panel editor-panel">
      <div className="panel-header">
        <h2 className="text-2xl font-bold">
          {selectedFeature ? `Editing: ${selectedFeature.title}` : 'Feature Management'}
        </h2>
      </div>
      <div className="panel-Feature">
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
          <div className="editor-Feature" />
          <div className="button-container">
            <button className="save-button">
              <Download size={20} />
              <span>Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;