import { Dialog, DialogContent, DialogHeader } from "../client-components";
import { Quiz } from "./quiz";
import { isProduction } from "@/lib/constants";

type Props = {
	pageSlug: string;
};

export const QuizModal = ({ pageSlug }: Props) => {
	return (
		<Dialog defaultOpen={true}>
			<DialogContent canClose={isProduction ? false : true}>
				<DialogHeader>
					Before moving on, please complete the following quiz.
				</DialogHeader>
				<Quiz pageSlug={pageSlug} />
			</DialogContent>
		</Dialog>
	);
};
