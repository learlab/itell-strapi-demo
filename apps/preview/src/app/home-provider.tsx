"use client";

import { createContext, useContext, useState } from "react";

type State = {
	value: string;
	setValue: (value: string) => void;
};

export const HomeContext = createContext<State>({} as State);
export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
	const [value, setValue] = useState("");

	return (
		<HomeContext.Provider value={{ value, setValue }}>
			{children}
		</HomeContext.Provider>
	);
};

export const useEditor = () => {
	const { value, setValue } = useContext(HomeContext);

	return { value, setValue };
};
