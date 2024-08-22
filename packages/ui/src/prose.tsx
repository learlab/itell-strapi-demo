import { cn } from "@itell/utils";

interface ProseProps extends React.ComponentProps<"div"> {
	wrapper?: "div" | "article";
	className?: string;
	children: React.ReactNode;
}

export declare namespace Prose {
	type Props = ProseProps;
}

export const Prose = ({
	wrapper = "div",
	className,
	children,
	...rest
}: ProseProps) => {
	const Wrapper = wrapper === "div" ? "div" : "article";
	return (
		<Wrapper
			className={cn(
				"prose prose-quoteless prose-neutral dark:prose-invert max-w-none md:text-lg md:leading-relaxed xl:text-xl xl:leading-loose",
				className,
			)}
			{...rest}
		>
			{children}
		</Wrapper>
	);
};
