
'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  words: string[];
  wait?: number;
}

export function Typewriter({ words, wait = 2000 }: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef(150);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
      const currentWord = words[currentWordIndex];
      const updatedText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentWord) {
        // Pause at end of word before starting to delete
        typingTimeout = setTimeout(() => {
          setIsDeleting(true);
        }, wait);
        typingSpeedRef.current = 100;
      } else if (isDeleting && updatedText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        typingSpeedRef.current = 150;
      } else {
        // Continue typing or deleting
        typingTimeout = setTimeout(handleTyping, typingSpeedRef.current);
      }
    };

    typingTimeout = setTimeout(handleTyping, typingSpeedRef.current);

    return () => clearTimeout(typingTimeout);
  }, [text, isDeleting, currentWordIndex, words, wait]);

  return (
    <span className="text-primary border-r-2 border-primary animate-pulse">
      {text}
    </span>
  );
}
