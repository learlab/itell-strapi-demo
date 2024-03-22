import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getCurrentUser } from "@/lib/auth";
import { delay, redirectWithSearchParams } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ConstructedResponse } from "../../../components/dashboard/constructed-response";

export const metadata = Meta.questions;

export default async function () {
	await delay(3000);
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirectWithSearchParams("/auth");
	}
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
