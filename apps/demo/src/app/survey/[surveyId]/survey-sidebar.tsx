import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@itell/ui/sidebar";
import { cn } from "@itell/utils";
import { CheckCircle, GalleryVerticalEnd } from "lucide-react";

import { SurveySession } from "@/drizzle/schema";
import { routes } from "@/lib/navigation";
import { getSurvey } from "./[sectionId]/data";

export async function SurveySidebar({
  surveyId = "intake",
  sectionId,
  surveySession,
  ...props
}: {
  // all accept undefined for convenient loading UI
  surveyId?: string;
  sectionId?: string;
  surveySession?: SurveySession;
} & React.ComponentProps<typeof Sidebar>) {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }

  const sections = survey.sections
    // only display non-conditional sections
    .filter((section) => !section.display_rules)
    .map((section) => ({
      ...section,
      finished: surveySession?.data?.[section.id] ?? false,
    }));

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routes.surveyHome({ surveyId })}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{survey.survey_name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sections.map((section) => (
              <SidebarMenuItem key={section.id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={routes.surveySection({
                      surveyId,
                      sectionId: section.id,
                    })}
                    className={cn(
                      "flex h-fit items-center justify-between rounded-md py-1.5 font-medium hover:bg-muted hover:text-muted-foreground",
                      {
                        "bg-accent text-accent-foreground":
                          section.id === sectionId,
                      }
                    )}
                  >
                    <span>{section.title}</span>
                    {section.finished && (
                      <CheckCircle className="size-4 stroke-green-500" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
