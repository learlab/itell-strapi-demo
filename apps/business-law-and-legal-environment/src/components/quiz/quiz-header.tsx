import { QuizStep } from "./quiz-step";

export const QuizHeader = ({ stepNum }: { stepNum: number }) => {
	return (
		<header className="flex justify-between rounded p-4">
			{[...Array(stepNum).keys()].map((_, idx) => (
				<QuizStep step={idx} key={idx} />
			))}
		</header>
	);
};
