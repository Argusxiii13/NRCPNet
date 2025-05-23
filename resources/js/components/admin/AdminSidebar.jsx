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
    UserRoundCog,
    Link,
    Loader,
    House
} from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from '../../../css/styles/admin/AdminSidebar.module.css';
import { useAuth } from '../../hooks/useAuth'; // Import the auth hook

const AdminSidebar = ({ isExpanded, onToggle, activeMenu, onMenuSelect }) => {
    const logo = '/image/NRCP_logo----.png';
    const profilePic = '/image/SampleProfile.jpg';
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Use the auth hook to access user data and authentication functions
    const { user, logout: authLogout } = useAuth();
    
    // State to track which menus are expanded
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        { title: "Dashboard", icon: <Gauge size={20} /> },
        { title: "Calendar Management", icon: <CalendarCog size={20} /> },
        { title: "System Links", icon: <Link size={20} /> },
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
        { title: "Downloadable Forms", icon: <Newspaper size={20} /> },
        { title: "User Management", icon: <UserPlus size={20} /> },
        { title: "Personalization Management", icon: <UserCog size={20} />, gap: true },
    ];

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        try {
            // Get the CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            // Send the logout request
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });
            
            // Call the logout function from auth hook to clear local state
            authLogout();
            
            if (response.ok) {
                // Redirect to login page after successful logout
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
                // Still redirect to login even if server-side logout fails
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Clear user state via auth hook and redirect to login even if there's an error
            authLogout();
            window.location.href = '/login';
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Homepage navigation handler
    const handleHomeNavigation = () => {
        window.location.href = '/';
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
    
    // Format user's name for display
    const getUserDisplayName = () => {
        if (user && user.first_name && user.surname) {
            return `${user.first_name} ${user.surname}`;
        }
        return "Loading...";
    };
    
    // Get user's role
    const getUserRole = () => {
        if (user && user.role) {
            return user.role;
        }
        return "Loading...";
    };

    return (
        <div className={`${styles['admin-sidebar']} ${!isExpanded ? styles['collapsed'] : ''}`}>
            <button 
                className={`${styles['sidebar-toggle']} ${!isExpanded ? styles['rotate'] : ''}`}
                onClick={onToggle}
            >
                <ChevronLeft size={20} />
            </button>

            <div className={styles['sidebar-header']}>
                <div className={styles['logo-container']}>
                    <img 
                        src={logo} 
                        alt="NRCP Logo" 
                        className={`${styles['logo']} ${!isExpanded ? styles['spin-reverse'] : styles['spin']}`}
                    />
                </div>
                <h1 className={`${styles['sidebar-title']} ${!isExpanded ? styles['hide'] : ''}`}>
                    NRCPNet
                </h1>
            </div>

            <ul className={styles['menu-list']}>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <div 
                            className={`${styles['menu-item']} ${item.gap ? styles['gap-top'] : ''} ${item.hasSubmenu ? styles['has-submenu'] : ''} ${activeMenu === item.title || (item.hasSubmenu && item.submenu.some(sub => activeMenu === `${item.title}: ${sub.title}`)) ? styles['active'] : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <div className={styles['menu-content']}>
                                <span className={styles['menu-icon']}>{item.icon}</span>
                                <span className={`${styles['menu-title']} ${!isExpanded ? styles['hide'] : ''}`}>
                                    {item.title}
                                </span>
                                {item.hasSubmenu && isExpanded && (
                                    <span className={styles['submenu-arrow']}>
                                        {expandedMenus[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Submenu */}
                        {item.hasSubmenu && expandedMenus[item.title] && isExpanded && (
                            <ul className={styles['submenu-list']}>
                                {item.submenu.map((subItem, subIndex) => (
                                    <li 
                                        key={subIndex}
                                        className={`${styles['submenu-item']} ${activeMenu === `${item.title}: ${subItem.title}` ? styles['active'] : ''}`}
                                        onClick={(e) => handleSubmenuClick(item.title, subItem.title, e)}
                                    >
                                        <div className={styles['submenu-content']}>
                                            <span className={styles['submenu-icon']}>{subItem.icon}</span>
                                            <span className={styles['submenu-title']}>
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

            <div className={styles['sidebar-footer']}>
                <div className={styles['profile-header']}>
                    <div className={styles['profile-image-container']}>
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            className={styles['profile-image']}
                        />
                    </div>
                    <div className={`${styles['profile-info']} ${!isExpanded ? styles['hide'] : ''}`}>
                        <h3 className={styles['profile-name']}>{getUserDisplayName()}</h3>
                        <p className={styles['profile-role']}>{getUserRole()}</p>
                    </div>
                </div>
                
                {/* Homepage Button */}
                <div className={styles['menu-item']} onClick={handleHomeNavigation}>
                    <div className={styles['menu-content']}>
                        <span className={styles['menu-icon']}>
                            <House size={20} />
                        </span>
                        <span className={`${styles['menu-title']} ${!isExpanded ? styles['hide'] : ''}`}>
                            Homepage
                        </span>
                    </div>
                </div>
                
                {/* Logout Button */}
                <div className={styles['menu-item']} onClick={isLoggingOut ? undefined : handleLogout}>
                    <div className={styles['menu-content']}>
                        <span className={styles['menu-icon']}>
                            {isLoggingOut ? <Loader size={20} className={styles['spin-animation']} /> : <LogOut size={20} />}
                        </span>
                        <span className={`${styles['menu-title']} ${!isExpanded ? styles['hide'] : ''}`}>
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;