import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSessionUser } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { delay, redirectWithSearchParams } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ConstructedResponse } from "../../../components/dashboard/constructed-response";

export const metadata = Meta.questions;

export default async function () {
	await delay(3000);
	const currentUser = await getSessionUser();
	if (!currentUser) {
		return redirectWithSearchParams("/auth");
	}

	incrementView("constructed-response");

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.questions.title}
				text={Meta.questions.description}
			/>
			<Suspense fallback={<ConstructedResponse.Skeleton />}>
				<ErrorBoundary fallback={<ConstructedResponse.ErrorFallback />}>
					<ConstructedResponse uid={currentUser.id} />
				</ErrorBoundary>
			</Suspense>
		</DashboardShell>
	);
}
