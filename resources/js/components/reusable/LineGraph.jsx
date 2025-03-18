import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import styles from '../../../css/styles/reusable/LineGraph.module.css';

// Register Chart.js components
Chart.register(...registerables);

const LineGraph = ({ title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Generate time intervals from 6:00 AM to 8:00 PM in 30-minute increments
    const timeLabels = [];
    for (let hour = 6; hour <= 20; hour++) {
      timeLabels.push(`${hour}:00`);
      if (hour < 20) {
        timeLabels.push(`${hour}:30`);
      }
    }
    
    // Generate sample data for each time interval
    const generateSampleData = () => {
      const baseUsers = 30;
      return timeLabels.map((_, index) => {
        // Create a realistic curve with morning increase, lunch dip, afternoon peak
        const timeOfDay = index / 2 + 6; // Convert to hour of day
        
        if (timeOfDay < 9) {
          // Morning ramp up (6am-9am)
          return baseUsers + (index * 15);
        } else if (timeOfDay < 12) {
          // Mid-morning peak (9am-12pm)
          return baseUsers + 150 + Math.sin((timeOfDay - 9) * 0.8) * 20;
        } else if (timeOfDay < 14) {
          // Lunch dip (12pm-2pm)
          return baseUsers + 120 - ((timeOfDay - 12) * 15);
        } else if (timeOfDay < 17) {
          // Afternoon work (2pm-5pm)
          return baseUsers + 100 + Math.sin((timeOfDay - 14) * 0.6) * 30;
        } else {
          // Evening decline (5pm-8pm)
          return baseUsers + 110 - ((timeOfDay - 17) * 20);
        }
      });
    };
    
    const userData = generateSampleData();
    
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'Active Users',
            data: userData,
            borderColor: '#4c6ef5',
            backgroundColor: 'rgba(76, 110, 245, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#4c6ef5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Users'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Time (30 min intervals)'
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: true,
                maxTicksLimit: 15
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles['line-graph']}>
      <div className={styles['line-graph-header']}>
        <h3>{title}</h3>
      </div>
      <div className={styles['line-graph-container']}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default LineGraph;