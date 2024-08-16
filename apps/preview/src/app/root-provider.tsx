"use client";

import { ThemeProvider } from "next-themes";
import "@itell/js-sandbox/dist/style.css";

export default function RootProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" enableSystem>
			{children}
		</ThemeProvider>
	);
}
