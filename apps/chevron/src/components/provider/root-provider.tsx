"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="light">
			{children}
			<Toaster richColors closeButton />
		</ThemeProvider>
	);
};
