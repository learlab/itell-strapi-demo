"use client";
import { Sandbox as _Sandbox } from "@itell/js-sandbox/sandbox";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Children } from "react";
import { Spinner } from "./spinner";

const BaseSandbox = dynamic(
	() => import("@itell/js-sandbox/sandbox").then((mod) => mod.Sandbox),
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
export const Sandbox = ({
	children,
	code,
	...props
}: { children: React.ReactNode } & _Sandbox.Props) => {
	const { theme } = useTheme();
	const c = code || Children.toArray(children).join("\n").trim();

	return <BaseSandbox {...props} code={c} theme={theme} />;
};
