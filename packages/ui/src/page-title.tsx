import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";

export const PageTitle = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	return (
		<h1
			className={cn(
				"text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-center text-balance",
				className,
			)}
			id={Elements.PAGE_TITLE}
		>
			{children}
		</h1>
	);
};
