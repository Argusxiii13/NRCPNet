// LandingPage.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/LandingHeader';
import EventCarousel from './components/EventCarousel';
import AnnouncementCarousel from './components/AnnouncementCarousel'; // Import the new component
import LinkList from './components/LinkList'; // Import the LinkList component
import './Styles/LandingPage.css';

const LandingPage = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prevState => !prevState);
    };
    
    return (
        <div className="app">
            <Header isSidebarExpanded={isSidebarExpanded} />
            <div className="main-content">
                <h2>Welcome to NRCPNet</h2>
                <p>This is the landing page content.</p>
                <EventCarousel />
                <div className="announcement-and-other-content">
                    <AnnouncementCarousel /> {/* Left side: Announcement */}
                    <LinkList /> {/* Right side: Links and systems */}
                </div>
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);