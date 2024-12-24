"use client";

import { Errorbox } from "@itell/ui/callout";

export default function ErrorPage() {
  return (
    <main className="w-full xl:mx-auto xl:max-w-3xl">
      <Errorbox>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </Errorbox>
    </main>
  );
}
