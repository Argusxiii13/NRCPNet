// LinkList.jsx
import React from 'react';
import styles from '../../../css/styles/landing/LinkList.module.css';

const logo = '/image/CompanyLogo.jpg';

const LinkList = () => {
    const links = [
        { url: '#system1' },
        { url: '#system2' },
        { url: '#system3' },
        { url: '#system4' },
        { url: '#system5' },
        { url: '#system6' },
    ];

    return (
        <div className={styles['linklist-container']}>
            <h3 className={styles['linklist-title']}>Other Links and Systems</h3>
            <div className={styles['linklist']}>
                <div className={styles['linklist-items']}>
                    {links.map((link, index) => (
                        <div key={index} className={styles['link-item-container']}>
                            <a href={link.url} className={styles['linklist-item']}>
                                <img 
                                    src={logo} 
                                    alt="Company Logo" 
                                    className={styles['link-item-logo']} 
                                    onError={(e) => { e.target.src = '/image/placeholder.jpg'; }}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LinkList;
