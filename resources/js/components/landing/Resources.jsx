import React, { useState, useEffect } from 'react';
import styles from '../../../css/styles/landing/Resources.module.css';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultLogo = '/image/CompanyLogo.jpg';
    const placeholderLogo = '/image/placeholder.jpg';

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch('/api/resources');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch resources');
                }
                
                const data = await response.json();
                setResources(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (isLoading) {
        return (
            <div className={styles['resources-container']}>
                <h3 className={styles['resources-title']}>Loading Resources...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['resources-container']}>
                <h3 className={styles['resources-title']}>Error Loading Resources</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles['resources-container']}>
            <h3 className={styles['resources-title']}>Other Resources and Systems</h3>
            <div className={styles['resources']}>
                <div className={styles['resources-items']}>
                    {resources.map((resource) => (
                        <div key={resource.id} className={styles['resources-item-container']}>
                            <img 
                                src={resource.icon || defaultLogo} 
                                alt={`${resource.name} logo`} 
                                className={styles['resources-item-logo']} 
                                onError={(e) => { 
                                    e.target.src = placeholderLogo; 
                                }}
                            />
                            <a 
                                href={resource.link} 
                                className={styles['resources-item']}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {resource.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Resources;