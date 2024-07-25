"use client";

import { Button } from "@itell/ui/client";
import { CodeIcon, RefreshCwIcon, TriangleIcon } from "lucide-react";
import { useContext } from "react";
import { Context } from "./context";

export const Control = () => {
	const { editorRef, runCode, setLogs, reset } = useContext(Context);

	return (
		<div className="flex gap-1">
			<Button
				variant={"outline"}
				size={"sm"}
				type="button"
				onClick={() => {
					setLogs([]);
					runCode();
				}}
				aria-label="Run code"
			>
				<span className="inline-flex items-center gap-2">
					<TriangleIcon className="size-3 rotate-90" />
					Run
				</span>
			</Button>
			<Button
				variant={"outline"}
				size={"sm"}
				type="button"
				onClick={async () => {
					if (editorRef.current) {
						const code = editorRef.current.getValue();
						const prettier = (await import("prettier")).default;
						const prettierPluginBabel = (await import("prettier/plugins/babel"))
							.default;
						const prettierPluginEstree = (
							await import("prettier/plugins/estree")
						).default;

						const result = await prettier.format(code, {
							parser: "babel",
							semi: false,
							plugins: [prettierPluginBabel, prettierPluginEstree],
						});
						editorRef.current.setValue(result);
						editorRef.current.focus();
					}
				}}
			>
				<span className="inline-flex items-center gap-2">
					<CodeIcon className="size-3" />
					Format
				</span>
			</Button>
			<Button variant={"outline"} size={"sm"} onClick={reset}>
				<span className="inline-flex items-center gap-2">
					<RefreshCwIcon className="size-3 rotate-90" />
					Reset
				</span>
			</Button>
		</div>
	);
};
