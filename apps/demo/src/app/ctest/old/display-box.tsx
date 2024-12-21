import React from 'react';
import { cn } from '@itell/utils';

interface DisplayBoxProps {
  value: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DisplayBox: React.FC<DisplayBoxProps> = ({
  value,
  size = "sm"
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-10 h-10 text-lg"
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      "border border-gray-200 rounded-md bg-gray-50",
      "text-gray-900 font-medium",
      sizeClasses[size]
    )}>
      {value}
    </div>
  );
};