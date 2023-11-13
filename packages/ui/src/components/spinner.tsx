import { cn } from "@itell/core/utils";
import { Loader2 } from "lucide-react";

interface Props extends React.ComponentProps<typeof Loader2> {
	className?: string;
}

export const Spinner = ({ className, ...rest }: Props) => {
	return (
		<Loader2 className={cn("h-4 w-4 animate-spin", className)} {...rest} />
	);
};
