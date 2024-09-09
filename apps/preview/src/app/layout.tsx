import "@/styles/globals.css";
import { cn } from "@itell/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { Toaster } from "sonner";
import RootProvider from "./root-provider";

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
				<link rel="icon" href="/itell.svg" sizes="any" />
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
					<main className="flex flex-col gap-4 p-4 lg:p-8 ">
						<Toaster richColors />
						{children}
					</main>
				</RootProvider>
			</body>
		</html>
	);
}
