import "@/styles/globals.css";
import { cn } from "@itell/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import RootProvider from "./root-provider";
import "@/styles/code.css";
import { Toaster } from "sonner";

const FontSans = Inter({
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});
const FontMono = Fira_Code({
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	title: "Preview",
	description: "Markdown preview for iTELL CMS",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
					integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={cn(
					"min-h-screen bg-background text-foreground antialiased",
					FontSans.variable,
					FontMono.variable,
				)}
			>
				<RootProvider>
					<Toaster />
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
