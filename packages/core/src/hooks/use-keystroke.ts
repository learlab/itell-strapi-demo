"use client";

import { useCallback, useEffect, useRef } from "react";

// keycode, cursor position, downtime, uptime
type KeystrokeEvent = [string, number, number, number, boolean];

export const useKeystroke = () => {
  const ref = useRef<HTMLElement>(null);
  const keys = useRef<Map<string, number>>(new Map());
  const data = useRef<KeystrokeEvent[]>([]);

  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);

  const handleKeydown = (e: KeyboardEvent) => {
    keys.current.set(e.code, e.timeStamp);
  };

  const handleKeyup = (e: KeyboardEvent) => {
    const keyDowntime = keys.current.get(e.code);
    if (keyDowntime) {
      const d = [
        e.code,
        (ref.current as HTMLTextAreaElement).selectionStart,
        keyDowntime,
        e.timeStamp,
        isMobileDevice,
      ] as KeystrokeEvent;
      data.current.push(d);
    }
    console.log(e.code);
  };

  const clear = useCallback(() => {
    data.current = [];
  }, []);

  useEffect(() => {
    ref.current?.addEventListener("keydown", handleKeydown);
    ref.current?.addEventListener("keyup", handleKeyup);

    return () => {
      ref.current?.removeEventListener("keydown", handleKeydown);
      ref.current?.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  return { ref, data: data.current, clear };
};
