import React, { useState, useEffect } from 'react';
import styles from '../../../css/styles/landing/DownloadableForms.module.css';

const DownloadableForms = () => {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDownloadableForms();
    }, []);

    const fetchDownloadableForms = async () => {
        try {
            // Fetch only active forms
            const response = await fetch('/api/downloadables?status=Active');
            if (!response.ok) {
                throw new Error('Error fetching forms');
            }
            const data = await response.json();
            
            // If data is paginated, extract the data array
            const formsData = data.data || data;
            setForms(formsData);
        } catch (err) {
            console.error('Error fetching forms:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (e, form) => {
        // Use the link's href as is, since it points to the file's location
        // No need to preventDefault - let the browser handle the download
    };

    return (
        <div className={styles['downloadable-forms-container']}>
            <h3 className={styles['downloadable-forms-title']}>Downloadable Forms</h3>
            
            {isLoading && <p className={styles['loading-message']}>Loading forms...</p>}
            
            {error && (
                <p className={styles['error-message']}>Error loading forms: {error}</p>
            )}
            
            {!isLoading && !error && forms.length === 0 && (
                <p className={styles['no-forms-message']}>No downloadable forms available at this time.</p>
            )}
            
            <div className={styles['downloadable-forms-list']}>
                {forms.map((form) => (
                    <div key={form.id} className={styles['downloadable-form-item-container']}>
                        <a 
                            href={form.content} 
                            className={styles['downloadable-form-item']} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={form.title}
                            onClick={(e) => handleDownload(e, form)}
                        >
                            {form.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadableForms;