import { GeistSans as FontSans } from "geist/font";
import { IBM_Plex_Mono as FontMono } from "next/font/google";
import "@/styles/globals.css";
import ShowToast from "@/components/toast";
import { Suspense } from "react";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@itell/core/utils";
import { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { RootProvider } from "@/components/provider/root-provider";

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

const fontMono = FontMono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-mono",
});

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const { favicon } = await getSiteConfig();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/x-icon" href={favicon || "/favicon.ico"} />
			</head>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					FontSans.className,
					fontMono.variable,
				)}
			>
				<RootProvider>
					<Suspense fallback={null}>
						<ShowToast />
					</Suspense>
					<TailwindIndicator />
					<main>{children}</main>
				</RootProvider>
			</body>
		</html>
	);
}
