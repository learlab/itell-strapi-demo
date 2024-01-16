"use client";

import { AnswerData } from "@/lib/quiz";
import { createContext, useContext, useState } from "react";

type QuizContext = {
	currentStep: number;
	nextStep: () => void;
	prevStep: () => void;
	answerData: AnswerData;
	toggleChoice: (answerId: number, choiceId: number) => void;
	canNext: boolean;
};

const QuizContext = createContext<QuizContext>({} as QuizContext);

export const useQuiz = () => useContext(QuizContext);

type Props = {
	children: React.ReactNode;
};

export const QuizProvider = ({ children }: Props) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [answerData, setAnswerData] = useState<AnswerData>({});
	const [canNext, setCanNext] = useState(false);

	const nextStep = () => {
		setCurrentStep((currentStep) => currentStep + 1);
		setCanNext(false);
	};

	const prevStep = () => {
		setCurrentStep((currentStep) => currentStep - 1);
	};

	const toggleChoice = (answerId: number, choiceId: number) => {
		setAnswerData((draft) => {
			let data: AnswerData;
			const choices = draft[answerId] ?? [];
			if (choices.includes(choiceId)) {
				const options = choices.filter((choice) => choice !== choiceId);

				data = {
					...draft,
					[answerId]: options.length > 0 ? options : undefined,
				};
			} else {
				data = {
					...draft,
					[answerId]: [...choices, choiceId],
				};
			}

			if (!canNext && data[answerId] && data[answerId].length > 0) {
				setCanNext(true);
			} else if (!data[answerId]) {
				setCanNext(false);
			}

			return data;
		});
	};

	return (
		<QuizContext.Provider
			value={{
				canNext,
				currentStep,
				nextStep,
				prevStep,
				answerData,
				toggleChoice,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};
