"use client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/client-components";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";
import { keyof } from "@itell/core/utils";
import { Summary, User } from "@prisma/client";
import pluralize from "pluralize";
import { useState } from "react";
import { SummaryItem } from "./summary-item";

const SelectModule = ({
	modules,
	...rest
}: { modules: string[] } & React.ComponentProps<typeof Select>) => {
	return (
		<Select {...rest}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Module" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Select a Module</SelectLabel>
					{modules.map((m) => (
						<SelectItem key={m} value={m}>
							Module {m}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export type SummaryData = Summary & { module: number; pageTitle: string };

export const SummaryList = ({
	summariesByModule,
	user,
}: { summariesByModule: Record<string, SummaryData[]>; user: User }) => {
	const modules = keyof(summariesByModule);
	const [selectedModule, setSelectedModule] = useState(modules[0]);
	const moduleSummaries = summariesByModule[selectedModule];

	return (
		<div className="p-4 ">
			<div className="flex items-center justify-between">
				<SelectModule
					modules={modules}
					value={selectedModule}
					onValueChange={(val) => setSelectedModule(val)}
				/>
				<p className="text-muted-foreground text-sm">
					{`${pluralize("summary", moduleSummaries.length, true)}`}
				</p>
			</div>

			<div className="divide-y divide-border rounded-md border mt-4 w-[960px]">
				{moduleSummaries.map((summary) => (
					<SummaryItem
						summary={summary}
						key={summary.id}
						timeZone={user.timeZone || DEFAULT_TIME_ZONE}
					/>
				))}
			</div>
		</div>
	);
};
