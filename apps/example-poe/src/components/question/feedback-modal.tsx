"use client";

import { cn } from "@itell/core/utils";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { useQA } from "../context/qa-context";
import { Checkbox, buttonVariants } from "@itell/ui/server";

export const FeedbackModal = ({
	open,
	onOpenChange,
	isPositive,
}: {
	isPositive: boolean;
	open: boolean;
	onOpenChange: (val: boolean) => void;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>Provide additional feedback</DialogHeader>
				<div className="w-3/4">
					<textarea
						rows={3}
						className="rounded-md shadow-md w-full p-4 mb-4"
						placeholder="Tell us more about your experience and how we can improve iTELL AI."
					/>
					{isPositive ? (
						<div className="flex flex-col justify-start mb-4 w-full">
							<Checkbox id="checkbox4" label="This is informative" />
							<Checkbox id="checkbox5" label="This is supportive" />
							<Checkbox id="checkbox6" label="This is helpful" />
						</div>
					) : (
						<div className="flex flex-col justify-start mb-4 w-full">
							<Checkbox id="checkbox1" label="This is nonsensical" />
							<Checkbox id="checkbox2" label="This is inaccurate" />
							<Checkbox id="checkbox3" label="This is harmful" />
						</div>
					)}
				</div>
				<DialogFooter>
					<button
						className={cn(buttonVariants({ variant: "secondary" }), "mb-4")}
						onClick={() => onOpenChange(false)}
					>
						Submit feedback
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
