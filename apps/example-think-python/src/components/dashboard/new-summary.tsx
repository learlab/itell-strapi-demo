"use client";
import SummaryEditor from "./summary-editor";
import { useState } from "react";
import { ScoreResponse } from "@/lib/hooks/use-summary";
import { Badge } from "@itell/ui/server";
import { ScoreBadge } from "../score/badge";
import { ScoreType } from "@/lib/constants";
import { ChapterCombobox } from "./chapter-combobox";

export default function () {
	const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
	const [scoreResponse, setScoreResponse] = useState<ScoreResponse | null>(
		null,
	);

	const onSelectChapter = () => {
		setSelectedChapter(selectedChapter);
	};

	return (
		<>
			<div className="my-8 space-y-4">
				<p className="tracking-tight text-sm text-muted-foreground max-w-lg">
					Create a new summary and receive feedbacks. Once you are ready, save a
					passing summary to unlock the next section.
				</p>
				<ChapterCombobox onValueChange={onSelectChapter} />
			</div>

			<div className="grid gap-12 md:grid-cols-[200px_1fr] auto-rows-fr mt-4">
				{selectedChapter && (
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
					<div className="max-w-2xl mx-auto">
						{selectedChapter && (
							<SummaryEditor
								published={false}
								chapter={selectedChapter}
								onScoreResponse={setScoreResponse}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
