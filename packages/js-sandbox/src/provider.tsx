"use client";
import { editor } from "monaco-editor";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from "react";
import { runnerId } from "./runner";

type RegisterOptions = {
	editor: editor.IStandaloneCodeEditor;
	dependencies: string[] | undefined;
};

type State = {
	register: (id: string, options: RegisterOptions) => void;
	run: (id: string) => void;
};

type Props = {
	children: React.ReactNode;
};

const Context = createContext<State>({} as State);

export const SandboxProvider = ({ children }: Props) => {
	const entities = useRef<Map<string, RegisterOptions>>(new Map());
	const runner = useRef<HTMLIFrameElement | null>();

	const register = useCallback((id: string, options: RegisterOptions) => {
		entities.current.set(id, options);
	}, []);

	const run = useCallback((id: string) => {
		const data = entities.current.get(id);
		if (data) {
			const { editor, dependencies } = data;
			let code = editor.getValue();
			if (dependencies && dependencies.length > 0) {
				dependencies.forEach((id) => {
					const depData = entities.current.get(id);
					if (depData) {
						code = `${depData.editor.getValue()}\n${code}`;
					}
				});
			}

			runner.current?.contentWindow?.postMessage(
				{ type: "run-code", code, id, source: "editor" },
				"*",
			);
		}
	}, []);

	useEffect(() => {
		runner.current = document.getElementById(runnerId) as HTMLIFrameElement;
	}, []);

	return (
		<Context.Provider value={{ run, register }}>{children}</Context.Provider>
	);
};

export const useSandbox = () => useContext(Context);
