import { notFound } from "next/navigation";
import { buttonVariants } from "@itell/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@itell/ui/sidebar";
import { cn } from "@itell/utils";
import { ChevronLeft } from "lucide-react";

import { ContinueReading } from "@/components/continue-reading";
import { NavigationButton } from "@/components/navigation-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { getSurvey } from "./[sectionId]/data";
import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

export default async function SurveyHomePage(props: {
  params: Promise<unknown>;
}) {
  const { user } = await getSession();
  const params = routes.surveyHome.$parseParams(await props.params);

  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveyHome({ surveyId: params.surveyId }),
    });
  }
  const survey = getSurvey(params.surveyId);
  if (!survey) {
    return notFound();
  }
  return (
    <SidebarProvider>
      <SurveySidebar variant="inset" surveyId={params.surveyId} />
      <SidebarInset>
        <SurveyHomeShell user={user}>
          <h1 className="text-3xl font-semibold tracking-tight">
            {survey.survey_name}
          </h1>
          <p>{survey.survey_description}</p>
          <NavigationButton
            href={routes.surveySection({
              surveyId: survey.survey_id,
              sectionId: survey.sections[0].id,
            })}
            className={cn(buttonVariants({ size: "lg" }), "text-lg")}
          >
            Start Survey
          </NavigationButton>
        </SurveyHomeShell>
      </SidebarInset>
    </SidebarProvider>
  );
}
