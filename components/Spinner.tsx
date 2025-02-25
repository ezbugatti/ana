import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export default function Spinner({ 
  size = 'medium', 
  color = 'border-blue-500', 
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16'
  };
  
  return (
    <div className={`animate-spin rounded-full border-t-4 ${color} border-solid ${sizeClasses[size]} ${className}`}></div>
  );
} 