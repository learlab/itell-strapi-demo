"use client";

import { SandboxProvider } from "@itell/js-sandbox/provider";
import { ThemeProvider } from "next-themes";

export default function RootProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<SandboxProvider>
			<ThemeProvider attribute="class" enableSystem>
				{children}
			</ThemeProvider>
		</SandboxProvider>
	);
}
