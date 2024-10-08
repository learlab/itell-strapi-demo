import { cn } from "@itell/utils";
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert.js";
import { Card, CardContent } from "./card.js";

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mx-auto my-4 max-w-2xl">
      <CardContent>
        <div className="text-center font-serif text-xl tracking-tight">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function Keyterm({
  children,
  label,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 rounded-md border-2 px-4 py-2">
      <div className="border-b border-accent font-bold">
        <h6 className="font-semibold leading-relaxed">{label}</h6>
      </div>
      <div className="font-light leading-relaxed">{children}</div>
    </div>
  );
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function Info({ title, children, className, ...rest }: Props) {
  return (
    <Alert
      className={cn(
        "my-4 bg-info dark:border-2 dark:border-info dark:bg-inherit",
        className
      )}
      {...rest}
    >
      <InfoIcon className="size-4" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {/* align content with icon when there is no title */}
      <AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function Errorbox({ title, children, ...rest }: Props) {
  return (
    <Alert variant="destructive" {...rest}>
      <AlertTriangleIcon className="size-4" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function Warning({ title, children, className, ...rest }: Props) {
  return (
    <Alert
      className={cn(
        "my-4 bg-warning dark:border-warning dark:bg-inherit",
        className
      )}
      {...rest}
    >
      <AlertCircleIcon className="size-4" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
        {children}
      </AlertDescription>
    </Alert>
  );
}
