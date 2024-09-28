"use client";

import { updateUserPrefsAction } from "@/actions/user";
import { isProduction } from "@/lib/constants";
import { Button } from "@itell/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useServerAction } from "zsa-react";

const themes = [
  {
    theme: "light",
    icon: <SunIcon className="size-4" />,
    label: "Light",
  },
  {
    theme: "dark",
    icon: <MoonIcon className="size-4" />,
    label: "Dark",
  },
  {
    theme: "system",
    icon: <LaptopIcon className="size-4" />,
    label: "System",
  },
];

export const ThemeToggle = () => {
  const { setTheme: _setTheme } = useTheme();
  const { execute } = useServerAction(updateUserPrefsAction);

  const setTheme = (theme: string) => {
    if (!document.startViewTransition) _setTheme(theme);
    document.startViewTransition(() => {
      if (isProduction) {
        execute({ preferences: { theme } });
      }
      _setTheme(theme);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.label}
            onClick={() => setTheme(theme.theme)}
          >
            <span className="flex items-center gap-2">
              {theme.icon}
              {theme.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
