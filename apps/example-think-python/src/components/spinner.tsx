import { cn } from "@itell/core/utils";
import { Loader2 } from "lucide-react";

type Props = {
	className?: string;
};

export default function Spinner({ className }: Props) {
	return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}
