import "@/styles/globals.css";

import { GeistSans as FontSans } from "geist/font/sans";
import { Roboto_Slab as FontSerif } from "next/font/google";

import { RootProvider } from "@/components/provider/root-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { cn } from "@itell/core/utils";
import type { Metadata } from "next";
import { LoginRefresher } from "./login-refreser";

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();
	return {
		title: {
			default: siteConfig.title,
			template: `%s | ${siteConfig.title}`,
		},
		description: siteConfig.description,
	};
}

const fontSerif = FontSerif({
	subsets: ["latin"],
	variable: "--font-serif",
});

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const { latex, favicon } = await getSiteConfig();
	const session = await getSession();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/x-icon" href={favicon || "/favicon.ico"} />
				{latex && (
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
						integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
						crossOrigin="anonymous"
					/>
				)}
			</head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					FontSans.className,
					fontSerif.variable,
				)}
			>
				<LoginRefresher />
				<RootProvider session={session}>
					<TailwindIndicator />
					<main> {children} </main>
				</RootProvider>
			</body>
		</html>
	);
}
