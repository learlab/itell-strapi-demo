import { QuizData, getQuiz } from "@/lib/quiz";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "../client-components";
import { Quiz } from "./quiz";
import { isProduction } from "@/lib/constants";
import { useState } from "react";

type Props = {
	data: QuizData;
	pageSlug: string;
};

export const QuizDialog = ({ data, pageSlug }: Props) => {
	return (
		<Dialog defaultOpen={true}>
			<DialogContent canClose={false}>
				<Quiz pageSlug={pageSlug} />
			</DialogContent>
		</Dialog>
	);
};
