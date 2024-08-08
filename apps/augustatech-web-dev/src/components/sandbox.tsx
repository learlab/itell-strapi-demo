"use client";
import {
	Sandbox as BaseSandbox,
	SandboxProps,
} from "@itell/js-sandbox/sandbox";
import { useTheme } from "next-themes";

export type { SandboxProps };

export const Sandbox = (props: SandboxProps) => {
	const { theme } = useTheme();
	return <BaseSandbox {...props} theme={theme} />;
};
