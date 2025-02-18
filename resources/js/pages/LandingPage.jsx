// LandingPage.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../components/landing/LandingHeader';
import EventCarousel from '../components/landing/EventCarousel';
import AnnouncementCarousel from '../components/landing/AnnouncementCarousel';
import LinkList from '../components/Landing/LinkList';
import DownloadableForms from '../components/landing/DownloadableForms'; // New import
import '../../css/styles/landing/LandingPage.css';
import SuggestionBox from '../components/landing/SuggestionBox';
import Calendar from '../components/landing/Calendar';
import ThursdayWellness from '../components/landing/ThursdayWellness';
import SpecialEvents from '../components/landing/SpecialEvents';
import Footer from '../components/landing/Footer';
const LandingPage = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prevState => !prevState);
    };
    
    return (
        <div className="app">
            <Header/>
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
                    <div className="downloadable-forms-section"> {/* New section */}
                        <DownloadableForms />
                    </div>
                    <div className="thursday-wellness-section">
                        <ThursdayWellness />
                        <SpecialEvents />
                    </div>
                    <div className="calendar-section">
                        <Calendar />
                        <SuggestionBox/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);