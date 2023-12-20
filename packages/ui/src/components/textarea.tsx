"use client";

import { useAutosizeTextArea } from "@itell/core/hooks";
import { cn } from "@itell/core/utils";
import { BanIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	autoFocus?: boolean;
	autoHeight?: boolean;
	disabledText?: string;
}

export const TextArea = ({
	className,
	value = undefined,
	onValueChange,
	autoFocus = false,
	autoHeight = false,
	disabled,
	disabledText,
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
		<div className="relative">
			<textarea
				value={value}
				disabled={disabled}
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
			{disabled && (
				<div className="absolute top-0 left-0 right-0 bottom-0  z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out flex items-center justify-center gap-2 cursor-not-allowed">
					{disabledText}
					<BanIcon size={24} className="text-muted-foreground" />
				</div>
			)}
		</div>
	);
};
