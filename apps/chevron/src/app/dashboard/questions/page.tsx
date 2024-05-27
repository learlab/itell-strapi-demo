import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { redirectWithSearchParams } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ConstructedResponse } from "../../../components/dashboard/constructed-response";

export const metadata = Meta.questions;

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("/auth");
	}

	incrementView(user.id, "constructed-response");

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.questions.title}
				text={Meta.questions.description}
			/>
			<Suspense fallback={<ConstructedResponse.Skeleton />}>
				<ErrorBoundary fallback={<ConstructedResponse.ErrorFallback />}>
					<ConstructedResponse userId={user.id} />
				</ErrorBoundary>
			</Suspense>
		</DashboardShell>
	);
}
