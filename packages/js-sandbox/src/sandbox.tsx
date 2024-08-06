import React from "react";
import { CodeEditor } from "./editor";

export type SandboxProps = {
	id: string;
	code: string;
	dependencies?: string[];
	height?: number;
	onRun?: (code: string, same: boolean) => void;
};

export const Sandbox = async ({
	id,
	code,
	height,
	dependencies,
	onRun,
}: SandboxProps) => {
	return (
		<div
			className="flex flex-col my-4 sandbox"
			id={id}
			aria-label="code exercise"
		>
			<CodeEditor
				id={id}
				code={code}
				height={height}
				dependencies={dependencies}
				onRun={onRun}
			/>
		</div>
	);
};
