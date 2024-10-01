"use client";
import type { Sandbox as Sandbox2 } from "@itell/js-sandbox/sandbox";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
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

export const Sandbox = (props: Sandbox2.Props) => {
	const { theme } = useTheme();
	return <BaseSandbox {...props} theme={theme} />;
};
