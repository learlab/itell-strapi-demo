"use client";
import { LogMessage } from "@itell/react-console-viewer";
import { Console as LogOutput } from "@itell/react-console-viewer";
import { Button } from "@itell/ui/client";
import { CodeIcon, RefreshCwIcon, TriangleIcon } from "lucide-react";
import { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSandbox } from "./provider";
import { Spinner } from "./spinner";

const Editor = dynamic(
	() => import("@monaco-editor/react").then((mod) => mod.Editor),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center">
				<p className="flex items-center gap-2">
					<Spinner />
					preparing code editor
				</p>
			</div>
		),
	},
);

const minHeight = 60;

type Props = {
	id: string;
	code: string;
	dependencies?: string[];
	height?: number;
};

export const CodeEditor = ({ id, code, dependencies, ...props }: Props) => {
	const { theme } = useTheme();
	const [height, setHeight] = useState(props.height || minHeight);
	const { register, run } = useSandbox();
	const [logs, setLogs] = useState<LogMessage[]>([]);
	const editor = useRef<editor.IStandaloneCodeEditor | null>(null);

	const reset = useCallback(() => {
		if (editor.current) {
			setLogs([]);
			editor.current.setValue(code);
		}
	}, []);

	const handleMessage = useCallback((event: MessageEvent) => {
		if (event.data && event.data.id === id && event.data.type === "log") {
			if (Array.isArray(event.data.log)) {
				setLogs((prevLogs) => [...prevLogs, ...event.data.log]);
			} else {
				setLogs((prevLogs) => [...prevLogs, event.data.log]);
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [handleMessage]);

	return (
		<>
			<div className="flex gap-1">
				<Button
					variant={"outline"}
					size={"sm"}
					type="button"
					onClick={() => {
						setLogs([]);
						run(id);
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
					register(id, { editor: e, dependencies });
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
			<LogOutput
				logs={logs}
				id="output"
				variant={theme === "dark" ? "dark" : "light"}
				// @ts-ignore
				styles={{ BASE_FONT_SIZE: "14px" }}
			/>
		</>
	);
};
