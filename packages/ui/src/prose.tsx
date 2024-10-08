import { cn } from "@itell/utils";

interface ProseProps extends React.ComponentProps<"div"> {
  wrapper?: "div" | "article";
  className?: string;
  children: React.ReactNode;
}

export declare namespace Prose {
  type Props = ProseProps;
}

export function Prose({
  wrapper = "div",
  className,
  children,
  ...rest
}: ProseProps) {
  const Wrapper = wrapper === "div" ? "div" : "article";
  return (
    <Wrapper
      className={cn(
        "prose prose-neutral prose-quoteless max-w-none dark:prose-invert md:text-lg md:leading-relaxed xl:text-xl xl:leading-loose",
        className
      )}
      {...rest}
    >
      {children}
    </Wrapper>
  );
}
