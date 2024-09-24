import { allAssignmentPagesSorted } from "@/lib/pages/pages.server";
import { AdminToolsClient } from "./admin-tools.client";

type Props = {
	condition: string;
};

export function AdminTools({ condition }: Props) {
	return (
		<AdminToolsClient condition={condition} pages={allAssignmentPagesSorted} />
	);
}
