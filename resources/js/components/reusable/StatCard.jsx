import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from '../../../css/styles/reusable/StatCard.module.css'; // Updated to use .module.css

const StatCard = ({ title, count, change, isIncrease, icon }) => {
  return (
    <div className={styles['stat-card']}>
      <div className={styles['stat-card-header']}>
        <h3 className={styles['stat-title']}>{title}</h3>
        <div className={styles['stat-icon']}>{icon}</div>
      </div>
      <div className={styles['stat-value']}>{count}</div>
      <div className={`${styles['stat-change']} ${isIncrease ? styles['increase'] : styles['decrease']}`}>
        {isIncrease ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change} from yesterday</span>
      </div>
    </div>
  );
};

export default StatCard;