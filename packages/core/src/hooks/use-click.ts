"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "./utils";

export type ClickEventData = {
  x: number;
  y: number;
  timestamp: number;
  element: string;
};

type State = {
  event: MouseEvent;
  data: ClickEventData;
};

type Props = {
  onEvent: (data: ClickEventData, event: MouseEvent) => void;
};

export const useClick = ({ onEvent }: Props) => {
  const [state, setState] = useState<State>();
  const stateDebounced = useDebounce(state, 500);

  const handler = (event: MouseEvent) => {
    const element = event.target as HTMLElement;
    const eventData: ClickEventData = {
      x: event.x,
      y: event.y,
      element: `${element.tagName}-${element.textContent?.slice(0, 20)}`,
      timestamp: Date.now(),
    };
    setState({ event, data: eventData });
  };

  useEffect(() => {
    window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (stateDebounced) {
      onEvent(stateDebounced.data, stateDebounced.event);
    }
  }, [stateDebounced]);
};
