import React from 'react';
import ResourcePanel from './ResourcePanel';
import styles from '../../../css/styles/admin/SystemsLinkManagement.module.css';

const ResourceManagement = () => {
  return (
    <div className={styles['linklist-management']}>
      <ResourcePanel />
    </div>
  );
};

export default ResourceManagement;