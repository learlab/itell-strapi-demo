import React, { useRef, useState } from "react";
import { Input } from "@itell/ui/input";
import { cn } from "@itell/utils";

type ShowLetterFn = (word: string) => number;

// Number of letters to reveal from the beginning, or a function that returns the starting index
export type ShowLetter = number | ShowLetterFn;

interface Props {
  word: string;
  showLetter: ShowLetter;
  isTarget?: boolean;
  className?: string;
}

export function WordItem({
  word,
  showLetter = 0,
  isTarget = false,
  className,
}: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isTarget) {
    return <span>{word}</span>;
  }

  const letters = word.split("");

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < letters.length) {
      focusInput(nextIndex);
    }
  };

  const handlePrev = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      focusInput(prevIndex);
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  // TODO: figure out if we should support showLetter to be a function
  // if we do if might need to be a server action to be passed to here
  const startMaskIdx = typeof showLetter === "function" ? 0 : showLetter;

  return (
    <fieldset
      data-target-word={word}
      className={cn(
        "inline-flex items-center gap-1 px-1 transition-opacity duration-300",
        className
      )}
    >
      {letters.map((letter, index) =>
        index < startMaskIdx ? (
          <Letter key={index} letter={letter} />
        ) : (
          <LetterInput
            letter={letter}
            key={index}
            ref={setInputRef(index)}
            onNext={() => handleNext(index)}
            onPrev={() => handlePrev(index)}
          />
        )
      )}
    </fieldset>
  );
}

interface LetterProps {
  letter: string;
}

function Letter({ letter }: LetterProps) {
  return (
    <Input
      className="size-8 bg-muted px-1.5 text-center text-base text-muted-foreground lg:text-lg"
      type="text"
      defaultValue={letter}
      data-is-target={false}
      readOnly
    />
  );
}

interface LetterInputProps {
  letter: string;
  ref: (_: HTMLInputElement) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

function LetterInput({ letter, onNext, onPrev, ref }: LetterInputProps) {
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "ArrowLeft") {
      e.preventDefault();
      onPrev?.();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext?.();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      const value = e.currentTarget.value;
      e.currentTarget.value = "";
      if (value === "") {
        onPrev?.();
      } else {
        e.currentTarget.value = "";
        setIsCorrect(undefined);
      }
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setIsCorrect(undefined);
      return;
    }
    setIsCorrect(newValue === letter);
    onNext?.();
  };

  return (
    <Input
      required
      data-is-target={true}
      ref={ref}
      type="text"
      maxLength={1}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "size-8 bg-muted px-1.5 text-center text-base focus-visible:ring-info lg:text-lg",
        isCorrect === true
          ? "border-green-400 bg-green-50"
          : isCorrect === false
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white"
      )}
    />
  );
}
