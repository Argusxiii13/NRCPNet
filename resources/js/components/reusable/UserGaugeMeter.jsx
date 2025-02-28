import React from 'react';
import { UserCheck } from 'lucide-react';
import '../../../css/styles/reusable/UserGaugeMeter.css';

const UserGaugeMeter = ({ currentUsers, maxCapacity = 1000 }) => {
  // Calculate percentage of users logged in
  const percentage = Math.min(Math.max((currentUsers / maxCapacity) * 100, 0), 100);
  
  // Calculate the angle for the gauge needle (from -90 to 90 degrees)
  const angle = (percentage * 1.8) - 90;
  
  // Determine color based on attendance percentage
  const getGaugeColor = () => {
    if (percentage < 30) return '#4c6ef5'; // Blue for low attendance
    if (percentage < 70) return '#52c41a'; // Green for medium attendance
    return '#faad14'; // Orange for high attendance (near capacity)
  };

  return (
    <div className="user-gauge-meter">
      <div className="gauge-header">
        <UserCheck size={20} />
        <h3>Current Attendance</h3>
      </div>
      
      <div className="gauge-container">
        {/* Create a hidden div to maintain aspect ratio */}
        <div style={{ paddingBottom: '50%', width: '100%', visibility: 'hidden' }}></div>
        
        {/* Gauge background arc */}
        <svg viewBox="0 0 200 100" className="gauge-svg">
          {/* Background track */}
          <path 
            d="M20 100 A 80 80 0 0 1 180 100"
            className="gauge-background"
          />
          
          {/* Value arc */}
          <path 
            d={`M20 100 A 80 80 0 0 1 ${20 + (160 * percentage / 100)} ${100 - Math.sin(percentage * Math.PI / 100) * 80}`}
            style={{ stroke: getGaugeColor() }}
            className="gauge-value"
          />
          
          {/* Gauge needle */}
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="20"
            className="gauge-needle"
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px' }}
          />
          
          {/* Center point of needle */}
          <circle cx="100" cy="100" r="6" className="gauge-center" />
        </svg>
      </div>
      
      <div className="gauge-stats">
        <div className="current-value">
          <strong>{currentUsers}</strong>
          <span>users online</span>
        </div>
        <div className="max-value">
          <span>of</span>
          <strong>{maxCapacity}</strong>
        </div>
      </div>
    </div>
  );
};

export default UserGaugeMeter;