"use client";

import { useEffect, useRef } from "react";

import { cn } from "@itell/utils";
import { BanIcon } from "lucide-react";

export const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  enabled: boolean
) => {
  useEffect(() => {
    if (textAreaRef && enabled) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value]);
};

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  autoHeight?: boolean;
  disabledText?: string;
}

export function TextArea({
  className,
  value = undefined,
  onValueChange,
  autoFocus = false,
  autoHeight = false,
  disabled,
  disabledText,
  ...props
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(ref.current, value || "", autoHeight);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, []);

  return (
    <div className="relative">
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e.currentTarget.value);
          }
        }}
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {disabled ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex cursor-not-allowed items-center justify-center gap-2 bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out">
          {disabledText}
          <BanIcon size={24} className="text-muted-foreground" />
        </div>
      ) : null}
    </div>
  );
}
