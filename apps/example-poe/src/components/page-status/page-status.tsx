import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";

type Props = {
	status: "locked" | "unlocked" | "current";
};

export const PageStatus = ({ status }: Props) => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button className="text-left text-sm px-0 " variant="link">
					{status === "locked" ? (
						<span>
							<LockIcon className="w-4 -h-4 mr-1 inline" />
							locked
						</span>
					) : status === "unlocked" ? (
						<span>
							<UnlockIcon className="w-4 -h-4 mr-1 inline" />
							unlocked
						</span>
					) : (
						<span>
							<EyeIcon className="w-4 h-4 mr-1 inline" />
							in progress
						</span>
					)}
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				{status === "current"
					? "Answer questions and summarize this chapter to move forward"
					: status === "unlocked"
					? "You have completed this chapter. You can now view all its content"
					: "You haven't got access to this chapter yet"}
			</HoverCardContent>
		</HoverCard>
	);
};
