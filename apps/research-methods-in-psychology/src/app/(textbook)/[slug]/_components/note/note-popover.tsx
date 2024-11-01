"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { darkColors, lightColors } from "@itell/constants";
import { useDebounce } from "@itell/core/hooks";
import {
  createNoteElements,
  deserializeRange,
  removeNotes,
} from "@itell/core/note";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import { cn, getChunkElement } from "@itell/utils";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  ForwardIcon,
  PaletteIcon,
  StickyNoteIcon,
  TrashIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";

import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/actions/note";
import { Spinner } from "@/components/spinner";
import { noteStore } from "@/lib/store/note-store";
import type { NoteData } from "@/lib/store/note-store";

interface Props extends NoteData {
  pageSlug: string;
}

export const NotePopover = memo(
  ({
    id,
    highlightedText,
    noteText,
    pageSlug,
    chunkSlug,
    updatedAt,
    range,
    color,
    local = false,
  }: Props) => {
    const elements = useRef<HTMLElement[]>([]);
    const [positionFailed, setPositionFailed] = useState(
      local ? false : undefined
    );
    const [noteColor, setNoteColor] = useState(color);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // used to compare the user input with the current note text
    const [text, setText] = useState(noteText);

    const getInput = useCallback(
      () => textareaRef.current?.value.trim() ?? "",
      []
    );

    // this state is only used for focusing the textarea and does not control the popover state
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [recordId, setRecordId] = useState<number | null>(local ? null : id);
    const [pending, setPending] = useState(false);
    const pendingDebounced = useDebounce(pending, 500);

    const shouldUpdate = Boolean(recordId);
    const triggerId = `note-${String(id)}-trigger`;
    const popoverId = `note-${String(id)}-popover`;
    const anchorName = `note-${String(id)}-anchor`;

    useEffect(() => {
      if (isPopoverOpen) {
        textareaRef.current?.focus();
      }
    }, [isPopoverOpen]);

    const handleDelete = async () => {
      setPending(true);
      popoverRef.current?.hidePopover();
      removeNotes(id);
      noteStore.send({ type: "delete", id });
      if (recordId) {
        // delete note in database
        await deleteNoteAction({ id: recordId });
        setPending(false);
      } else {
        setPending(false);
      }
    };

    const handleColorChange = useCallback(
      (value: string) => {
        setNoteColor(value);

        if (recordId) {
          updateNoteAction({
            id: recordId,
            data: { color: value },
          });
        }
      },
      [recordId]
    );

    const handleUpsert = async () => {
      setPending(true);

      const noteText = getInput();
      if (shouldUpdate) {
        if (recordId) {
          noteStore.send({
            type: "update",
            id,
            data: {
              noteText,
              color: noteColor,
            },
          });
          const [_, err] = await updateNoteAction({
            id: recordId,
            data: {
              noteText,
              color: noteColor,
            },
          });
          if (err) {
            return toast.error("Failed to update note");
          }
        }
      } else {
        const [data, err] = await createNoteAction({
          noteText,
          highlightedText,
          pageSlug,
          color: noteColor,
          chunkSlug,
          range,
        });
        if (err) {
          return toast.error("Failed to create note");
        }
        setRecordId(data.id);
      }
      setText(noteText);
      setPending(false);
    };

    useEffect(() => {
      const setup = async () => {
        try {
          const els = await createNoteElements({
            id,
            range: deserializeRange(
              range,
              getChunkElement(chunkSlug, "data-chunk-slug") ?? undefined
            ),
            color,
          });
          elements.current = els;
          setAnchor(els[els.length - 1]);
          setPositionFailed(false);
        } catch (err) {
          console.error(err);
          if (!chunkSlug) {
            setPositionFailed(true);
          } else {
            const chunk = getChunkElement(chunkSlug, "data-chunk-slug");
            if (chunk) {
              setAnchor(chunk);
            } else {
              setPositionFailed(true);
            }
          }
        }
      };

      setup();
    }, []);

    useEffect(() => {
      if (anchor && triggerRef.current) {
        const button = triggerRef.current;
        computePosition(anchor, button, {
          placement: "bottom-end",
          strategy: "fixed",
          middleware: [flip(), shift({ padding: 5 }), offset(3)],
        }).then(({ x, y }) => {
          if (triggerRef.current) {
            button.style.left = `${String(x)}px`;
            button.style.top = `${String(y)}px`;
          }
        });

        if (popoverRef.current) {
          if (local) {
            popoverRef.current.showPopover();
          }
        }
      }
    }, [anchor]);

    useEffect(() => {
      if (anchor && triggerRef.current) {
        const handlePopoverToggle = (event: Event) => {
          if ((event as ToggleEvent).newState === "open") {
            setIsPopoverOpen(true);
          } else {
            setIsPopoverOpen(false);
            if (!pending && text !== getInput()) {
              handleUpsert();
            }
          }
        };
        if (popoverRef.current) {
          popoverRef.current.addEventListener("toggle", handlePopoverToggle);
        }

        return () => {
          if (popoverRef.current) {
            popoverRef.current.removeEventListener(
              "toggle",
              handlePopoverToggle
            );
          }
        };
      }
    }, [anchor, recordId, pending, text]);

    useEffect(() => {
      if (elements.current) {
        elements.current.forEach((element) => {
          element.style.backgroundColor = noteColor;
        });
      }
    }, [noteColor]);

    if (positionFailed === undefined) {
      return null;
    }

    return (
      <div className="note-popover-container">
        <button
          id={triggerId}
          className={cn("p-1", {
            "absolute z-10": !positionFailed,
          })}
          style={{
            // @ts-expect-error anchorName is not typed
            anchorName,
            border: positionFailed ? `2px solid ${noteColor}` : undefined,
          }}
          type="button"
          aria-label="toggle note"
          popovertarget={popoverId}
          ref={triggerRef}
        >
          {pendingDebounced ? (
            <Spinner className="size-4" />
          ) : positionFailed ? (
            <span>Note</span>
          ) : (
            <StickyNoteIcon
              className="opacity-60 hover:opacity-100"
              style={{ fill: noteColor }}
            />
          )}
        </button>
        <div
          id={popoverId}
          ref={popoverRef}
          popover="auto"
          role="tooltip"
          className="w-64 rounded-md p-4 pb-2 shadow-md hover:shadow-lg md:w-80"
          style={{ background: noteColor }}
        >
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const color = String(formData.get("color"));
              handleColorChange(color);
            }}
          >
            <Label>
              <span className="sr-only">note text</span>
              <Textarea
                name="input"
                defaultValue={noteText}
                ref={textareaRef}
                minRows={2}
                className="block w-full resize-none bg-inherit font-normal focus:outline-none"
              />
            </Label>
            <footer className="flex justify-end gap-1">
              <ColorPicker
                id={id}
                color={noteColor}
                onChange={handleColorChange}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="p-2 hover:bg-muted/50"
                    aria-label="delete note"
                    onClick={() => popoverRef.current?.hidePopover()}
                  >
                    <TrashIcon className="size-3" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this note?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="mt-0">
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      disabled={pending}
                      onClick={handleDelete}
                      pending={pending}
                    >
                      Continue
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button
                type="button"
                className="p-2 hover:bg-muted/50"
                aria-label="save note"
                onClick={handleUpsert}
              >
                <ForwardIcon className="size-3" />
              </button>
            </footer>
          </form>

          {!recordId ? (
            <p className="text-sm text-muted-foreground">unsaved</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              last updated at{" "}
              <time>
                {(updatedAt ? updatedAt : new Date()).toLocaleString()}
              </time>
            </p>
          )}
          {positionFailed ? (
            <p className="text-sm text-muted-foreground">
              Can&apos;t find reference text for this note
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

type ColorPickerProps = {
  id: number;
  color: string;
  onChange: (color: string) => void;
};
function ColorPicker({ id, color, onChange }: ColorPickerProps) {
  const popoverId = `color-picker-${String(id)}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const colors =
    theme === "light" ? lightColors.slice(0, 8) : darkColors.slice(0, 8);
  const [customBg, setCustomBg] = useState<string>(colors[0]);

  return (
    <div>
      <button
        type="button"
        className="p-2 hover:bg-muted/50"
        aria-label="change note color"
        // @ts-expect-error popoverTarget is not typed
        popovertarget={popoverId}
        ref={triggerRef}
      >
        <PaletteIcon className="size-3" />
      </button>
      <div
        id={popoverId}
        popover="auto"
        role="tooltip"
        className="rounded-md"
        ref={popoverRef}
      >
        <div className="grid grid-cols-6 gap-2 p-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              style={{ background: c }}
              className={cn(
                "size-8 rounded-md",
                c === color ? "border-2 border-primary" : ""
              )}
              onClick={() => {
                onChange(c);
              }}
            />
          ))}
          <button
            type="button"
            className="col-span-1 inline-flex size-8 items-center justify-center rounded-md text-foreground"
            style={{
              background: customBg,
            }}
            onClick={() => {
              onChange(customBg);
            }}
          >
            #
          </button>
          <Input
            className="col-span-3 h-8 w-28"
            name="color"
            value={customBg || ""}
            onChange={(e) => {
              if (e.target.value.length <= 7) {
                setCustomBg(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// unused anchor position style
/*
<style>
{`
	#${triggerId} {
		anchor-name: --${anchorName};
	}

	#${popoverId} {
		position-anchor: --${anchorName};
		inset: auto;
		inset-area: left span-bottom;
		position-try: flip-block;
	}
`}
</style>
*/
