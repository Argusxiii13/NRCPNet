import React from 'react';
import { Search } from 'lucide-react';
import styles from '../../../css/styles/admin/NavigationBar.module.css';
import { useAuth } from '../../hooks/useAuth'; // Updated import path as needed

const AdminHeader = () => {
    const departments = ['OP', 'OED', 'FAD', 'RDMD', 'RIDD'];
    const { user, isAuthenticated, loading } = useAuth();
    
    // Check if user is a Superadmin
    const isSuperadmin = user?.role === 'Superadmin';
    
    return (
        <header className={styles['admin-header']}>
            {/* Left Section */}
            <div className={`${styles['header-section']} ${styles['left-section']}`}>
                {/* Empty as requested */}
            </div>

            {/* Middle Section */}
            <div className={`${styles['header-section']} ${styles['middle-section']}`}>
                {!loading && isAuthenticated && isSuperadmin && (
                    <nav className={styles['department-nav']}>
                        {departments.map((dept, index) => (
                            <button
                                key={index}
                                className={styles['department-btn']}
                            >
                                {dept}
                            </button>
                        ))}
                    </nav>
                )}
            </div>

            {/* Right Section */}
            <div className={`${styles['header-section']} ${styles['right-section']}`}>
                <div className={styles['search-container']}>
                    <Search size={20} className={styles['search-icon']} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles['search-input']}
                    />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;