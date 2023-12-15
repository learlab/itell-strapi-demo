import { Summary, User } from "@prisma/client";
import { SummaryItem } from "./summary-item";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";

export const SummaryList = ({
	summaries,
	user,
}: { summaries: Summary[]; user: User }) => {
	return (
		<div className="divide-y divide-border rounded-md border">
			{summaries.map((summary) => (
				<SummaryItem
					summary={summary}
					key={summary.id}
					timeZone={user.timeZone || DEFAULT_TIME_ZONE}
				/>
			))}
		</div>
	);
};
