import React, { useState, useEffect } from 'react';
import styles from '../../../css/styles/landing/DownloadableForms.module.css';

const DownloadableForms = () => {
    const [regularForms, setRegularForms] = useState([]);
    const [requestForms, setRequestForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            setIsLoading(true);
            
            // Use the new endpoint that returns both form types
            const response = await fetch('/api/forms-by-type?status=Active');
            
            if (!response.ok) {
                throw new Error('Error fetching forms');
            }
            
            const data = await response.json();
            
            // Data is now organized by type
            setRegularForms(data.downloadable || []);
            setRequestForms(data.request || []);
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
            <h3 className={styles['downloadable-forms-title']}>Forms</h3>
            
            {isLoading && <p className={styles['loading-message']}>Loading forms...</p>}
            
            {error && (
                <p className={styles['error-message']}>Error loading forms: {error}</p>
            )}
            
            {!isLoading && !error && (
                <>
                    {/* Regular Downloadable Forms Section */}
                    <div className={styles['section']}>
                        <h4 className={styles['section-title']}>Downloadable Forms</h4>
                        
                        {regularForms.length === 0 ? (
                            <p className={styles['no-forms-message']}>No downloadable forms available at this time.</p>
                        ) : (
                            <div className={styles['downloadable-forms-list']}>
                                {regularForms.map((form) => (
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
                        )}
                    </div>
                    
                    {/* Request Forms Section */}
                    <div className={styles['section']}>
                        <h4 className={styles['section-title']}>Request Forms</h4>
                        
                        {requestForms.length === 0 ? (
                            <p className={styles['no-forms-message']}>No request forms available at this time.</p>
                        ) : (
                            <div className={styles['downloadable-forms-list']}>
                                {requestForms.map((form) => (
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
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DownloadableForms;