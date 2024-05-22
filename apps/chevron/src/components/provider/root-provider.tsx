"use client";

import { Session } from "@/lib/auth";
import { SessionProvider } from "@/lib/auth/context";
import { Toaster } from "sonner";
import { ThemeProvider } from "../theme/theme-provider";

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
