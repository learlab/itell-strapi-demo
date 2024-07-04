"use client";

import { cn } from "@itell/core/utils";
import { useMDXComponent } from "next-contentlayer/hooks";
import { MdxComponents } from "./mdx-components";

interface MdxProps {
	code: string;
	// quick fix for MdxComponents from @types/mdx
	components: Record<string, any>;
}

export const Mdx = ({ code, components }: MdxProps) => {
	const Component = useMDXComponent(code);

	return <Component components={components} />;
};

interface MainMdxProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	components?: Record<string, any>;
	code: string;
}

export const MainMdx = ({
	code,
	className,
	components = MdxComponents,
	...rest
}: MainMdxProps) => {
	return (
		<article
			className={cn(
				"prose prose-quoteless prose-neutral dark:prose-invert max-w-none xl:text-lg xl:leading-relaxed",
				className,
			)}
			{...rest}
		>
			<Mdx components={components} code={code} />
		</article>
	);
};
