"use client";

import type { Session } from "@/lib/auth";
import { User } from "lucia";
import { createContext, useContext, useMemo, useState } from "react";

const SessionContext = createContext<Session | null>(null);

const SessionActionContext = createContext<{
	updateUser: (val: Partial<User>) => void;
} | null>(null);

export const SessionProvider = ({
	children,
	session,
}: { session: Session; children: React.ReactNode }) => {
	const [value, setValue] = useState<Session>(session);
	const updateUser = (val: Partial<User>) => {
		if (value.session) {
			setValue({ session: value.session, user: { ...value.user, ...val } });
		}
	};

	const actions = useMemo(() => ({ updateUser }), [setValue]);

	return (
		<SessionActionContext.Provider value={actions}>
			<SessionContext.Provider value={value}>
				{children}
			</SessionContext.Provider>
		</SessionActionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};

export const useSessionAction = () => {
	const context = useContext(SessionActionContext);
	if (!context) {
		throw new Error("useSessionAction must be used within a SessionProvider");
	}
	return context;
};
