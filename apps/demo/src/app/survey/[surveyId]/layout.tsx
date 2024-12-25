import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@itell/ui/sidebar";
import { and, eq, isNotNull } from "drizzle-orm";

import { db, first } from "@/actions/db";
import { getSurveySessionAction } from "@/actions/survey";
import { ContinueReading } from "@/components/continue-reading";
import { ThemeToggle } from "@/components/theme-toggle";
import { survey_sessions } from "@/drizzle/schema";
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

  const session = first(
    await db
      .select()
      .from(survey_sessions)
      .where(
        and(
          eq(survey_sessions.userId, user.id),
          eq(survey_sessions.surveyId, surveyId),
          isNotNull(survey_sessions.finishedAt)
        )
      )
  );
  if (session) {
    return (
      <SidebarProvider>
        <SurveySidebar variant="inset" surveyId={surveyId} />
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
