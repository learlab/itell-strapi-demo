import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/page/shell";
import { getCurrentUser } from "@/lib/auth";
import { delay, redirectWithSearchParams } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ConstructedResponse } from "../../../components/dashboard/constructed-response";

const title = "Question Answering";
const description =
	"You will receive content-related questions as assessment items throughout the read";

export default async function () {
	await delay(3000);
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirectWithSearchParams("/auth");
	}
	return (
		<DashboardShell>
			<DashboardHeader heading={title} text={description} />
			<Suspense fallback={<ConstructedResponse.Skeleton />}>
				<ErrorBoundary fallback={<ConstructedResponse.ErrorFallback />}>
					<ConstructedResponse uid={currentUser.id} />
				</ErrorBoundary>
			</Suspense>
		</DashboardShell>
	);
}
