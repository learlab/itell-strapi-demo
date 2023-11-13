"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@itell/core/utils";
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/client-components";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/client";
import { allChaptersSorted } from "@/lib/chapters";

const chapters = allChaptersSorted
	.filter((c) => c.chapter !== 0)
	.map((c) => ({
		chapter: c.chapter,
		label: `${c.chapter}. ${c.title}`,
	}));

type Props = {
	defaultChapter?: number;
	onValueChange: (arg: number | null) => void;
};

export const ChapterCombobox = ({ defaultChapter, onValueChange }: Props) => {
	const [value, setValue] = React.useState(() => {
		if (defaultChapter) {
			return chapters.filter((c) => c.chapter === defaultChapter)[0].label;
		} else {
			return "";
		}
	});

	const [open, setOpen] = React.useState(false);

	const [selectedChapter, setSelectedChapter] = React.useState(() => {
		if (defaultChapter) {
			return chapters.find((c) => c.chapter === defaultChapter);
		} else {
			return undefined;
		}
	});

	const findChapterByValue = (value: string) => {
		const [chapter, _] = value.split(" ")[0].split(".");
		return chapters.find((c) => String(c.chapter) === chapter);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[400px] justify-between text-left"
				>
					{value ? selectedChapter?.label : "Select a chapter"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0">
				<Command className="h-[300px]">
					<CommandInput placeholder="Search a chapter" />
					<CommandEmpty>No Chapter found.</CommandEmpty>
					<CommandGroup className="justify-start overflow-y-auto">
						<CommandItem
							key={"all"}
							onSelect={(currentValue) => {
								setValue("");
								setSelectedChapter(undefined);
								onValueChange(null);
								setOpen(false);
							}}
						>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									value === "" ? "opacity-100" : "opacity-0",
								)}
							/>
							All
						</CommandItem>
						{chapters.map((chapter) => (
							<CommandItem
								key={chapter.chapter}
								onSelect={(currentValue) => {
									const nextVal = currentValue === value ? "" : currentValue;
									setValue(nextVal);
									const selectedChapter = findChapterByValue(nextVal);
									setSelectedChapter(selectedChapter);
									onValueChange(
										selectedChapter ? selectedChapter.chapter : null,
									);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value[0] === chapter.label[0] ? "opacity-100" : "opacity-0",
									)}
								/>
								{chapter.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
