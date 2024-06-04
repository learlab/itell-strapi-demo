"use client";

import { User } from "lucia";
import { createContext, useContext, useState } from "react";
import type { Session } from ".";

const SessionContext = createContext<{
	session: Session;
	setUser: (user: User | null) => void;
} | null>(null);

export const SessionProvider = ({
	children,
	session,
}: { session: Session; children: React.ReactNode }) => {
	const [value, setValue] = useState<Session>(session);
	const setUser = (user: User | null) => {
		if (user && value.session) {
			setValue({ session: value.session, user });
		} else {
			setValue({ session: null, user: null });
		}
	};

	return (
		<SessionContext.Provider value={{ session: value, setUser }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};
