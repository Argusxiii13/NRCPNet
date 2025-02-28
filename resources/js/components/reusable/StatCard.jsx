import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../../../css/styles/reusable/StatCard.css'; // Import the CSS file

const StatCard = ({ title, count, change, isIncrease, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{count}</div>
      <div className={`stat-change ${isIncrease ? 'increase' : 'decrease'}`}>
        {isIncrease ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change} from yesterday</span>
      </div>
    </div>
  );
};

export default StatCard;