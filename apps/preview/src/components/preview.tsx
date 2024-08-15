"use client";

import { components } from "@/lib/shared-components";
import { WorkerApi } from "@/lib/worker";
import { Prose } from "@itell/ui/server";
import { Remote, releaseProxy, wrap } from "comlink";
import htmr from "htmr";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useEditor } from "./provider";

export const Preview = () => {
	const { value } = useEditor();
	const [debouncedValue] = useDebounce(value, 1000);
	const worker = useRef<Remote<WorkerApi>>();
	const [node, setNode] = useState<ReactNode>(null);

	useEffect(() => {
		worker.current = wrap<WorkerApi>(
			new Worker(new URL("../lib/worker.ts", import.meta.url), {
				type: "module",
			}),
		);

		return () => {
			worker.current?.[releaseProxy]();
		};
	}, []);

	useEffect(() => {
		worker.current?.transform(debouncedValue).then((html) => {
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
			<Prose
				id="preview"
				className="font-sans border border-input bg-background p-4"
			>
				{node}
			</Prose>
		</>
	);
};
