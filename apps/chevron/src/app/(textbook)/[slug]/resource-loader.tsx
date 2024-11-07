"use client";

import { useEffect } from "react";
import { preconnect } from "react-dom";

import { env } from "@/env.mjs";

export function ResourceLoader() {
  useEffect(() => {
    preconnect(env.NEXT_PUBLIC_API_URL);
  }, []);

  return <></>;
}
