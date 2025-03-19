// AnnouncementCarousel.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../.././css/styles/landing/AnnouncementCarousel.module.css';

const AnnouncementCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [htmlContent, setHtmlContent] = useState(null);
    
    // Hardcoded announcements with specific file paths
    const announcements = [
        {
            type: 'image',
            content: '/announcements/Announcement1.png',
            altText: 'Announcement 1'
        },
        {
            type: 'html',
            content: '/announcements/Announcement2.html'
        }
    ];

    // Fetch HTML content when needed
    useEffect(() => {
        const fetchHtmlContent = async () => {
            if (announcements[currentIndex].type === 'html') {
                try {
                    const response = await fetch(announcements[currentIndex].content);
                    const html = await response.text();
                    setHtmlContent(html);
                } catch (error) {
                    console.error('Error fetching HTML content:', error);
                    setHtmlContent('<div>Failed to load HTML content</div>');
                }
            }
        };

        fetchHtmlContent();
    }, [currentIndex]);

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 15000); // Change every 4 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Function to navigate to a specific slide when indicator is clicked
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const renderContent = () => {
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

    return (
        <div className={styles['announcement-wrapper']}>
            <div className={styles['announcement-container']}>
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