import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";

export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-2xl font-extrabold tracking-tight md:text-3xl 2xl:text-4xl",
        className
      )}
      id={Elements.PAGE_TITLE}
    >
      {children}
    </h1>
  );
}
