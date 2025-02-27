import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from '../../js/components/admin/AdminSidebar';
import Header from '../../js/components/admin/NavigationBar';
import FeatureManagement from '../components/admin/FeatureManagement';
import CalendarManagement from '../components/admin/CalendarManagement';
import AnnouncementManagement from '../components/admin/AnnouncementManagement';
import SuggestionInbox from '../components/admin/SuggestionInbox';
import UserManagement from '../components/admin/UserManagement';
import DivisionManagement from '../components/admin/DivisionManagement';
import RoleManagement from '../components/admin/RoleManagement';
import Dashboard from '../components/admin/Dashboard';

import '../../css/styles/admin/AdminPage.css';
import '../../css/font.css';

function Layout() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const renderContent = () => {
        // Check for submenu selections
        if (activeMenu.includes(': ')) {
            // Split the combined menu string
            const [parentMenu, subMenu] = activeMenu.split(': ');
            
            // Handle Library Management submenu items
            if (parentMenu === 'Library Management') {
                switch(subMenu) {
                    case 'Division Management':
                        return <DivisionManagement/>;
                    case 'Roles Management':
                        return <RoleManagement/>;
                    default:
                        return <h1>Library Management</h1>;
                }
            }
        }
        
        // Handle main menu selections
        switch(activeMenu) {
            case 'Feature Management':
                return <FeatureManagement />;
            case 'Dashboard':
                return <Dashboard/>;
            case 'User Management':
                return <UserManagement />;
            case 'Library Management':
                return <h1>Library Management</h1>;
            case 'Suggestion Inbox':
                return <SuggestionInbox />;
            case 'Announcement Management':
                return <AnnouncementManagement />;
            case 'Profile':
                return <h1>Profile Panel</h1>;
            case 'Settings':
                return <h1>Settings Panel</h1>;
            case 'Calendar Management':
                return <CalendarManagement />;
            default:
                return <h1>Welcome to Dashboard</h1>;
        }
    };

    return (
        <div className={`admin-layout ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                onToggle={toggleSidebar}
                activeMenu={activeMenu}
                onMenuSelect={setActiveMenu}
            />
            <Header />
            <div className="admin-content">
                <div className="admin-content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// Mount the application
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<Layout />);