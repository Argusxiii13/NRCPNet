import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'Asia/Manila'
  };

  return (
    <div className="time-display">
      <div className="time-zone">Philippine Standard Time</div>
      <div className="current-time">
        {currentTime.toLocaleString('en-US', options)}
      </div>
    </div>
  );
};

export default TimeDisplay;