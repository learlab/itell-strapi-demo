import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { cn } from "@itell/utils";

export function QuestionBoxShell({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn("animate-in fade-in", className)} {...rest}>
      {children}
    </Card>
  );
}

export function QuestionBoxHeader({
  children,
  question,
  isOptional,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  question: string;
  isOptional?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardHeader className={cn("flex gap-1 py-2", className)} {...rest}>
      <CardTitle className="font-normal">
        <p>
          <span className="font-bold">Question </span>
          {isOptional ? <span>(Optional)</span> : null}
        </p>
        <p>{question}</p>
      </CardTitle>
      {children}
    </CardHeader>
  );
}

export function QuestionBoxContent({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardContent
      className={cn("flex flex-col gap-2 pb-6 pt-2", className)}
      {...rest}
    >
      {children}
    </CardContent>
  );
}
