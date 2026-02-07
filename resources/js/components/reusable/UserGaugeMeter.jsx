import React from 'react';
import { UserCheck } from 'lucide-react';
import { 
  GaugeContainer, 
  GaugeValueArc, 
  GaugeReferenceArc, 
  useGaugeState 
} from '@mui/x-charts/Gauge';
import styles from '../../../css/styles/reusable/UserGaugeMeter.module.css'; 


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
  
  const percentage = Math.min(Math.max((currentUsers / maxCapacity) * 100, 0), 100);
  
  
  const getGaugeColor = () => {
    if (percentage < 30) return '#4c6ef5'; 
    if (percentage < 70) return '#52c41a'; 
    return '#faad14'; 
  };

  return (
    <div className={styles['user-gauge-meter']}>
      <div className={styles['gauge-header']}>
        <UserCheck size={20} />
        <h3 className={styles['header-title']}>Current Attendance</h3>
      </div>
      
      <div className={styles['gauge-container']}>
        <GaugeContainer
          width={325}
          height={225}
          startAngle={-90}
          endAngle={90}
          value={percentage}
          valueMin={0}
          valueMax={100}
          cornerRadius={8}
          sx={{
            '& .MuiChartsGauge-valueArc': {
              fill: getGaugeColor(),
              transition: 'all 0.5s ease',
              strokeWidth: 12
            },
            '& .MuiChartsGauge-referenceArc': {
              fill: '#f0f0f0',
              strokeWidth: 12
            }
          }}
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
          <GaugePointer />
        </GaugeContainer>
      </div>
      
      <div className={styles['gauge-stats']}>
        <div className={styles['current-value']}>
          <strong className={styles['user-count']}>{currentUsers}</strong>
          <span className={styles['user-label']}>users online</span>
        </div>
      </div>
    </div>
  );
};

export default UserGaugeMeter;