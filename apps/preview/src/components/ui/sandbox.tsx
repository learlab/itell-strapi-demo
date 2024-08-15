"use client";
import {
	Sandbox as BaseSandbox,
	SandboxProps,
} from "@itell/js-sandbox/sandbox";
import { useTheme } from "next-themes";

export type { SandboxProps };

/**
 * JavaScript Sandbox
 * @module Sandbox
 * @param id {string | undefined} - The id of the sandbox. If not provided, a random id will be generated.
 * @param code {string} - The code to run in the sandbox
 * @example
 * <i-sandbox-js
 * 	id="hello-world-example"
 * 	code="console.log('Hello, world!');"
 * />
 */
export const Sandbox = (props: SandboxProps) => {
	const { theme } = useTheme();
	return <BaseSandbox {...props} theme={theme} />;
};
