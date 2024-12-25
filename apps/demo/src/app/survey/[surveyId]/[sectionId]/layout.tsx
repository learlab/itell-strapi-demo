import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";

import { routes } from "@/lib/navigation";
import { SurveySidebar } from "../survey-sidebar";

export default async function SurveySectionLayout(props: {
  params: Promise<unknown>;
  children: React.ReactNode;
}) {
  const params = routes.surveySection.$parseParams(await props.params);

  return (
    <SidebarProvider>
      <SurveySidebar
        variant="inset"
        surveyId={params.surveyId}
        sectionId={params.sectionId}
      />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
