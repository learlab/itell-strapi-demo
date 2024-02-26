import { AnswerData, QuizData } from "@/lib/quiz";
import { cn } from "@itell/core/utils";
import data from "public/quiz-info.json";

type Props = {
	pageSlug: string;
	answerData: AnswerData;
};

const QuizInfo = data as Record<string, QuizData>;

export const QuizRecord = ({ pageSlug, answerData }: Props) => {
	const quiz = QuizInfo[pageSlug];
	return quiz.map((entry, index) => {
		return (
			<div className="space-y-2">
				<p className="leading-relaxed">
					<span className="font-semibold mr-2">{index + 1}.</span>
					<span>{entry.Question}</span>
				</p>
				<div className="space-y-1">
					{entry.Answers.map((answer) => {
						const selected = answerData[entry.id].includes(answer.id);
						return (
							<div
								className={cn("flex gap-2 font-light", {
									"text-green-600": answer.IsCorrect,
									"text-red-600": !answer.IsCorrect && selected,
								})}
							>
								<input type="checkbox" checked={selected} readOnly />
								<p>{answer.Text}</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	});
};
