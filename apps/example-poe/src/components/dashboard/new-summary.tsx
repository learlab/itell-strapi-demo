"use client";
import SummaryEditor from "./summary-editor";
import { allSectionsSorted } from "@/lib/sections";
import SectionCombobox from "./section-combobox";
import { useState } from "react";
import { SectionLocation } from "@/types/location";
import { ScoreResponse } from "@/lib/hooks/use-summary";
import { Badge } from "@itell/ui/server";
import { ScoreBadge } from "../score/badge";
import { ScoreType } from "@/lib/constants";
import { TextbookPageModal } from "../textbook-page-modal";

export default function () {
	const [selectedLocation, setSelectedLocation] =
		useState<SectionLocation | null>(null);
	const [scoreResponse, setScoreResponse] = useState<ScoreResponse | null>(
		null,
	);
	const section = selectedLocation
		? allSectionsSorted.find(
				(s) =>
					s.location.chapter === selectedLocation.chapter &&
					s.location.section === selectedLocation.section,
		  )
		: null;

	return (
		<>
			<div className="my-8 space-y-4">
				<p className="tracking-tight text-sm text-muted-foreground max-w-lg">
					Create a new summary and receive feedbacks. Once you are ready, save a
					passing summary to unlock the next section.
				</p>
				<SectionCombobox onValueChange={setSelectedLocation} />
			</div>

			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				{selectedLocation && (
					<aside className="hidden w-[200px] flex-col md:flex space-y-4 border p-4">
						{scoreResponse ? (
							<>
								<div className="flex items-center justify-center">
									<Badge
										variant={
											scoreResponse.feedback.isPassed
												? "default"
												: "destructive"
										}
									>
										{scoreResponse.feedback.isPassed ? "Passed" : "Failed"}
									</Badge>
								</div>
								<div className="flex flex-col gap-2">
									<ScoreBadge
										type={ScoreType.containment}
										score={scoreResponse.result.containment}
									/>
									<ScoreBadge
										type={ScoreType.similarity}
										score={scoreResponse.result.similarity}
									/>
									<ScoreBadge
										type={ScoreType.wording}
										score={scoreResponse.result.wording}
									/>
									<ScoreBadge
										type={ScoreType.content}
										score={scoreResponse.result.content}
									/>
								</div>
							</>
						) : (
							<p className="text-muted-foreground text-sm">
								you score will be shown here
							</p>
						)}
					</aside>
				)}
				<div className="space-y-2 text-center">
					{section && <TextbookPageModal page={section} />}
					<div className="max-w-2xl mx-auto">
						{selectedLocation && (
							<SummaryEditor
								published={false}
								location={selectedLocation}
								onScoreResponse={setScoreResponse}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
