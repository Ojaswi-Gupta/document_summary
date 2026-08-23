'use client';
import { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 20 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }
    
    let i = 0;
    const len = text.length;
    
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < len) {
        // Type 1-2 characters per tick for a smooth, visible typing effect
        i += 1; 
        setDisplayed(text.substring(0, i));
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <>{displayed}</>;
}
