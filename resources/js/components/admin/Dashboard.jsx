import React from 'react';
import { UserCheck, MessageSquare, Megaphone } from 'lucide-react';
import StatCard from '../reusable/StatCard'; // Adjust import path as needed
import LineGraph from '../reusable/LineGraph'; // Adjust import path as needed
import UserGaugeMeter from '../reusable/UserGaugeMeter'; // Import the new component
import '../../../css/styles/admin/Dashboard.css'; // Import the dashboard CSS

const Dashboard = () => {
  // Sample data for stat cards
  const stats = [
    {
      title: "Users Logged In",
      count: "857",
      change: "+15.3%",
      isIncrease: true,
      icon: <UserCheck size={24} />
    },
    {
      title: "Requests Received",
      count: "1,245",
      change: "+7.8%",
      isIncrease: true,
      icon: <MessageSquare size={24} />
    },
    {
      title: "Announcements Made",
      count: "36",
      change: "-2.7%",
      isIncrease: false,
      icon: <Megaphone size={24} />
    }
  ];

  // Current user attendance data
  const currentUsers = 857; // Same as your stat card for consistency
  const maxCapacity = 1200;

  return (
    <div className="dashboard">
      <div className="panel">
        <div className="panel-header">
          <div className="header-content">
            <h2>Dashboard Overview</h2>
          </div>
        </div>
        
        <div className="panel-content">
          {/* First row: Stat cards */}
          <div className="stat-cards-container">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                count={stat.count}
                change={stat.change}
                isIncrease={stat.isIncrease}
                icon={stat.icon}
              />
            ))}
          </div>
          
          {/* Second row: Line graph (2/3) and User Gauge (1/3) */}
          <div className="chart-row">
            <div className="chart-area">
              <LineGraph title="User Activity (Today)" />
            </div>
            <div className="user-gauge-area">
              <UserGaugeMeter 
                currentUsers={currentUsers} 
                maxCapacity={maxCapacity} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;