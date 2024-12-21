"use client";

import React, { useState } from "react";
import { darkColors, lightColors } from "@itell/constants";
import { Button } from "@itell/ui/button";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/tabs";
import { cn } from "@itell/utils";
import { type User } from "lucia";
import { Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { updateUserPrefsAction } from "@/actions/user";
import { InternalError } from "@/components/internal-error";

export function SettingsForm({ user }: { user: User }) {
  const { execute, isError, isPending } = useServerAction(
    updateUserPrefsAction
  );
  const [noteColorLight, setNoteColorLight] = useState(
    user.preferences.note_color_light
  );
  const [noteColorDark, setNoteColorDark] = useState(
    user.preferences.note_color_dark
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [_, err] = await execute({
      preferences: {
        note_color_dark: noteColorDark,
        note_color_light: noteColorLight,
      },
    });
    if (!err) {
      toast.success("Settings saved!");
    }
  };

  return (
    <div className="space-y-4">
      <h3
        id="settings-form-heading"
        className="mb-4 text-lg font-medium leading-relaxed"
      >
        Edit website settings
      </h3>
      <form
        onSubmit={onSubmit}
        className="grid max-w-2xl gap-2"
        aria-labelledby="settings-form-heading"
      >
        <Label className="flex items-center gap-2">
          <span>Note color</span>
          <ColorPicker
            backgroundLight={noteColorLight}
            backgroundDark={noteColorDark}
            onChangeLight={(val) => {
              setNoteColorLight(val);
            }}
            onChangeDark={(val) => {
              setNoteColorDark(val);
            }}
          />
        </Label>

        {isError ? <InternalError /> : null}
        <footer>
          <Button disabled={isPending} pending={isPending} type="submit">
            Save
          </Button>
        </footer>
      </form>
    </div>
  );
}

export function ColorPicker({
  className,
  backgroundLight,
  backgroundDark,
  onChangeLight,
  onChangeDark,
}: {
  backgroundLight: string;
  backgroundDark: string;
  onChangeLight: (background: string) => void;
  onChangeDark: (background: string) => void;
  className?: string;
}) {
  const [lightColor, setLightColor] = useState<string | undefined>(
    backgroundLight
  );
  const [darkColor, setDarkColor] = useState<string | undefined>(
    backgroundDark
  );
  const { theme: currentTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[220px] justify-start text-left font-normal text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            <div className="flex-1 truncate">Pick a color</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-8 gap-1">
        <Tabs className="w-64" defaultValue={currentTheme}>
          <TabsList>
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="dark">Dark</TabsTrigger>
          </TabsList>
          {["dark", "light"].map((theme) => {
            const isLight = theme === "light";

            return (
              <TabsContent
                key={theme}
                value={theme}
                className="grid grid-cols-8 gap-1"
              >
                {(isLight ? lightColors : darkColors).map((s) => (
                  <button
                    key={s}
                    type="button"
                    style={{ background: s }}
                    className="size-6 cursor-pointer rounded-md active:scale-105"
                    onClick={() => {
                      if (isLight) {
                        setLightColor(s);
                        onChangeLight(s);
                      } else {
                        setDarkColor(s);
                        onChangeDark(s);
                      }
                    }}
                  />
                ))}
                <Input
                  className="col-span-full mt-4 h-8"
                  style={{
                    backgroundColor: isLight ? lightColor : darkColor,
                  }}
                  value={isLight ? lightColor : darkColor}
                  onChange={(e) => {
                    if (isLight) {
                      setLightColor(e.target.value);
                      onChangeLight(e.target.value);
                    } else {
                      setDarkColor(e.target.value);
                      onChangeDark(e.target.value);
                    }
                  }}
                />
                <div
                  className="col-span-full mt-4 space-y-1"
                  aria-hidden="true"
                >
                  <p>Example</p>
                  <p
                    className={cn(
                      "col-span-full rounded-md p-1",
                      isLight
                        ? "text-[hsl(var(--foreground-light))]"
                        : "text-[hsl(var(--foreground-dark))]"
                    )}
                    style={{
                      backgroundColor: isLight ? lightColor : darkColor,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Adipisci dolore mollitia voluptatibus. Iure architecto sed
                    impedit facere consequuntur amet ipsa!
                  </p>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
