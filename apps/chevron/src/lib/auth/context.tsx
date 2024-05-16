"use client";

import { createContext, useContext } from "react";
import type { Session } from ".";

const SessionContext = createContext<{
	session: Session;
} | null>(null);

export const SessionProvider = ({
	children,
	session,
}: { session: Session; children: React.ReactNode }) => {
	return (
		<SessionContext.Provider value={{ session }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context.session;
};
