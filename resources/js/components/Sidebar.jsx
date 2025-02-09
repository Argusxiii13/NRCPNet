import React from 'react';
import { FileText, Download, Star, Bell, Settings, Headphones, CircleDollarSign, ShieldQuestion, Gem, AlignJustify } from 'lucide-react';
import '../styles/Sidebar.css'; // Correct path to styles

const Sidebar = ({ isExpanded, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                {isExpanded && (
                    <img 
                        src="/path/to/your/image.jpg" // Placeholder for the circular image
                        alt="Logo"
                        className="profile-image" // Class for styling
                    />
                )}
                {isExpanded && <h2 className="sidebar-title">NRCP NET</h2>}
            </div>
            <button className="sidebar-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <AlignJustify />
            </button>
            <ul className="sidebar-items">
                <li><FileText className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Memos</span></li>
                <li><Download className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Downloads</span></li>
                <li><Star className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Special</span></li>
            </ul>
            <hr className="divider" />
            <ul className="sidebar-items">
                <li><Bell className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Notifications</span></li>
                <li><Settings className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Settings</span></li>
                <li><Headphones className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Support</span></li>
            </ul>
            <hr className="divider" />
            <ul className="sidebar-items last-section">
                <li><Gem className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> Office of the President</span></li>
                <li><ShieldQuestion className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> FAO</span></li>
                <li><ShieldQuestion className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> RDMD</span></li>
                <li><CircleDollarSign className="item-icon" /><span className={isExpanded ? '' : 'hidden-text'}> FAD</span></li>
            </ul>
        </div>
    );
};

export default Sidebar;