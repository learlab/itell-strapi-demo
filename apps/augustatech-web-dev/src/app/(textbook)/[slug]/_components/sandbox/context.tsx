"use client";
import { editor } from "monaco-editor";
import {
	Dispatch,
	MutableRefObject,
	RefObject,
	SetStateAction,
	createContext,
	useCallback,
	useId,
	useRef,
	useState,
} from "react";
import type { LogMessage } from "react-console-viewer";

type ContextType = {
	logs: LogMessage[];
	setLogs: Dispatch<SetStateAction<LogMessage[]>>;
	editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>;
	runnerRef: RefObject<HTMLIFrameElement>;
	runCode: (code?: string, source?: "editor" | "console") => void;
	id: string;
	code: string;
	reset: () => void;
};

export const Context = createContext<ContextType>({} as ContextType);

type Props = {
	children: React.ReactNode;
	code: string;
};

export const Provider = ({ children, code }: Props) => {
	const id = useId();
	const [logs, setLogs] = useState<LogMessage[]>([]);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const runnerRef = useRef<HTMLIFrameElement>(null);

	const runCode = useCallback(
		(code?: string, source: "editor" | "console" = "editor") => {
			if (runnerRef.current?.contentWindow) {
				const c = code || editorRef.current?.getValue() || "";
				runnerRef.current.contentWindow.postMessage(
					{ type: "run-code", code: c, source, iframeId: id },
					"*",
				);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		if (editorRef.current) {
			setLogs([]);
			editorRef.current.setValue(code);
		}
	}, []);

	return (
		<Context.Provider
			value={{
				id,
				logs,
				setLogs,
				editorRef,
				runnerRef,
				runCode,
				code,
				reset,
			}}
		>
			{children}
		</Context.Provider>
	);
};
