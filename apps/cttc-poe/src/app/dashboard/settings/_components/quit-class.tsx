"use client";

import { isProduction } from "@/lib/constants";
import { updateUser } from "@/lib/user/actions";
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
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const QuitClass = ({ userId }: { userId: string }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	if (isProduction) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>Quit Class</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to leave the class?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Your data will no longer be shared with the teacher
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							pending={isLoading}
							disabled={isLoading}
							onClick={async () => {
								setIsLoading(true);
								await updateUser(userId, { classId: null });

								setIsLoading(false);
								router.refresh();
							}}
						>
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
