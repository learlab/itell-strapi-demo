import { cn } from "@itell/utils";

export function DashboardShell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 items-start gap-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text ? <p className="text-lg text-muted-foreground">{text}</p> : null}
      </div>
      {children}
    </div>
  );
}
