import { Image } from "@itell/ui/client";
import { cn } from "@itell/utils";
import React from "react";
import * as runtime from "react/jsx-runtime";
import { TextbookComponents } from "./mdx-components";

const useMDXComponent = (code: string) => {
	const fn = new Function(code);
	return fn({ ...runtime }).default;
};

interface MdxProps extends React.HTMLAttributes<HTMLDivElement> {
	code: string;
	components?: Record<string, any>;
	wrapper?: "article" | "div";
	className?: string;
}

export const Mdx = ({
	code,
	components = { Image },
	className,
	wrapper = "div",
	...rest
}: MdxProps) => {
	const Component = useMDXComponent(code);
	const Wrapper = wrapper === "article" ? "article" : "div";

	return (
		<Wrapper
			{...rest}
			className={cn(
				"prose prose-quoteless prose-neutral dark:prose-invert max-w-none md:text-lg md:leading-relaxed xl:text-xl xl:leading-loose",
				className,
			)}
		>
			<Component components={components} />
		</Wrapper>
	);
};

interface TextbookMdxProps extends Omit<MdxProps, "components" | "article"> {
	wrapper?: "article" | "div";
	components?: Record<string, any>;
}

export const TextbookMdx = ({
	components = TextbookComponents,
	wrapper = "article",
	...rest
}: TextbookMdxProps) => {
	return <Mdx components={components} wrapper={wrapper} {...rest} />;
};
