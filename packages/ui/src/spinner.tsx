import { cn } from "@itell/utils";
import { Loader2 } from "lucide-react";

interface Props extends React.ComponentProps<typeof Loader2> {
  className?: string;
}

export function Spinner({ className, ...rest }: Props) {
  return <Loader2 className={cn("size-4 animate-spin", className)} {...rest} />;
}
