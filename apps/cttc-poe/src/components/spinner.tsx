import { cn } from "@itell/utils";

import { Loader2 } from "lucide-react";

type Props = {
	className?: string;
};

export const Spinner = ({ className }: Props) => {
	return <Loader2 className={cn("size-4 animate-spin", className)} />;
};
