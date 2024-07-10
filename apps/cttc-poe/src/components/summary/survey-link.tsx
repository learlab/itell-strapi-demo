"use client";

import { useSession } from "@/lib/auth/context";
import { cn } from "@itell/core/utils";
import { Button } from "@itell/ui/client";
import { buttonVariants } from "@itell/ui/server";
import { User } from "lucia";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
	user: User;
};

const getSurveyLink = (user: User) => {
	return `https://peabody.az1.qualtrics.com/jfe/form/SV_9GKoZxI3GC2XgiO?PROLIFIC_PID=${user.prolificId}`;
};

export const SurveyLink = ({ user }: Props) => {
	const link = getSurveyLink(user);
	const session = useSession();

	return (
		session.user?.finished && (
			<div className="space-y-2 rounded-md mb-8 border-2 r border-info p-4 xl:text-lg xl:leading-relaxed">
				<p>
					You have finished the entire textbook. Please use the code below to
					access the outtake survey.{" "}
					<span className="font-medium">
						This is NOT the Prolific completion code.
					</span>{" "}
					You will be redirected to Prolific with the completion code
					automatically provided upon completing the outtake survey.
				</p>
				<div className="flex flex-col lg:flex-row justify-between">
					<div className="flex items-center gap-2">
						<p>
							<span className="font-medium">Survey code</span>
						</p>
						<Button
							variant={"outline"}
							className=" gap-4"
							onClick={async () => {
								await navigator.clipboard.writeText("outtakesurveycode001");
								toast.info("Code copied!");
							}}
						>
							<span>outtakesurveycode001</span>
							<CopyIcon className="size-4" />
						</Button>
					</div>

					<a href={link} className={cn(buttonVariants(), "w-fit")}>
						Go to outtake survey
					</a>
				</div>
			</div>
		)
	);
};
