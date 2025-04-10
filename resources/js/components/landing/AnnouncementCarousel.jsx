import React, { useState, useEffect } from 'react';
import styles from '../../.././css/styles/landing/AnnouncementCarousel.module.css';

const AnnouncementCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [htmlContent, setHtmlContent] = useState(null);
    const [htmlBackgroundColor, setHtmlBackgroundColor] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Use the same approach as LandingPage to get user data
    useEffect(() => {
        const fetchUserData = async () => {
            const rootElement = document.getElementById('root');
            const isLoggedIn = rootElement?.dataset.isLoggedIn === 'true';
            
            if (isLoggedIn && rootElement.dataset.userId) {
                try {
                    // Use the user ID to fetch complete user data
                    const userId = rootElement.dataset.userId;
                    const response = await fetch(`/api/users/${userId}`);
                    
                    if (response.ok) {
                        const userData = await response.json();
                        setCurrentUser(userData);
                        console.log('Announcement component - Current user:', userData);
                    } else {
                        console.error('Failed to fetch user details');
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setCurrentUser(null);
                }
            } else {
                console.log('User not authenticated');
                setCurrentUser(null);
            }
        };
        
        fetchUserData();
    }, []);

 
// Fetch announcements after we know the user's status
useEffect(() => {
    const fetchAnnouncements = async () => {
        try {
            // Add division as query parameter if user is logged in
            let url = '/api/active-announcements';
            if (currentUser && currentUser.division) {
                url += `?division=${encodeURIComponent(currentUser.division)}`;
            }
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
                console.log('Announcements loaded:', data.length);
            } else {
                console.error('Failed to fetch announcements:', response.status);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    fetchAnnouncements();
}, [currentUser]);

    // Fetch HTML content when needed
    useEffect(() => {
        const fetchHtmlContent = async () => {
            if (announcements.length > 0 && announcements[currentIndex].type === 'html') {
                try {
                    const response = await fetch(announcements[currentIndex].content);
                    const htmlText = await response.text();
                    setHtmlContent(htmlText);

                    // Parse the HTML to extract background color
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    
                    // Look for .announcement-container
                    const announcementContainer = doc.querySelector('.announcement-container');
                    
                    if (announcementContainer) {
                        // Extract background color from inline style or CSS
                        const inlineStyle = announcementContainer.getAttribute('style');
                        let backgroundColor = null;

                        // Check inline style first
                        if (inlineStyle) {
                            const backgroundMatch = inlineStyle.match(/background-color:\s*([^;]+)/i);
                            if (backgroundMatch) {
                                backgroundColor = backgroundMatch[1].trim();
                            }
                        }

                        // If no inline style, check <style> tag
                        if (!backgroundColor) {
                            const styleTag = doc.querySelector('style');
                            if (styleTag) {
                                const styleContent = styleTag.textContent;
                                const backgroundMatch = styleContent.match(/\.announcement-container\s*{[^}]*background-color:\s*([^;]+)/i);
                                if (backgroundMatch) {
                                    backgroundColor = backgroundMatch[1].trim();
                                }
                            }
                        }

                        // Set background color if found
                        if (backgroundColor && 
                            backgroundColor !== 'transparent' && 
                            backgroundColor !== 'rgba(0, 0, 0, 0)') {
                            setHtmlBackgroundColor(backgroundColor);
                        } else {
                            setHtmlBackgroundColor(null);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching HTML content:', error);
                    setHtmlContent('<div>Failed to load HTML content</div>');
                    setHtmlBackgroundColor(null);
                }
            } else {
                setHtmlBackgroundColor(null);
            }
        };

        fetchHtmlContent();
    }, [currentIndex, announcements]);

    // Auto-rotate carousel
    useEffect(() => {
        if (announcements.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 60000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    // Function to navigate to a specific slide when an indicator is clicked
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const renderContent = () => {
        if (announcements.length === 0) {
            return <div>Loading announcements...</div>;
        }

        const currentAnnouncement = announcements[currentIndex];

        switch (currentAnnouncement.type) {
            case 'image':
                return (
                    <div className={styles['image-announcement']}>
                        <img 
                            src={currentAnnouncement.content} 
                            alt={currentAnnouncement.altText}
                            className={styles['announcement-image']}
                        />
                    </div>
                );
            case 'html':
                return (
                    <iframe 
                        srcDoc={htmlContent}
                        className={styles['html-announcement']}
                        title="Announcement"
                        frameBorder="0"
                    />
                );
            default:
                return <div>Unsupported announcement type</div>;
        }
    };

    // Determine container style based on HTML background
    const containerStyle = htmlBackgroundColor 
        ? { backgroundColor: htmlBackgroundColor }
        : { 
            backgroundImage: 'linear-gradient(#4a99da, #11326a)' 
        };

    return (
        <div className={styles['announcement-wrapper']}>
            <div 
                className={styles['announcement-container']} 
                style={containerStyle}
            >
                <div className={styles['announcement-item']}>
                    {renderContent()}
                </div>

                <div className={styles['indicators-container']}>
                    {announcements.map((_, index) => (
                        <button 
                            key={index}
                            className={`${styles['indicator']} ${index === currentIndex ? styles['active'] : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCarousel;