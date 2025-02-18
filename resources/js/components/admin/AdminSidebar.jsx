// AdminSidebar.jsx
import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  Database
} from 'lucide-react';
import '../../../css/styles/admin/AdminSidebar.css';

const AdminSidebar = ({ collapsed, onToggle }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="/admin/dashboard" className="sidebar-link">
              <Home size={20} />
              {!collapsed && <span>Dashboard</span>}
            </a>
          </li>
          <li>
            <a href="/admin/users" className="sidebar-link">
              <Users size={20} />
              {!collapsed && <span>Users</span>}
            </a>
          </li>
          <li>
            <a href="/admin/documents" className="sidebar-link">
              <FileText size={20} />
              {!collapsed && <span>Documents</span>}
            </a>
          </li>
          <li>
            <a href="/admin/database" className="sidebar-link">
              <Database size={20} />
              {!collapsed && <span>Database</span>}
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="sidebar-link">
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </a>
          </li>
        </ul>
      </nav>
      
      {!collapsed && (
        <div className="sidebar-footer">
          <p>NRCPNet Admin v1.0</p>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;