"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Toaster richColors closeButton />
      {children}
    </ThemeProvider>
  );
}
