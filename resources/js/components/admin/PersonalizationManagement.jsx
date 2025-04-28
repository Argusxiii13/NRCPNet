import React from 'react';
import UserProfilePanel from './UserProfilePanel';
import styles from '../../../css/styles/admin/PersonalizationManagement.module.css';


const PersonalizationManagement = () => {



    return (
        <div className = {styles['personalization-management']}>
            <UserProfilePanel />
        </div>
    );
};

export default PersonalizationManagement;