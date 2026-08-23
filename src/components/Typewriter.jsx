'use client';
import { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }
    
    let i = 0;
    const len = text.length;
    // ensure the whole block finishes typing in at most 1.5 seconds
    const totalTime = 1500;
    const steps = totalTime / speed;
    const chunkSize = Math.max(1, Math.ceil(len / steps));

    setDisplayed('');
    const timer = setInterval(() => {
      if (i < len) {
        i = Math.min(i + chunkSize, len);
        setDisplayed(text.substring(0, i));
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <>{displayed}</>;
}
