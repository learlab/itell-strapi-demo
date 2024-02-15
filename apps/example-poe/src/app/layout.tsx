import "@/styles/globals.css";

import { GeistSans as FontSans } from "geist/font";
import { Roboto_Slab as FontSerif } from "next/font/google";

import { RootProvider } from "@/components/provider/root-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { getSiteConfig } from "@/lib/config";
import { cn } from "@itell/core/utils";
import { Metadata } from "next";

type SiteConfig = {
	title: string;
	description: string;
	latex: boolean;
};

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
				<RootProvider>
					<TailwindIndicator />
					<main> {children} </main>
				</RootProvider>
			</body>
		</html>
	);
}
