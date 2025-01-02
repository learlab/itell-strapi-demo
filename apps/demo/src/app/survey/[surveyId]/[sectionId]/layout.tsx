import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";

import { getSurveyAction } from "@/actions/survey";
import { routes } from "@/lib/navigation";
import { SurveySidebar } from "../survey-sidebar";

export default async function SurveySectionLayout(props: {
  params: Promise<unknown>;
  children: React.ReactNode;
}) {
  const params = routes.surveySection.$parseParams(await props.params);
  const [session] = await getSurveyAction({ surveyId: params.surveyId });
  return (
    <SidebarProvider>
      <SurveySidebar
        variant="inset"
        surveyId={params.surveyId}
        sectionId={params.sectionId}
        surveySession={session ?? undefined}
      />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
