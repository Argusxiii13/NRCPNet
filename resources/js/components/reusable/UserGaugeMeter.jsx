import React from 'react';
import { UserCheck } from 'lucide-react';
import { 
  GaugeContainer, 
  GaugeValueArc, 
  GaugeReferenceArc, 
  useGaugeState 
} from '@mui/x-charts/Gauge';

// Custom gauge pointer component
function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  
  if (valueAngle === null) {
    return null;
  }
  
  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#666" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="#666"
        strokeWidth={3}
      />
    </g>
  );
}

const UserGaugeMeter = ({ currentUsers, maxCapacity = 1000 }) => {
  // Calculate percentage of users logged in
  const percentage = Math.min(Math.max((currentUsers / maxCapacity) * 100, 0), 100);
  
  // Determine color based on attendance percentage
  const getGaugeColor = () => {
    if (percentage < 30) return '#4c6ef5'; // Blue for low attendance
    if (percentage < 70) return '#52c41a'; // Green for medium attendance
    return '#faad14'; // Orange for high attendance (near capacity)
  };

  return (
    <div className="user-gauge-meter" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e1e4e8',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div className="gauge-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',

      }}>
        <UserCheck size={20} />
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#495057',

        }}>Current Attendance</h3>
      </div>
      
      <div className="gauge-container" style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        minHeight: '0'
      }}>
        <GaugeContainer
          width={325} // Enlarged from 200 to 250 (25% increase)
          height={225} // Enlarged from 120 to 150 (25% increase)
          startAngle={-90}
          endAngle={90}
          value={percentage}
          valueMin={0}
          valueMax={100}
          cornerRadius={8} // Slightly increased for proportion
          sx={{
            '& .MuiChartsGauge-valueArc': {
              fill: getGaugeColor(),
              transition: 'all 0.5s ease',
              strokeWidth: 12 // Thicker arc
            },
            '& .MuiChartsGauge-referenceArc': {
              fill: '#f0f0f0',
              strokeWidth: 12 // Thicker arc
            }
          }}
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
          <GaugePointer />
        </GaugeContainer>
      </div>
      
      <div className="gauge-stats" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <div className="current-value" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <strong style={{
            fontSize: '28px', // Enlarged from 24px
            color: '#212529'
          }}>{currentUsers}</strong>
          <span style={{
            fontSize: '14px', // Enlarged from 12px
            color: '#6c757d'
          }}>users online</span>
        </div>
      </div>
    </div>
  );
};

export default UserGaugeMeter;