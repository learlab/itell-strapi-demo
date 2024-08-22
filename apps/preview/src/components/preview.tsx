"use client";

import { components } from "@/lib/shared-components";
import { WorkerApi } from "@/lib/worker";
import { Prose } from "@itell/ui/prose";
import { Remote, releaseProxy, wrap } from "comlink";
import htmr from "htmr";
import React, { ReactNode } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Spinner } from "./ui/spinner";

type Props = {
	html: string;
	className?: string;
};

export const Preview = ({ html, className }: Props) => {
	const worker = useRef<Remote<WorkerApi>>();
	const [_pending, setPending] = useState(false);
	const [pending] = useDebounce(_pending, 500);
	const [workerReady, setWorkerReady] = useState(false);
	const [node, setNode] = useState<ReactNode>(null);

	const transform = useCallback(async (value: string) => {
		setPending(true);
		const html = await worker.current?.transform(value);
		if (html) {
			setNode(
				htmr(html, {
					// @ts-expect-error
					transform: components,
				}),
			);
		}
		setPending(false);
	}, []);

	useEffect(() => {
		worker.current = wrap<WorkerApi>(
			new Worker(new URL("../lib/worker.ts", import.meta.url), {
				type: "module",
			}),
		);
		setWorkerReady(true);
		transform(html);

		return () => {
			worker.current?.[releaseProxy]();
		};
	}, [html]);

	return (
		<div className={className}>
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
