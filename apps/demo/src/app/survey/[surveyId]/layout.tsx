import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";

import { getSurveyAction } from "@/actions/survey";
import { ContinueReading } from "@/components/continue-reading";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { surveyId } = routes.surveyHome.$parseParams(await params);
  const { user } = await getSession();

  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveyHome({ surveyId }),
    });
  }

  const [session] = await getSurveyAction({ surveyId });
  if (session && session.finishedAt !== null) {
    return (
      <SidebarProvider>
        <SurveySidebar
          variant="inset"
          surveyId={surveyId}
          surveySession={session ?? undefined}
        />
        <SidebarInset>
          <SurveyHomeShell user={user}>
            <p className="text-lg font-medium">
              Thank you for completing the survey. You can now go to the
              textbook
            </p>
            <ContinueReading user={user} />
          </SurveyHomeShell>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return children;
}
