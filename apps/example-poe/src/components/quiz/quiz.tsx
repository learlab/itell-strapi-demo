import { getQuiz } from "@/lib/quiz";
import { QuizFooter } from "./quiz-footer";
import { QuizHeader } from "./quiz-header";
import { Skeleton } from "@itell/ui/server";
import { QuizBody } from "./quiz-body";

type Props = {
	pageSlug: string;
};

export const Quiz = async ({ pageSlug }: Props) => {
	const data = await getQuiz(pageSlug);
	if (!data) {
		return <p>no quiz found</p>;
	}

	return (
		<div className="flex flex-col gap-4 rounded p-4">
			<QuizHeader stepNum={data.length} />
			<QuizBody data={data} />
			<QuizFooter pageSlug={pageSlug} stepNum={data.length} />
		</div>
	);
};

Quiz.Skeleton = () => {
	return (
		<div className="flex flex-col gap-4 rounded p-4">
			<Skeleton className="w-80 h-8" />
			<Skeleton className="w-80 h-8" />
			<Skeleton className="w-80 h-8" />
			<Skeleton className="w-80 h-8" />
			<Skeleton className="w-80 h-8" />
		</div>
	);
};
