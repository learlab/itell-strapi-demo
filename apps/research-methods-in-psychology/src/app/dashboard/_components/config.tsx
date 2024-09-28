import { MobileNavItem } from "@/components/mobile-nav";
import {
  BarChartIcon,
  FileEditIcon,
  MessageCircleQuestion,
  SettingsIcon,
} from "lucide-react";

export const dashboardConfig = {
  mobileNav: {
    teacher: [
      {
        title: "Summaries",
        href: "/dashboard/teacher/summaries",
      },
      {
        title: "Questions",
        href: "/dashboard/teacher/questions",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
      },
    ],
    student: [
      {
        title: "Summaries",
        href: "/dashboard/summaries",
      },
      {
        title: "Questions",
        href: "/dashboard/questions",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
      },
    ],
  },
  sidebarNav: {
    teacher: [
      {
        title: "Overview",
        href: "/dashboard/teacher",
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: "/dashboard/teacher/summaries",
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: "/dashboard/teacher/questions",
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
      },
    ],
    student: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: "/dashboard/summaries",
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: "/dashboard/questions",
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
      },
    ],
  },
};

export type DashboardNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SidebarNavItem = {
  title: string;
  href: string;
  external?: boolean;
  icon: () => React.ReactNode;
};

export type DashboardConfig = {
  mobileNav: MobileNavItem[];
  sidebarNav: SidebarNavItem[];
};
