import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from '../../js/components/admin/AdminSidebar';
import Header from '../../js/components/admin/NavigationBar';
import ContentManagement from '../components/admin/ContentManagement';
import '../../css/styles/admin/AdminPage.css';

function Layout() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const renderContent = () => {
        switch(activeMenu) {
            case 'Content Management':
                return <ContentManagement />;
            case 'Dashboard':
                return <h1>Welcome to Dashboard</h1>;
            case 'User Management':
                return <h1>User Management Panel</h1>;
            case 'Library Management':
                return <h1>Library Management Panel</h1>;
            case 'Suggestion Inbox':
                return <h1>Suggestion Inbox Panel</h1>;
            case 'Announcement':
                return <h1>Announcement Panel</h1>;
            case 'Profile':
                return <h1>Profile Panel</h1>;
            case 'Settings':
                return <h1>Settings Panel</h1>;
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