'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isError?: boolean;
  onClose: () => void;
}

export default function Toast({ message, isError = false, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);



    return () => {
      clearTimeout(timer);
      clearTimeout(enterTimer);
    };
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ${
        isError ? 'bg-red-500' : 'bg-green-500'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      {message}
    </div>
  );
}
