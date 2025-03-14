// AnnouncementCarousel.jsx
import React, { useState, useEffect } from 'react';
import '../../.././css/styles/landing/AnnouncementCarousel.css'
import { body } from 'framer-motion/client';

const AnnouncementCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Enhanced announcements array with different content types
    const announcements = [
        {
            type: 'image',
            content: '/image/Announcement1.png',
            altText: 'Announcement 1: Check out our latest updates!'
        },
        {
            type: 'text',
            title: 'Accepted Poster Entries',
            content: 'Annual Scientific Conference & 92nd General Membership Assembly Poster Exhibit & Competition!'
        }, 
        {
            type: 'text',
            content: 'Announcement 2: New features coming soon!'
        },
        
        
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [announcements.length]);

    // Function to navigate to a specific slide when indicator is clicked
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="announcement-wrapper">
            <div className="announcement-container">
                {announcements[currentIndex].type === 'text' ? (
                    <div className="text-announcement">
                        {announcements[currentIndex].content}
                    </div>
                ) : (
                    <div className="image-announcement">
                        <img 
                            src={announcements[currentIndex].content} 
                            alt={announcements[currentIndex].altText}
                            className="announcement-image"
                        />
                        {/* Removed the image-caption div here */}
                    </div>
                )}
                
                {/* Indicators now inside the container */}
                <div className="indicators-container">
                    {announcements.map((_, index) => (
                        <button 
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
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