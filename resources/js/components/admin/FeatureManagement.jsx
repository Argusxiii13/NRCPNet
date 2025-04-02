import React, { useState } from 'react';
import FeatureListPanel from './FeatureListPanel';
import PngUploadPanel from './PngUploadPanel';
import styles from '../../../css/styles/admin/FeatureManagement.module.css';

const FeatureManagement = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [publishTo, setPublishTo] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  
  return (
    <div className={styles['Feature-management']}>
      <FeatureListPanel 
        selectedFeature={selectedFeature} 
        setSelectedFeature={setSelectedFeature}
      />
      <PngUploadPanel 
        publishTo={publishTo} 
        setPublishTo={setPublishTo} 
        selectedDivision={selectedDivision} 
        setSelectedDivision={setSelectedDivision}
      />
    </div>
  );
};

export default FeatureManagement;