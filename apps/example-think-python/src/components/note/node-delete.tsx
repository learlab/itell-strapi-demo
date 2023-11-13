"use client";
import { TrashIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/client-components";

import { Button } from "../client-components";
import Spinner from "../spinner";
import { useState } from "react";

type Props = {
	onDelete: () => Promise<void>;
	onOpen: () => void;
};

export default function NoteDeleteModal({ onDelete, onOpen }: Props) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild onClick={onOpen}>
				<Button variant="outline">
					<TrashIcon className="w-4 h-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="z-50">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this Note ?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
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
}
