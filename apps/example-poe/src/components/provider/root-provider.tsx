"use client";

import { Provider as BalancerProvider } from "react-wrap-balancer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TRPCProvider } from "@/trpc/trpc-provider";

import { ThemeProvider } from "next-themes";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SessionProvider>
			<TRPCProvider>
				<BalancerProvider>
					<ThemeProvider attribute="class" defaultTheme="light">
						<Toaster richColors />
						{children}
					</ThemeProvider>
				</BalancerProvider>
			</TRPCProvider>
		</SessionProvider>
	);
};
