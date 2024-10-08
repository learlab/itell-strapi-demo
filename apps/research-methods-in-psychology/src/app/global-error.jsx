"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import { Error as NextError } from "next/error";

export default function GlobalError({ error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError />
      </body>
    </html>
  );
}
