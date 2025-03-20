import React from 'react';
import FileUploadPanel from './FileUploadPanel';
import AnnouncementEditor from './AnnouncementEditor';
import AnnouncementListPanel from './AnnouncementListPanel';
import styles from '../../../css/styles/admin/AnnouncementManagement.module.css';

const AnnouncementManagement = () => {
  return (
    <div className={styles['announcement-management']}>
      <AnnouncementListPanel />

      {/* File Upload Panel Component */}
      <FileUploadPanel />
      
      {/* Announcement Editor Component */}
      <AnnouncementEditor />
    </div>
  );
};

export default AnnouncementManagement;