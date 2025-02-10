// AnnouncementCarousel.jsx
import React, { useState, useEffect } from 'react';
import '../Styles/AnnouncementCarousel.css';

const AnnouncementCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const announcements = [
        'Announcement 1: Welcome to NRCPNet!',
        'Announcement 2: New features coming soon!',
        'Announcement 3: Check out our latest updates!',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        }, 4000); // Change every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [announcements.length]);

    return (
        <div className="announcement-container">
            <div className="announcement-item">
                {announcements[currentIndex]}
            </div>
        </div>
    );
};

export default AnnouncementCarousel;