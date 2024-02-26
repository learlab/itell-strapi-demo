"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { MdxComponents } from "./mdx-components";

interface MdxProps {
	code: string;
	// quick fix for MdxComponents from @types/mdx
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	components: Record<string, any>;
}

export const Mdx = ({ code, components }: MdxProps) => {
	const Component = useMDXComponent(code);

	// @ts-ignore
	return <Component components={components} />;
};

export const MainMdx = ({ code }: { code: string }) => {
	return <Mdx components={MdxComponents} code={code} />;
};
