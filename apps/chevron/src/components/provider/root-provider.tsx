"use client";

import { SessionProvider } from "@/components/provider/session-provider";
import { Session } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const RootProvider = ({
	children,
	session,
}: { children: React.ReactNode; session: Session }) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider attribute="class" defaultTheme="light">
				{children}
				<Toaster richColors closeButton />
			</ThemeProvider>
		</SessionProvider>
	);
};
