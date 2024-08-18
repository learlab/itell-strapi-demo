"use client";

import { components } from "@/lib/shared-components";
import { WorkerApi } from "@/lib/worker";
import { Prose } from "@itell/ui/server";
import { Remote, releaseProxy, wrap } from "comlink";
import htmr from "htmr";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useEditor } from "../app/home-provider";
import { Spinner } from "./ui/spinner";

export const Preview = () => {
	const { value } = useEditor();
	const [debouncedValue] = useDebounce(value, 1000);
	const worker = useRef<Remote<WorkerApi>>();
	const [node, setNode] = useState<ReactNode>(null);
	const [_pending, setPending] = useState(false);
	const [pending] = useDebounce(_pending, 500);
	const [workerReady, setWorkerReady] = useState(false);

	useEffect(() => {
		worker.current = wrap<WorkerApi>(
			new Worker(new URL("../lib/worker.ts", import.meta.url), {
				type: "module",
			}),
		);
		setWorkerReady(true);

		return () => {
			worker.current?.[releaseProxy]();
		};
	}, []);

	useEffect(() => {
		if (!workerReady) return;
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
		<div>
			{workerReady ? (
				<Prose
					id="preview"
					className="h-full font-sans border border-input bg-background p-4 relative min-h-64"
				>
					{pending ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Spinner />
						</div>
					) : (
						node
					)}
				</Prose>
			) : (
				<p className="flex items-center gap-2">
					<Spinner />
					<span>initializing preview</span>
				</p>
			)}
		</div>
	);
};
