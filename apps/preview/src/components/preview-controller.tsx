"use client";

import { useDebounce } from "use-debounce";
import { useEditor } from "../app/home-provider";
import { Preview } from "./preview";

export const PreviewController = () => {
	const { value } = useEditor();
	const [debouncedValue] = useDebounce(value, 1000);

	return <Preview html={debouncedValue} />;
};
