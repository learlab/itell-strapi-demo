"use client";

import { SandboxProvider } from "@itell/js-sandbox/provider";
import { ThemeProvider } from "next-themes";
import "@itell/js-sandbox/dist/style.css";

export default function RootProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" enableSystem>
			<SandboxProvider>{children}</SandboxProvider>
		</ThemeProvider>
	);
}
