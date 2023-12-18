"use client";

import { Provider as BalancerProvider } from "react-wrap-balancer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TRPCProvider } from "@/trpc/trpc-provider";
import { ThemeProvider } from "../theme/theme-provider";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SessionProvider>
			<TRPCProvider>
				<BalancerProvider>
					<ThemeProvider attribute="class" defaultTheme="light">
						{children}
						<Toaster richColors />
					</ThemeProvider>
				</BalancerProvider>
			</TRPCProvider>
		</SessionProvider>
	);
};
