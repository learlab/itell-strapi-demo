"use client";

import { createContext, useContext, useEffect, useState } from "react";

type State = {
	value: string;
	setValue: (value: string) => void;
};
export const HomeContext = createContext<State>({} as State);
export const HomeProvider = ({
	children,
	initialValue,
}: { children: React.ReactNode; initialValue?: string }) => {
	const [value, setValue] = useState(initialValue ?? "");

	useEffect(() => {
		setValue(initialValue ?? "");
	}, [initialValue]);

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
