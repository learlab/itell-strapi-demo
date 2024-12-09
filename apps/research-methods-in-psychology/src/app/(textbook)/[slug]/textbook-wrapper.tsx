import React from "react";

export function TextbookWrapper({ children }: { children: React.ReactNode }) {
  // Elements.TEXTBOOK_MAIN_WRAPPER
  return (
    <main
      id="textbook-wrapper"
      className="grid min-h-screen grid-cols-[1fr_3fr] lg:grid-cols-[360px,1fr]"
    >
      {children}
    </main>
  );
}
