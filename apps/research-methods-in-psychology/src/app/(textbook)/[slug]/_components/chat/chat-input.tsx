"use client";

import { HTMLAttributes } from "react";

import { InternalError } from "@/components/internal-error";
import { useAddChat } from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import { Label } from "@itell/ui/label";
import { cn } from "@itell/utils";
import { CornerDownLeft } from "lucide-react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  pageSlug: string;
}

export const ChatInput = ({
  className,
  pageSlug,
  ...props
}: ChatInputProps) => {
  const { action, pending, isError } = useAddChat();

  return (
    <div {...props} className={cn("grid gap-2 px-2", className)}>
      <form
        className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.input.value.trim();
          if (input === "") return;
          action({ text: input, pageSlug });
          e.currentTarget.input.value = "";
        }}
      >
        <Label>
          <span className="sr-only">Enter your message here</span>
          <TextArea
            name="input"
            rows={2}
            maxRows={4}
            autoFocus
            disabled={pending}
            placeholder="Message ITELL AI..."
            className="block w-full resize-none rounded-md border border-border bg-background/90 px-4 py-1.5 pr-14 text-sm font-normal leading-5 focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const input = e.currentTarget.value.trim();
                action({ text: input, pageSlug });
                e.currentTarget.value = "";
              }
            }}
            onPaste={(e) => {
              if (isProduction) {
                e.preventDefault();
                toast.warning("Copy & Paste is not allowed");
              }
            }}
          />
        </Label>

        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <button type="submit" disabled={pending}>
            <kbd className="inline-flex items-center rounded border px-1 text-xs">
              <CornerDownLeft className="size-4" />
            </kbd>
          </button>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 border-t border-border"
          aria-hidden="true"
        />
      </form>
      {isError && (
        <InternalError className="px-2">Failed to save chat</InternalError>
      )}
    </div>
  );
};
