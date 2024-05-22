import { PageStatus as Status } from "@/lib/page-status";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";

type Props = {
	status: Status;
};

export const PageStatus = ({ status }: Props) => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button className="text-left text-sm px-0 " variant="link">
					{status.isPageUnlocked ? (
						<span>
							<UnlockIcon className="size-4 mr-1 inline" />
							Unlocked
						</span>
					) : status.isPageLatest ? (
						<span>
							<EyeIcon className="size-4 mr-1 inline" />
							In progress
						</span>
					) : (
						<span>
							<LockIcon className="size-4 mr-1 inline" />
							Locked
						</span>
					)}
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				{status.isPageLatest
					? "Answer questions and summarize this chapter to move forward"
					: status.isPageUnlocked
						? "You have completed this page. You can now view all its content"
						: "You haven't got access to this page yet"}
			</HoverCardContent>
		</HoverCard>
	);
};
