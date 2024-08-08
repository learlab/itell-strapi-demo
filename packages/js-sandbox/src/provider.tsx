"use client";
import { useSelector } from "@xstate/store/react";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { store } from "./store";

type State = {
	run: (id: string, code: string) => void;
};

type Props = {
	children: React.ReactNode;
};

const methods = [
	"log",
	"debug",
	"info",
	"warn",
	"error",
	"table",
	"clear",
	"time",
	"timeEnd",
	"count",
	"assert",
	"dir",
];

const Context = createContext<State>({} as State);

const serializeArg = (arg: any) => {
	if (arg instanceof Promise) return "Promise { <pending> }";
	if (typeof arg === "object") return structuredClone(arg);
	if (typeof arg === "function") return arg.toString();
	return arg;
};

// biome-ignore lint/security/noGlobalEval: <explanation>
const eval2 = eval;
const addLog = (method: string, args: any[], id: string) => {
	store.send({ type: "addLog", id, log: { method, data: args } });
};

export const SandboxProvider = ({ children }: Props) => {
	const activeId = useRef<string | null>(null);

	useEffect(() => {
		const originalConsole: Record<string, any> = { ...console };

		methods.forEach((method) => {
			// @ts-ignore
			console[method] = (...args: any[]) => {
				originalConsole[method].apply(console, args);
				if (activeId.current) {
					addLog(method, args.map(serializeArg), activeId.current);
				}
			};
		});
	}, []);

	const run = async (id: string, code: string) => {
		activeId.current = id;
		let clear = true;
		store.send({ type: "clearLogs", id });

		try {
			const result = eval2(code);
			if (result instanceof Promise) {
				clear = false;
				await result;
				activeId.current = null;
			}
			addLog("return", [result], id);
		} catch (error) {
			if (error instanceof Error) {
				if (error.stack) {
					addLog("error", [error.stack], id);
				} else {
					addLog("error", [`${error.name}: ${error.message}`], id);
				}
			} else {
				addLog("error", [String(error)], id);
			}
		} finally {
			if (clear) {
				activeId.current = null;
			}
		}
	};

	return <Context.Provider value={{ run }}>{children}</Context.Provider>;
};

export const useSandbox = () => useContext(Context);
