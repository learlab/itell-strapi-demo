"use client";

import { Fragment, useState } from "react";
// @ts-ignore
import quizData from "/public/quiz.json";
import { Step } from "../ui/step";
import { QuizSchema } from "@/lib/quiz";
import { Checkbox, Label } from "../client-components";

export const Quiz = () => {
	const [step, setStep] = useState(1);
	const data = QuizSchema.parse(quizData);

	const steps = Array.from({ length: data.length }, (_, i) => i + 1);
	const lastStep = steps[steps.length - 1];

	const question = data[step - 1];

	return (
		<div className="flex flex-col gap-4 rounded p-4">
			<div className="flex justify-between rounded p-4">
				{steps.map((idx) => (
					<Step step={idx} currentStep={step} key={idx} />
				))}
			</div>

			<div className="font-light space-y-4">
				<p>{question.question}</p>
				<div className="space-y-1">
					{question.answers.map(({ text, correct }) => (
						<div className="flex gap-2" key={text}>
							<Checkbox id={text} />
							<Label htmlFor={text}> {text}</Label>
						</div>
					))}
				</div>
			</div>

			<div>
				<div className="mt-10 flex justify-between">
					<button
						onClick={() => setStep(step < 2 ? step : step - 1)}
						className={`${
							step === 1 ? "pointer-events-none opacity-50" : ""
						} duration-350 rounded px-2 py-1 text-neutral-400 transition hover:text-neutral-700`}
					>
						Back
					</button>
					<button
						onClick={() => setStep(step > lastStep ? step : step + 1)}
						className={`${
							step > lastStep ? "pointer-events-none opacity-50" : ""
						} bg duration-350 flex items-center justify-center rounded-full bg-blue-500 py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-blue-600 active:bg-blue-700`}
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
};
