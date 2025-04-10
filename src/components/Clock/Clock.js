import React, { useState, useEffect } from "react";
import './Clock.css'; // Ensure the correct import for styling

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Format day as "Sat"
  const formatDay = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short", // Short form of the day (e.g., "Sat")
    });
  };

  // Format time as "16:25:25"
  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
    });
  };

  return (
    <div className="clock">
      <span>{formatDay(currentTime)}</span>
      <span>{formatTime(currentTime)}</span>
    </div>
  );
};

export default Clock;
