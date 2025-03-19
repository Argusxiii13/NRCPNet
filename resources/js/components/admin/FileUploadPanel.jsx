import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import styles from '../../../css/styles/admin/FileUploadPanel.module.css';

const FileUploadPanel = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [publishTo, setPublishTo] = useState('');

  const divisions = {
    'Division 1': ['Section 1', 'Section 2'],
    'Division 2': ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
    'Division 3': ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6']
  };

  return (
    <div className={styles.panel}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Upload Files</h2>
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['upload-section']}>
          <div className={styles['upload-area']}>
            <div className={styles['upload-zone']}>
              <Upload size={24} />
              <p>Drag & drop files here or click to browse</p>
              <span className={styles['upload-info']}>Supports PDF, DOC, DOCX, TXT</span>
            </div>
            
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
                  {Object.keys(divisions).map((division) => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>

                <select 
                  className={styles['publish-dropdown']}
                  disabled={!selectedDivision}
                >
                  <option value="">Select Section</option>
                  {selectedDivision && divisions[selectedDivision].map((section) => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              <button className={styles['upload-button']}>
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