import { routes } from "@/lib/navigation";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";

type Props = {
	text: string;
};

export const TryExample = ({ text }: Props) => {
	return (
		<a
			href={routes.home({ search: { text: btoa(text) } })}
			className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
		>
			Use example
		</a>
	);
};
