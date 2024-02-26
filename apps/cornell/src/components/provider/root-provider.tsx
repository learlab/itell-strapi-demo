"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "../theme/theme-provider";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SessionProvider>
			<ThemeProvider attribute="class" defaultTheme="light">
				{children}
				<Toaster richColors closeButton />
			</ThemeProvider>
		</SessionProvider>
	);
};
