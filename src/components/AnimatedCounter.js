import React, { useEffect, useState, useRef } from "react";
import { Text } from "react-native";

const AnimatedCounter = ({ value, duration = 800, style }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = typeof value === "number" ? value : parseInt(value, 10) || 0;
  const countRef = useRef(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * targetValue);
      
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [targetValue, duration]);

  return <Text style={style}>{displayValue}</Text>;
};

export default AnimatedCounter;
