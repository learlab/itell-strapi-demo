"use client";

import { components } from "@/lib/shared-components";
import { transform } from "@/lib/transform";
import { Prose } from "@itell/ui/server";
import htmr from "htmr";
import { ReactNode, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useEditor } from "./provider";

export const Preview = () => {
	const { value } = useEditor();
	const [debouncedValue] = useDebounce(value, 1000);
	const [node, setNode] = useState<ReactNode>(null);

	useEffect(() => {
		transform(debouncedValue).then((html) => {
			console.log(html);
			setNode(
				htmr(html, {
					// @ts-ignore
					transform: components,
				}),
			);
		});
	}, [debouncedValue]);
	return (
		<>
			<Prose id="preview" className="font-sans">
				{node}
			</Prose>
		</>
	);
};
