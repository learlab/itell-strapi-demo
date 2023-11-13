import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import { getUser } from "@/lib/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const title = "Settings";
const description = "Manage account and website settings";

export const metadata: Metadata = {
	title,
	description,
};

export default async function () {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return redirect("/auth");
	}

	const user = await getUser(currentUser.id);
	if (!user) {
		return redirect("/auth");
	}

	return (
		<DashboardShell>
			<DashboardHeader heading={title} text={description} />
			<SettingsForm user={user} />
		</DashboardShell>
	);
}
