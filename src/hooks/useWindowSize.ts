// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
