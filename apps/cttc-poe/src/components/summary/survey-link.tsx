"use client";

import { useSession } from "@/lib/auth/context";
import { getSurveyLink } from "@/lib/utils";
import { buttonVariants } from "@itell/ui/server";
import { User } from "lucia";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../client-components";

type Props = {
	user: User;
};

export const SurveyLink = ({ user }: Props) => {
	const link = getSurveyLink(user);
	const session = useSession();

	return (
		session.user?.finished && (
			<div className="space-y-2 pb-4 mb-8 border-b">
				<p>
					You have finished the entire textbook. Please click to copy the
					completion code below and go to the outtake survey to claim your
					progress.
				</p>
				<div className="flex justify-between">
					<Button
						variant={"outline"}
						className="flex gap-4"
						onClick={async () => {
							await navigator.clipboard.writeText(session.user.id);
							toast.info("Code copied!");
						}}
					>
						<span>{session.user.id}</span>
						<CopyIcon className="size-4" />
					</Button>
					<a href={link} className={buttonVariants()}>
						Go to outtake survey
					</a>
				</div>
			</div>
		)
	);
};
