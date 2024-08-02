"use client";

import { cn } from "@itell/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";

const variants: Record<string, { opacity: number; y: number }> = {
	initial: { opacity: 0, y: -25 },
	visible: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 25 },
};

interface Props extends React.ComponentPropsWithRef<typeof Button> {
	pending: boolean;
	children: React.ReactNode;
}

export const StatusButton = forwardRef<HTMLButtonElement, Props>(
	({ disabled, className, pending, children, ...rest }, ref) => {
		return (
			<Button
				className={cn("w-24", className)}
				disabled={disabled || pending}
				aria-live="off"
				ref={ref}
				{...rest}
			>
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						className="flex w-full items-center justify-center"
						style={{ textShadow: "0px 1px 1.5px rgba(0, 0, 0, 0.16)" }}
						initial="initial"
						animate="visible"
						exit="exit"
						variants={variants}
						transition={{ type: "spring", duration: 0.3, bounce: 0 }}
						key={String(pending)}
					>
						{pending ? <Spinner className="size-4" /> : children}
					</motion.span>
				</AnimatePresence>
			</Button>
		);
	},
);
