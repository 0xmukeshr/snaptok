import React, { useState, useEffect } from 'react';

interface TimerProps {
  isActive: boolean;
  duration: number;
  onComplete: () => void;
  showMinutes?: boolean;
}

const Timer: React.FC<TimerProps> = ({ isActive, duration, onComplete, showMinutes = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, duration, onComplete]);

  const formatTime = (seconds: number) => {
    if (!showMinutes) return seconds;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-20 h-20 rounded-full border-4 border-gray-800 flex items-center justify-center bg-white">
      <span className="font-bold text-xl">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;