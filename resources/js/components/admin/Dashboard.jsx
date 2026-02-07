import React from 'react';
import { UserCheck, MessageSquare, Megaphone } from 'lucide-react';
import StatCard from '../reusable/StatCard'; 
import LineGraph from '../reusable/LineGraph'; 
import UserGaugeMeter from '../reusable/UserGaugeMeter'; 
import styles from '../../../css/styles/admin/Dashboard.module.css'; 

const Dashboard = () => {
  
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

  
  const currentUsers = 857; 
  const maxCapacity = 1200;

  return (
    <div className={styles['dashboard']}>
      <div className={styles['panel']}>
        <div className={styles['panel-header']}>
          <div className={styles['header-content']}>
            <h2>Dashboard Overview</h2>
          </div>
        </div>
        
        <div className={styles['panel-content']}>
          {/* First row: Stat cards */}
          <div className={styles['stat-cards-container']}>
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
          <div className={styles['chart-row']}>
            <div className={styles['chart-area']}>
              <LineGraph title="User Activity (Today)" />
            </div>
            <div className={styles['user-gauge-area']}>
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
