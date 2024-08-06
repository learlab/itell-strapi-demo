import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";
import {
	Sandbox as BaseSandbox,
	SandboxProps,
} from "@itell/js-sandbox/sandbox";
import React from "react";

type Props = SandboxProps & {
	id?: string;
	children?: React.ReactNode;
	pageSlug?: string;
	code?: string;
};

export const Sandbox = async ({
	id,
	code,
	children,
	pageSlug,
	...rest
}: Props) => {
	const editorCode =
		code || React.Children.toArray(children).join("").trim() || "";

	const editorId = id || (await hash(editorCode)).slice(0, 8);

	return (
		<BaseSandbox
			{...rest}
			id={editorId}
			code={editorCode}
			onRun={(code, same) => {
				if (!same) {
					createEventAction({
						type: EventType.RUN_CODE,
						pageSlug: pageSlug || "",
						data: {
							code,
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
