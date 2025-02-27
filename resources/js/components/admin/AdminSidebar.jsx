import { 
    Gauge, 
    UserPlus, 
    Newspaper, 
    LibraryBig, 
    Inbox, 
    Megaphone, 
    UserCog, 
    Settings, 
    LogOut,
    CalendarCog,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    Building,
    UserRoundCog
} from 'lucide-react';
import { useState } from 'react';
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ isExpanded, onToggle, activeMenu, onMenuSelect }) => {
    const logo = '/image/NRCP_logo----.png';
    const profilePic = '/image/SampleProfile.jpg';
    
    // State to track which menus are expanded
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        { title: "Dashboard", icon: <Gauge size={20} /> },
        { title: "Calendar Management", icon: <CalendarCog size={20} /> },
        { title: "Feature Management", icon: <Newspaper size={20} /> },
        { title: "Announcement Management", icon: <Megaphone size={20} /> },
        { title: "Suggestion Inbox", icon: <Inbox size={20} /> },
        { 
            title: "Library Management", 
            icon: <LibraryBig size={20} />,
            hasSubmenu: true,
            submenu: [
                { title: "Division Management", icon: <Building size={18} /> },
                { title: "Roles Management", icon: <UserRoundCog size={18} /> }
            ]
        },
        { title: "User Management", icon: <UserPlus size={20} /> },
        { title: "Profile", icon: <UserCog size={20} />, gap: true },
        { title: "Settings", icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
    };

    const toggleSubmenu = (title) => {
        setExpandedMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleMenuClick = (item) => {
        if (item.hasSubmenu) {
            // If sidebar is collapsed and we're clicking on an item with submenu,
            // expand the sidebar first
            if (!isExpanded) {
                onToggle(); // Expand the sidebar
            }
            
            // Then toggle the submenu
            toggleSubmenu(item.title);
        } else {
            onMenuSelect(item.title);
        }
    };

    const handleSubmenuClick = (parentTitle, submenuTitle, e) => {
        // You can either pass both the parent and submenu title or create a combined key
        onMenuSelect(`${parentTitle}: ${submenuTitle}`);
        // Stop propagation to prevent the parent menu from toggling
        e.stopPropagation();
    };

    return (
        <div className={`admin-sidebar ${!isExpanded ? 'collapsed' : ''}`}>
            <button 
                className={`sidebar-toggle ${!isExpanded ? 'rotate' : ''}`}
                onClick={onToggle}
            >
                <ChevronLeft size={20} />
            </button>

            <div className="sidebar-header">
                <div className="logo-container">
                    <img 
                        src={logo} 
                        alt="NRCP Logo" 
                        className={`logo ${!isExpanded ? 'spin-reverse' : 'spin'}`}
                    />
                </div>
                <h1 className={`sidebar-title ${!isExpanded ? 'hide' : ''}`}>
                    NRCPNet
                </h1>
            </div>

            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <div 
                            className={`menu-item ${item.gap ? 'gap-top' : ''} ${item.hasSubmenu ? 'has-submenu' : ''} ${activeMenu === item.title || (item.hasSubmenu && item.submenu.some(sub => activeMenu === `${item.title}: ${sub.title}`)) ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <div className="menu-content">
                                <span className="menu-icon">{item.icon}</span>
                                <span className={`menu-title ${!isExpanded ? 'hide' : ''}`}>
                                    {item.title}
                                </span>
                                {item.hasSubmenu && isExpanded && (
                                    <span className="submenu-arrow">
                                        {expandedMenus[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Submenu */}
                        {item.hasSubmenu && expandedMenus[item.title] && isExpanded && (
                            <ul className="submenu-list">
                                {item.submenu.map((subItem, subIndex) => (
                                    <li 
                                        key={subIndex}
                                        className={`submenu-item ${activeMenu === `${item.title}: ${subItem.title}` ? 'active' : ''}`}
                                        onClick={(e) => handleSubmenuClick(item.title, subItem.title, e)}
                                    >
                                        <div className="submenu-content">
                                            <span className="submenu-icon">{subItem.icon}</span>
                                            <span className="submenu-title">
                                                {subItem.title}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            className="profile-image"
                        />
                    </div>
                    <div className={`profile-info ${!isExpanded ? 'hide' : ''}`}>
                        <h3 className="profile-name">John Doe</h3>
                        <p className="profile-role">Admin</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-content" onClick={handleLogout}>
                        <span className="menu-icon">
                            <LogOut size={20} />
                        </span>
                        <span className={`menu-title ${!isExpanded ? 'hide' : ''}`}>
                            Logout
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;