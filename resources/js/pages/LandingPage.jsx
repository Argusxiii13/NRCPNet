// LandingPage.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../components/landing/LandingHeader';
import EventCarousel from '../components/landing/EventCarousel';
import AnnouncementCarousel from '../components/landing/AnnouncementCarousel';
import LinkList from '../components/Landing/LinkList';
import '../../css/styles/landing/LandingPage.css';
import SuggestionBox from '../components/landing/SuggestionBox';
import Calendar from '../components/landing/Calendar';

const LandingPage = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prevState => !prevState);
    };
    
    return (
        <div className="app">
            <Header isSidebarExpanded={isSidebarExpanded} />
            <div className="main-content">
                <div className="welcome-section">
                    <h2>Welcome to NRCPNet</h2>
                    <p>This is the landing page content.</p>
                </div>
                <div className="content-grid">
                    <div className="event-section">
                        <EventCarousel />
                    </div>
                    <div className="announcement-section">
                        <AnnouncementCarousel />
                    </div>
                    <div className="links-section">
                        <LinkList />
                    </div>
                    <div className="calendar-section">
                        <Calendar />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);