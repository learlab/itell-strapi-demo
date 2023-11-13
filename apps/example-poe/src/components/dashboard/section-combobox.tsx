"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@itell/core/utils";
import { Button } from "@/components/client-components";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/client";
import { allSectionsSorted } from "@/lib/sections";
import { Location, SectionLocation } from "@/types/location";

export default function ({
	onValueChange,
}: {
	onValueChange: (arg: SectionLocation | null) => void;
}) {
	const [value, setValue] = React.useState("");

	const [open, setOpen] = React.useState(false);
	const sections = allSectionsSorted
		.filter((section) => section.location.section !== 0)
		.map((section) => ({
			module: section.location.module as number,
			chapter: section.location.chapter as number,
			section: section.location.section as number,
			label: `${section.location.chapter}.${section.location.section} ${section.title}`,
		}));
	const [selectedSection, setSelectedSection] = React.useState<
		typeof sections[0] | undefined
	>(undefined);

	const findSectionByValue = (value: string) => {
		// example value: 1.1 Introduction
		const [chapter, section] = value.split(" ")[0].split(".");
		return sections.find(
			(s) => String(s.chapter) === chapter && String(s.section) === section,
		);
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
					{value ? selectedSection?.label : "Select a section"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0">
				<Command className="h-[300px]">
					<CommandInput placeholder="Search a section" />
					<CommandEmpty>No section found.</CommandEmpty>
					<CommandGroup className="justify-start overflow-y-auto">
						{sections.map((section) => (
							<CommandItem
								key={section.label}
								onSelect={(currentValue) => {
									const nextVal = currentValue === value ? "" : currentValue;
									setValue(nextVal);
									const selectedSection = findSectionByValue(nextVal);
									setSelectedSection(selectedSection);
									onValueChange(
										selectedSection
											? {
													module: selectedSection.module,
													chapter: selectedSection.chapter,
													section: selectedSection.section,
											  }
											: null,
									);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === section.label ? "opacity-100" : "opacity-0",
									)}
								/>
								{section.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
