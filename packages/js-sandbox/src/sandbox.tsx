import React from "react";
import { CodeEditor } from "./editor";

type Props = {
	height?: number;
	id?: string;
	code?: string;
	children: React.ReactNode;
	dependencies?: string[];
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

export const Sandbox = async ({
	id,
	code,
	height,
	children,
	dependencies,
}: Props) => {
	const editorCode =
		code || React.Children.toArray(children).join("").trim() || "";

	const editorId = id || (await hash(editorCode)).slice(0, 8);

	return (
		<div
			className="flex flex-col my-4 sandbox"
			id={editorId}
			aria-label="code exercise"
		>
			<CodeEditor
				id={editorId}
				code={editorCode}
				height={height}
				dependencies={dependencies}
			/>
		</div>
	);
};
