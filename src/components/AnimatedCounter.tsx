import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface AnimatedCounterProps {
  value: number;
  label: string;
  color: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, label, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const props = useSpring({
    value: isVisible ? value : 0,
    from: { value: 0 },
    config: { duration: 1000 }
  });
  
  const circleProps = useSpring({
    from: { strokeDashoffset: 283 },
    to: { strokeDashoffset: 283 - (283 * Math.min(value / 100, 1)) },
    delay: 300,
    config: { duration: 1000 }
  });
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="8"
          />
          <animated.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={circleProps.strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <animated.span className="text-2xl font-bold">
            {props.value.to((val) => Math.floor(val))}
          </animated.span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
};

export default AnimatedCounter;