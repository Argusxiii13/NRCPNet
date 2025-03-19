import React from 'react';
import FileUploadPanel from './FileUploadPanel';
import AnnouncementEditor from './AnnouncementEditor';
import styles from '../../../css/styles/admin/AnnouncementManagement.module.css';

const AnnouncementManagement = () => {
  return (
    <div className={styles['announcement-management']}>
      {/* File Upload Panel Component */}
      <FileUploadPanel />
      
      {/* Announcement Editor Component */}
      <AnnouncementEditor />
    </div>
  );
};

export default AnnouncementManagement;