"use client";

import { useEffect } from "react";
import { Error as NextError } from "next/error";
import * as Sentry from "@sentry/nextjs";

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
