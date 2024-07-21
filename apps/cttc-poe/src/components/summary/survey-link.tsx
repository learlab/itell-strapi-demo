"use client";

import { useSession } from "@/lib/auth/context";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { User } from "lucia";

type Props = {
	user: User;
};

export const getSurveyLink = (user: User) => {
	return `https://peabody.az1.qualtrics.com/jfe/form/SV_eJPTJopcoMm0NCe?PROLIFIC_PID=${user.prolificId}`;
};

export const SurveyLink = ({ user }: Props) => {
	const link = getSurveyLink(user);
	const session = useSession();

	return (
		session.user?.finished && (
			<div className="space-y-2 rounded-md mb-8 border-2 r border-info p-4 xl:text-lg xl:leading-relaxed">
				<p>
					You have finished the entire textbook. Please go to the outtake survey
					to complete the study.
				</p>
				<a
					href={link}
					className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
				>
					Outtake survey
				</a>
			</div>
		)
	);
};
