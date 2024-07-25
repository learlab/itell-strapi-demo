"use client";
import { Spinner } from "@/components/spinner";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import { Context } from "./context";

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
export const CodeEditor = (props: { height?: number }) => {
	const { editorRef, code } = useContext(Context);
	const [height, setHeight] = useState(props.height || minHeight);

	return (
		<Editor
			width="100%"
			height={height}
			language="javascript"
			theme="light"
			defaultValue={code}
			onMount={(e) => {
				editorRef.current = e;
				if (!props.height) {
					const lines = e.getModel()?.getLineCount();
					setHeight(lines ? Math.max(lines * 40, minHeight) : minHeight);
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
	);
};
