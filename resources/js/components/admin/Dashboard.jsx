import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import '../../../css/styles/admin/Dashboard.css';

const Dashboard = () => {
  // References for chart canvases
  const chartRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  
  // Chart instances
  const chartInstances = useRef([]);

  // Divisions
  const divisions = ['OP', 'OED', 'FAD', 'RDMD', 'RIDD'];
  
  // Colors for divisions (consistent across all charts)
  const divisionColors = [
    '#0ea5e9', // OP - Blue
    '#10b981', // OED - Green
    '#f59e0b', // FAD - Orange
    '#8b5cf6', // RDMD - Purple
    '#ef4444'  // RIDD - Red
  ];

  // Sample data for charts
  const chartData = [
    {
      title: 'User Logged In',
      data: {
        labels: divisions,
        datasets: [{
          data: [45, 32, 28, 36, 24],
          backgroundColor: divisionColors,
          borderWidth: 1,
          cutout: '65%'
        }]
      }
    },
    {
      title: 'Suggestions Received',
      data: {
        labels: divisions,
        datasets: [{
          data: [12, 8, 15, 10, 7],
          backgroundColor: divisionColors,
          borderWidth: 1,
          cutout: '65%'
        }]
      }
    },
    {
      title: 'Requests Received',
      data: {
        labels: divisions,
        datasets: [{
          data: [28, 22, 35, 18, 25],
          backgroundColor: divisionColors,
          borderWidth: 1,
          cutout: '65%'
        }]
      }
    },
    {
      title: 'Announcement Made',
      data: {
        labels: divisions,
        datasets: [{
          data: [5, 3, 4, 6, 2],
          backgroundColor: divisionColors,
          borderWidth: 1,
          cutout: '65%'
        }]
      }
    },
    {
      title: 'Events Due',
      data: {
        labels: divisions,
        datasets: [{
          data: [3, 2, 4, 1, 3],
          backgroundColor: divisionColors,
          borderWidth: 1,
          cutout: '65%'
        }]
      }
    }
  ];

  // Helper function to calculate the total for each chart
  const calculateTotal = (dataArray) => {
    return dataArray.reduce((sum, value) => sum + value, 0);
  };

  useEffect(() => {
    // Plugin for adding text in the center
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart) => {
        const { ctx, width, height, _metasets } = chart;
        const dataIndex = chartInstances.current.indexOf(chart);
        
        if (dataIndex !== -1) {
          const data = chartData[dataIndex].data.datasets[0].data;
          const total = calculateTotal(data);
          
          // Clear the center area
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, chart.innerRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          
          // Draw total text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Draw total value in large font
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#333';
          ctx.fillText(total, width / 2, height / 2 - 10);
          
          // Draw "Total" label in smaller font
          ctx.font = '14px Arial';
          ctx.fillStyle = '#666';
          ctx.fillText('Total', width / 2, height / 2 + 15);
        }
      }
    };

    // Register the plugin
    Chart.register(centerTextPlugin);

    // Initialize charts
    chartRefs.forEach((ref, index) => {
      // Destroy existing chart if it exists
      if (chartInstances.current[index]) {
        chartInstances.current[index].destroy();
      }
      
      // Create new chart
      if (ref.current) {
        chartInstances.current[index] = new Chart(ref.current, {
          type: 'doughnut',
          data: chartData[index].data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              title: {
                display: true,
                text: chartData[index].title + ' (Today)',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {
                  top: 10,
                  bottom: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}`;
                  }
                }
              }
            }
          }
        });
      }
    });

    // Cleanup function
    return () => {
      chartInstances.current.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="panel">
        <div className="panel-header">
          <div className="header-content">
            <h2>Dashboard Overview</h2>
          </div>
        </div>
        
        <div className="panel-content">
          <div className="chart-grid">
            {chartRefs.map((ref, index) => (
              <div key={index} className="chart-container">
                <canvas ref={ref}></canvas>
              </div>
            ))}
            {/* Empty grid space to complete the 3x2 grid */}
            <div className="chart-container empty-chart"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;