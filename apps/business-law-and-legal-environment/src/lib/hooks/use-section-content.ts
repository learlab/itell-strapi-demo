import { useEffect, useRef } from "react";

export const usePageContent = () => {
	const ref = useRef<HTMLElement>();

	useEffect(() => {
		const el = document.getElementById("page-content") as HTMLElement;
		if (el) {
			ref.current = el;
		}
	}, []);

	return ref;
};
