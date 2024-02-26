import { getQuiz } from "@/lib/quiz";
import { QuizFooter } from "./quiz-footer";
import { QuizHeader } from "./quiz-header";
import { Skeleton } from "@itell/ui/server";
import { QuizBody } from "./quiz-body";
import { getPageData } from "@/lib/utils";

type Props = {
	pageSlug: string;
};

export const Quiz = async ({ pageSlug }: Props) => {
	const data = await getQuiz(pageSlug);
	const pageData = getPageData(pageSlug);
	if (!data || !pageData) {
		return <p>no quiz found</p>;
	}

	return (
		<div className="flex flex-col gap-4 rounded p-4">
			<QuizHeader stepNum={data.length} />
			<QuizBody data={data} />
			<QuizFooter data={data} pageData={pageData} />
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
