"use client";

import { QuizData } from "@/lib/quiz";
import { Checkbox, Label } from "../client-components";
import { useQuiz } from "../context/quiz-context";

const QuizItem = ({
	id,
	text,
	onChange,
}: { id: number; text: string; onChange: (id: number) => void }) => {
	return (
		<div className="flex gap-2">
			<Checkbox id={String(id)} onCheckedChange={() => onChange(id)} />
			<Label htmlFor={String(id)}> {text}</Label>
		</div>
	);
};

export const QuizBody = ({ data }: { data: QuizData }) => {
	const { currentStep, toggleChoice } = useQuiz();
	const quiz = data[currentStep];
	return (
		<div className="font-light space-y-4">
			<p>{quiz.Question}</p>
			<div className="space-y-2">
				{quiz.Answers.map(({ id, Text }) => (
					<QuizItem
						key={id}
						id={id}
						text={Text}
						onChange={(id) => {
							toggleChoice(quiz.id, id);
						}}
					/>
				))}
			</div>
		</div>
	);
};
