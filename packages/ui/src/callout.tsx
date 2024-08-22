import { cn } from "@itell/utils";
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";
import { Card, CardContent } from "./card.js";

export const Callout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Card className="my-4 max-w-2xl mx-auto ">
			<CardContent>
				<div className="text-xl text-center font-serif tracking-tight">
					{children}
				</div>
			</CardContent>
		</Card>
	);
};

export const Keyterm = ({
	children,
	label,
}: { label: string; children: React.ReactNode }) => {
	return (
		<div className="border-2 px-4 py-2 rounded-md my-4">
			<div className="border-accent border-b font-bold">
				<h6 className="font-semibold leading-relaxed">{label}</h6>
			</div>
			<div className="font-light leading-relaxed">{children}</div>
		</div>
	);
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	children: React.ReactNode;
}

export const Info = ({ title, children, className, ...rest }: Props) => (
	<Alert
		className={cn(
			"bg-info my-4 dark:bg-inherit dark:border-2 dark:border-info",
			className,
		)}
		{...rest}
	>
		<InfoIcon className="size-4" />
		{title && <AlertTitle>{title}</AlertTitle>}
		{/* align content with icon when there is no title */}
		<AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
			{children}
		</AlertDescription>
	</Alert>
);

export const Errorbox = ({ title, children, ...rest }: Props) => (
	<Alert variant="destructive" {...rest}>
		<AlertTriangleIcon className="size-4" />
		{title && <AlertTitle>{title}</AlertTitle>}
		<AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
			{children}
		</AlertDescription>
	</Alert>
);

export const Warning = ({ title, children, className, ...rest }: Props) => (
	<Alert
		className={cn(
			"bg-warning dark:bg-inherit dark:border-warning my-4",
			className,
		)}
		{...rest}
	>
		<AlertCircleIcon className="size-4" />
		{title && <AlertTitle>{title}</AlertTitle>}
		<AlertDescription className={cn({ "[&>p]:my-0 [&>ul]:my-0": !title })}>
			{children}
		</AlertDescription>
	</Alert>
);
