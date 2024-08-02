import { cn } from "@itell/utils";

type Props = {
	className?: string;
	children: React.ReactNode;
};

export const Columns = ({ className, children }: Props) => {
	return (
		<div
			className={cn(
				"grid grid-cols-1 md:grid-cols-2 md:gap-8 columns",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const Column = ({ className, children }: Props) => {
	return <div className={cn("col-span-1 column", className)}>{children}</div>;
};
