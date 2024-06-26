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
import { Spinner } from "@/components/spinner";
import { isProduction } from "@/lib/constants";
import { updateUser } from "@/lib/user/actions";
import { AlertDialogDescription, Button } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
							onClick={async () => {
								setIsLoading(true);
								await updateUser(userId, { classId: null });

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
