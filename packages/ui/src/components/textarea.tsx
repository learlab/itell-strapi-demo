"use client";

import { useAutosizeTextArea } from "@itell/core/hooks";
import { cn } from "@itell/core/utils";
import { useEffect, useRef } from "react";

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	autoFocus?: boolean;
	autoHeight?: boolean;
}

export const TextArea = ({
	className,
	value = undefined,
	onValueChange,
	autoFocus = false,
	autoHeight = false,
	...props
}: TextAreaProps) => {
	const ref = useRef<HTMLTextAreaElement>(null);

	useAutosizeTextArea(ref.current, value || "", autoHeight);

	useEffect(() => {
		if (autoFocus) {
			ref.current?.focus();
		}
	}, []);

	return (
		<textarea
			value={value}
			onChange={(e) => {
				if (onValueChange) {
					onValueChange(e.currentTarget.value);
				}
			}}
			ref={ref}
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
};
