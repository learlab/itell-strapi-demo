"use client";

import { useEffect, useState } from "react";

import { animate, Easing, useMotionValue } from "framer-motion";

type Options = {
  delimiter?: string;
  ease?: Easing;
};

export const useAnimatedText = (text: string, options?: Options) => {
  let animatedCursor = useMotionValue(0);
  let [cursor, setCursor] = useState(0);
  let [prevText, setPrevText] = useState(text);
  let [isSameText, setIsSameText] = useState(true);

  if (prevText !== text) {
    setPrevText(text);
    setIsSameText(text.startsWith(prevText));

    if (!text.startsWith(prevText)) {
      setCursor(0);
    }
  }

  useEffect(() => {
    if (!isSameText) {
      animatedCursor.jump(0);
    }

    let controls = animate(
      animatedCursor,
      options?.delimiter ? text.split(options.delimiter).length : text.length,
      {
        duration: 3,
        ease: options?.ease ?? "easeOut",
        onUpdate(latest) {
          setCursor(Math.floor(latest));
        },
      }
    );

    return () => controls.stop();
  }, [animatedCursor, isSameText, text]);

  if (options?.delimiter) {
    return text
      .split(options.delimiter)
      .slice(0, cursor)
      .join(options.delimiter);
  }

  return text.slice(0, cursor);
};
