import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/LandingHeader'; // Adjust the path if necessary
import EventCarousel from './components/EventCarousel'; // Import the EventCarousel component
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
                <EventCarousel /> {/* Include the EventCarousel here */}
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);