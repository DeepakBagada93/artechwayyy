
'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const scrollProgress = (scrollPosition / totalHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);

    // Call it once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Progress 
      value={progress} 
      className="fixed top-0 left-0 right-0 h-1 rounded-none z-50 bg-transparent [&>div]:bg-primary"
    />
  );
}
