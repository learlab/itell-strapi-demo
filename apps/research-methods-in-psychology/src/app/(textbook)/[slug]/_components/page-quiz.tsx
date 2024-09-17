import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { Page } from "#content";

export const PageQuiz = ({ quiz }: { quiz: Page["quiz"] }) => {
	if (!quiz) return null;

	return (
		<div>
			{quiz.map((item, index) => (
				<div key={index} className="my-8 grid gap-2">
					<h4 className="font-semibold text-lg mb-2">{item.question}</h4>
					<RadioGroup>
						{item.answers.map((answer, answerIndex) => (
							<div
								key={answerIndex}
								className="flex items-center space-x-2 mb-2"
							>
								<RadioGroupItem
									value={answer.answer}
									id={`q${index}-a${answerIndex}`}
								/>
								<Label htmlFor={`q${index}-a${answerIndex}`}>
									{answer.answer}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			))}
		</div>
	);
};
