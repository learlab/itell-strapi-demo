import { cn } from "@itell/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Columns({ className, children }: Props) {
  return (
    <div
      className={cn(
        "columns grid grid-cols-1 md:grid-cols-2 md:gap-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Column({ className, children }: Props) {
  return <div className={cn("column col-span-1", className)}>{children}</div>;
}
