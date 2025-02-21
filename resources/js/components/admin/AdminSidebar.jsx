import { 
    Gauge, 
    UserPlus, 
    Newspaper, 
    LibraryBig, 
    Inbox, 
    Megaphone, 
    UserCog, 
    Settings, 
    ArrowRight,
    LogOut
} from 'lucide-react';
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ isExpanded, onToggle, activeMenu, onMenuSelect }) => {
    const logo = '/image/NRCP_logo----.png';
    const profilePic = '/image/SampleProfile.jpg';

    const menuItems = [
        { title: "Dashboard", icon: <Gauge size={20} /> },
        { title: "User Management", icon: <UserPlus size={20} /> },
        { title: "Content Management", icon: <Newspaper size={20} /> },
        { title: "Library Management", icon: <LibraryBig size={20} /> },
        { title: "Suggestion Inbox", icon: <Inbox size={20} /> },
        { title: "Announcement", icon: <Megaphone size={20} /> },
        { title: "Profile", icon: <UserCog size={20} />, gap: true },
        { title: "Settings", icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className={`admin-sidebar ${!isExpanded ? 'collapsed' : ''}`}>
            <button 
                className={`sidebar-toggle ${!isExpanded ? 'rotate' : ''}`}
                onClick={onToggle}
            >
                <ArrowRight size={20} />
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
                    NRCP
                </h1>
            </div>

            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li 
                        key={index}
                        className={`menu-item ${item.gap ? 'gap-top' : ''} ${activeMenu === item.title ? 'active' : ''}`}
                        onClick={() => onMenuSelect(item.title)}
                    >
                        <div className="menu-content">
                            <span className="menu-icon">{item.icon}</span>
                            <span className={`menu-title ${!isExpanded ? 'hide' : ''}`}>
                                {item.title}
                            </span>
                        </div>
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