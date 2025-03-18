import React from 'react';
import styles from '../../../css/styles/admin/LoadingIndicator.module.css';

const LoadingIndicator = () => {
  return (
    <div className={styles['loading-indicator']}>
      <div className={styles['spinner']}></div>
      <div className={styles['loading-text']}>Loading...</div>
    </div>
  );
};

export default LoadingIndicator;