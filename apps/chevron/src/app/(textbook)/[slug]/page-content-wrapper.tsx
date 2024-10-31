import React from "react";

export function PageContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Elements.TEXTBOOK_MAIN
  return (
    <div
      className="min-h-screen py-6"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr min(85ch, calc(100% - 64px)) 1fr",
      }}
    >
      <div className="col-span-1 col-start-2">{children}</div>
    </div>
  );
}
