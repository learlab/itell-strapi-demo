"use client";
import { TrashIcon } from "lucide-react";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
} from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	// need this prop to tell note-card the modal is open
	// otherwise the button becomes unclickable as useClickOutside is triggered
	open: boolean;
	onOpenChange: (val: boolean) => void;
	onDelete: () => Promise<void>;
};

export const NoteDelete = ({ open, onOpenChange, onDelete }: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<AlertDialog
			open={open}
			onOpenChange={(val) => {
				onOpenChange(val);
			}}
		>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="sm" type="button">
					<TrashIcon className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this note?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={isLoading}
						onClick={async () => {
							setIsLoading(true);
							await onDelete();
							setIsLoading(false);
						}}
					>
						{isLoading ? <Spinner /> : <span>Delete</span>}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
