// Header.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../../css/styles/landing/LandingHeader.module.css';
import { useAuth } from '../../hooks/useAuth';

const LPHeader = () => {
    const { user, isAuthenticated } = useAuth();
    
    const handleButtonClick = () => {
        window.location.href = isAuthenticated ? '/dashboard' : '/login';
    };

    return (
        <header className={styles['header']}>
            <div className={styles['header-container']}>
                <div className={styles['left-container']}>
                    <div className={styles['logo-container']}>
                        <img src="image/NRCP_logo----.png" alt="Logo" className={styles['logo']} />
                    </div>
                    <h1 className={styles['title']}>NRCPNet</h1>
                </div>
                <div className={styles['middle-container']}>
                    <a href="https://nrcp.dost.gov.ph/" className={styles['link']}>NRCP Website</a>
                    <a href="https://www.facebook.com/nationalresearchcouncil/" className={styles['link']}>NRCP Facebook</a>
                    <a href="#other-services" className={styles['link']}>Other Services</a>
                    <a href="#contact" className={styles['link']}>Contact</a>
                </div>
                <div className={styles['right-container']}>
                    <button 
                        className={styles['login-button']} 
                        onClick={handleButtonClick}
                    >
                        {isAuthenticated ? 'Dashboard' : 'Login'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default LPHeader;