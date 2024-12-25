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
import { GalleryVerticalEnd } from "lucide-react";

import { routes } from "@/lib/navigation";
import { getSurvey } from "./[sectionId]/data";

export async function SurveySidebar({
  surveyId,
  sectionId,
  ...props
}: {
  surveyId: string;
  sectionId?: string;
} & React.ComponentProps<typeof Sidebar>) {
  const data = getSurvey(surveyId);

  if (!data) {
    return null;
  }
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
                  <span className="font-semibold">{data.survey_name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.sections.map((section, index) => (
              <SidebarMenuItem key={section.id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={routes.surveySection({
                      surveyId,
                      sectionId: section.id,
                    })}
                    className={cn(
                      "h-fit rounded-md py-1.5 font-medium hover:bg-muted hover:text-muted-foreground",
                      {
                        "bg-accent text-accent-foreground":
                          section.id === sectionId,
                      }
                    )}
                  >
                    {section.title}
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
