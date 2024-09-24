import { allAssignmentPagesSorted } from "@/lib/pages/pages.server";
import { User } from "lucia";
import { AdminToolsClient } from "./admin-tools.client";

type Props = {
	user: User;
	pageSlug: string;
};

export function AdminTools({ user, pageSlug }: Props) {
	return (
		<AdminToolsClient
			user={user}
			pageSlug={pageSlug}
			pages={allAssignmentPagesSorted}
		/>
	);
}
