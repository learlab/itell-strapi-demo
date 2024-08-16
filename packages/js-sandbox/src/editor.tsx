"use client";
import { Console as LogOutput } from "@itell/react-console-viewer";
import { Button } from "@itell/ui/client";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "@xstate/store/react";
import { CodeIcon, RefreshCwIcon, TriangleIcon } from "lucide-react";
import { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import { useSandbox } from "./provider";
import { store } from "./store";

type Props = {
	id: string;
	code: string;
	theme?: string;
	dependencies?: string[];
	height?: number;
	onRun?: (code: string, same: boolean) => void;
};

export const CodeEditor = ({
	id,
	code,
	theme = "light",
	dependencies,
	onRun,
	...props
}: Props) => {
	const lines = code.split("\n").length;
	const minHeight = lines <= 1 ? 240 : 60;
	const { run } = useSandbox();
	const [height, setHeight] = useState(props.height || minHeight);
	const data = useSelector(store, (state) => state.context.entities[id]);
	const editor = useRef<editor.IStandaloneCodeEditor | null>(null);
	const prevCode = useRef("");

	const reset = useCallback(() => {
		if (editor.current) {
			editor.current.setValue(code);
		}
	}, [code]);

	return (
		<div className="relative">
			<div className="flex gap-1 absolute top-2 right-4 z-10">
				<Button
					variant={"outline"}
					size={"sm"}
					type="button"
					onClick={() => {
						const code = editor.current?.getValue() || "";
						run(id, code);
						onRun?.(code, prevCode.current === code);
						prevCode.current = code;
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
						if (editor.current) {
							const code = editor.current.getValue();
							const prettier = (await import("prettier")).default;
							const prettierPluginBabel = (
								await import("prettier/plugins/babel")
							).default;
							const prettierPluginEstree = (
								await import("prettier/plugins/estree")
							).default;

							const result = await prettier.format(code, {
								parser: "babel",
								semi: false,
								plugins: [prettierPluginBabel, prettierPluginEstree],
							});
							editor.current.setValue(result);
							editor.current.focus();
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
			<Editor
				width="100%"
				height={height}
				language="javascript"
				theme={theme === "dark" ? "vs-dark" : "light"}
				defaultValue={code}
				onMount={(e) => {
					store.send({ type: "register", id });
					editor.current = e;

					if (!props.height) {
						const lines = e.getModel()?.getLineCount();
						setHeight(lines ? Math.max(lines * 35, minHeight) : minHeight);
					}
				}}
				options={{
					autoIndent: "full",
					tabSize: 2,
					padding: {
						top: 10,
					},
					contextmenu: true,
					fontFamily: "PT Mono, monospace",
					fontSize: 18,
					lineHeight: 24,
					hideCursorInOverviewRuler: true,
					renderLineHighlight: "none",
					overviewRulerBorder: false,
					matchBrackets: "always",
					wordWrap: "on",
					wrappingStrategy: "advanced",
					minimap: {
						enabled: false,
					},
					scrollbar: {
						verticalSliderSize: 8,
					},
					selectOnLineNumbers: true,
					lineNumbersMinChars: 2,
					roundedSelection: false,
					readOnly: false,
					cursorStyle: "line",
				}}
			/>
			{data?.logs.length > 0 && (
				<LogOutput
					logs={data.logs}
					id="output"
					variant={theme === "dark" ? "dark" : "light"}
					// @ts-ignore
					styles={{ BASE_FONT_SIZE: "14px" }}
				/>
			)}
		</div>
	);
};
