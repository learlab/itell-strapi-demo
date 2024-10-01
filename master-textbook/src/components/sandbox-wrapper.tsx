import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";
import type { Sandbox as Sandbox2 } from "@itell/js-sandbox/sandbox";
import React from "react";
import { Sandbox } from "./sandbox";

type Props = Sandbox2.Props & {
	id?: string;
	children?: React.ReactNode;
	pageSlug?: string;
	code?: string;
};

export const SandboxWrapper = async ({
	id,
	code,
	children,
	pageSlug,
	...rest
}: Props) => {
	// @ts-ignore
	const editorCode = code || children.props.children.trim() || "";

	const editorId = id || (await hash(editorCode)).slice(0, 8);

	return (
		<Sandbox
			{...rest}
			id={editorId}
			code={editorCode}
			onRun={async (code, same) => {
				"use server";
				if (!same) {
					createEventAction({
						type: EventType.RUN_CODE,
						pageSlug: pageSlug || "",
						data: {
							code,
							id: editorId,
						},
					});
				}
			}}
		/>
	);
};

const hash = async (code: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(code);
	const hash = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};
