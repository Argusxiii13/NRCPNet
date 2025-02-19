// AdminSidebar.jsx
import { useState } from 'react';
import { Home, Mail, User, Calendar, Search, BarChart2, Folder, Settings, ChevronLeft } from 'lucide-react';
import '../../../css/styles/admin/AdminSidebar.css';  // We'll keep styles separate to match your pattern

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const logo = '/image/NRCP_logo.png';

    const menuItems = [
        { title: "Dashboard", icon: <Home size={20} /> },
        { title: "Messages", icon: <Mail size={20} /> },
        { title: "Profile", icon: <User size={20} />, gap: true },
        { title: "Schedule", icon: <Calendar size={20} /> },
        { title: "Search", icon: <Search size={20} /> },
        { title: "Analytics", icon: <BarChart2 size={20} /> },
        { title: "Files", icon: <Folder size={20} />, gap: true },
        { title: "Settings", icon: <Settings size={20} /> }
    ];

    return (
        <div className="admin-root-container">
            <div className={`admin-sidebar ${!isOpen ? 'collapsed' : ''}`}>
                <button 
                    className={`sidebar-toggle ${!isOpen ? 'rotate' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="sidebar-header">
                    <div className="logo-container">
                        <img 
                            src={logo} 
                            alt="NRCP Logo" 
                            className={`logo ${!isOpen ? 'spin-reverse' : 'spin'}`}
                        />
                    </div>
                    <h1 className={`sidebar-title ${!isOpen ? 'hide' : ''}`}>
                        NRCP
                    </h1>
                </div>

                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li 
                            key={index}
                            className={`menu-item ${item.gap ? 'gap-top' : ''} ${activeMenu === item.title ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item.title)}
                        >
                            <div className="menu-content">
                                <span className="menu-icon">{item.icon}</span>
                                <span className={`menu-title ${!isOpen ? 'hide' : ''}`}>
                                    {item.title}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="admin-main-content">
                <h1>Welcome to {activeMenu}</h1>
            </div>
        </div>
    );
};

export default AdminSidebar;