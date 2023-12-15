"use client";
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
import { updateUserClassId } from "@/lib/server-actions";
import { isProduction } from "@/lib/constants";
import { AlertDialogDescription, Button } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import { deleteClassSettings } from "@/lib/class";
import { useState } from "react";
import { Spinner } from "@/components/spinner";

type Props = {
	userId: string;
};

export const QuitClass = ({ userId }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	if (isProduction) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger>
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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>
						<Button
							onClick={async () => {
								setIsLoading(true);
								await updateUserClassId({
									userId,
									classId: null,
								});

								deleteClassSettings();

								setIsLoading(false);
								router.refresh();
							}}
						>
							{isLoading && <Spinner className="inline mr-2" />}
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
