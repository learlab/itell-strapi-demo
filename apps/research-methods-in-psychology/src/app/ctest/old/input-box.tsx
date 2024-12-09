import React, { forwardRef } from 'react';
import { cn } from '@itell/utils';

interface ExtendedInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  isCorrect: boolean;
  showFeedback: boolean;
  size?: 'sm' | 'md' | 'lg';
  onNext?: () => void;
  onPrev?: () => void;
}

export const InputBox = forwardRef<HTMLInputElement, ExtendedInputBoxProps>(({
  value,
  onChange,
  isCorrect,
  showFeedback,
  size = "sm",
  onNext,
  onPrev
}, ref) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-10 h-10 text-lg"
  };
  
  const feedbackClasses = showFeedback
    ? isCorrect
      ? "bg-green-50 border-green-400"
      : value
        ? "bg-red-50 border-red-400"
        : "border-gray-300 bg-white"
    : "border-gray-300 bg-white";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value) {
      e.preventDefault();
      onPrev?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 1) {
      onChange(newValue);
      if (newValue.length === 1) {
        onNext?.();
      }
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      maxLength={1}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "border rounded-md",
        "text-center",
        "focus:outline-none focus:ring-2 focus:ring-blue-400",
        sizeClasses[size],
        feedbackClasses
      )}
    />
  );
});

InputBox.displayName = 'InputBox';