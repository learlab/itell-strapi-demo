"use client";

import { components } from "@/lib/shared-components";
import { WorkerApi } from "@/lib/worker";
import { Prose } from "@itell/ui/server";
import { Remote, releaseProxy, wrap } from "comlink";
import htmr from "htmr";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useEditor } from "./provider";
import { Spinner } from "./ui/spinner";

export const Preview = () => {
	const { value } = useEditor();
	const [debouncedValue] = useDebounce(value, 1000);
	const worker = useRef<Remote<WorkerApi>>();
	const [node, setNode] = useState<ReactNode>(null);
	const [_pending, setPending] = useState(false);
	const [pending] = useDebounce(_pending, 500);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		worker.current = wrap<WorkerApi>(
			new Worker(new URL("../lib/worker.ts", import.meta.url), {
				type: "module",
			}),
		);
		setInitialized(true);

		return () => {
			worker.current?.[releaseProxy]();
		};
	}, []);

	useEffect(() => {
		setPending(true);
		worker.current?.transform(debouncedValue).then((html) => {
			setNode(
				htmr(html, {
					// @ts-ignore
					transform: components,
				}),
			);
			setPending(false);
		});
	}, [debouncedValue]);
	return (
		<>
			{initialized ? (
				<Prose
					id="preview"
					className="font-sans border border-input bg-background p-4 relative"
				>
					{pending && <Spinner className="absolute top-2 right-2 size-6" />}
					{node}
				</Prose>
			) : (
				<div className="h-full w-full">
					<p className="flex items-center gap-2">
						<Spinner />
						<span>initializing preview</span>
					</p>
				</div>
			)}
		</>
	);
};
