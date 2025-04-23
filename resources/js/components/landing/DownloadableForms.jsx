import React, { useState, useEffect, useRef } from 'react';
import styles from '../../../css/styles/landing/DownloadableForms.module.css';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as needed

const DownloadableForms = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [requestForms, setRequestForms] = useState([]);
    const [memoForms, setMemoForms] = useState([]);
    const [miscForms, setMiscForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Debounce search term so we don't make API calls on every keypress
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        // Only fetch forms after authentication status is determined
        if (!authLoading) {
            fetchForms();
        }
    }, [authLoading, user, debouncedSearchTerm]);

    // Focus search input when expanded
    useEffect(() => {
        if (searchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchExpanded]);

    // Click outside to collapse search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchExpanded && 
                searchContainerRef.current && 
                !searchContainerRef.current.contains(event.target)) {
                if (searchTerm === '') {
                    setSearchExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchExpanded, searchTerm]);

    const fetchForms = async () => {
        try {
            setIsLoading(true);
            
            // Build the API URL with or without division
            let apiUrl = '/api/forms-by-division?status=Active';
            
            // If user is authenticated and has a division, pass it to the API
            if (isAuthenticated && user && user.division) {
                apiUrl += `&division=${encodeURIComponent(user.division)}`;
            }
            
            // Add search parameter if there's a search term
            if (debouncedSearchTerm) {
                apiUrl += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
            }
            
            // Use the endpoint that returns filtered forms
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Error fetching forms');
            }
            
            const data = await response.json();
            
            // Set the forms directly as they're already filtered by the server
            setRequestForms(data.request || []);
            setMemoForms(data.memo || []);
            setMiscForms(data.miscellaneous || []);
        } catch (err) {
            console.error('Error fetching forms:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded);
        if (!searchExpanded && searchInputRef.current) {
            // Small delay to ensure DOM is updated before focusing
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    };

    const handleDownload = (e, form) => {
        // Use the link's href as is, since it points to the file's location
        // No need to preventDefault - let the browser handle the download
    };

    // If still checking authentication status, show loading
    if (authLoading) {
        return (
            <div className={styles['downloadable-forms-container']}>
                <h3 className={styles['downloadable-forms-title']}>Forms</h3>
                <p className={styles['loading-message']}>Loading user information...</p>
            </div>
        );
    }

    return (
        <div className={styles['downloadable-forms-container']}>
            <div className={styles['header-container']}>
                {!searchExpanded && (
                    <h3 className={styles['downloadable-forms-title']}>Forms</h3>
                )}
                
                <div 
                    ref={searchContainerRef}
                    className={`${styles['search-container']} ${searchExpanded ? styles['expanded'] : ''}`}
                >
                    {searchExpanded && (
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search forms..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles['search-input']}
                        />
                    )}
                    <button 
                        className={styles['search-icon']} 
                        onClick={toggleSearch}
                        aria-label={searchExpanded ? "Close search" : "Search forms"}
                    >
                        {searchExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            
            {isLoading && <p className={styles['loading-message']}>Loading forms...</p>}
            
            {error && (
                <p className={styles['error-message']}>Error loading forms: {error}</p>
            )}
            
            {!isLoading && !error && (
                <div className={styles['sections-container']}>
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
                    
                    {/* Memo Forms Section */}
                    <div className={styles['section']}>
                        <h4 className={styles['section-title']}>Memo Forms</h4>
                        
                        {memoForms.length === 0 ? (
                            <p className={styles['no-forms-message']}>No memo forms available at this time.</p>
                        ) : (
                            <div className={styles['downloadable-forms-list']}>
                                {memoForms.map((form) => (
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
                    
                    {/* Miscellaneous Forms Section */}
                    <div className={styles['section']}>
                        <h4 className={styles['section-title']}>Miscellaneous Forms</h4>
                        
                        {miscForms.length === 0 ? (
                            <p className={styles['no-forms-message']}>No miscellaneous forms available at this time.</p>
                        ) : (
                            <div className={styles['downloadable-forms-list']}>
                                {miscForms.map((form) => (
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
                </div>
            )}
        </div>
    );
};

export default DownloadableForms;