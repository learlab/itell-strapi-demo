import { QuizProvider } from "@/components/context/quiz-context";
import { QuizModal } from "@/components/quiz/quiz-modal";

type Props = {
	params: {
		slug: string;
	};
};

export default function ({ params }: Props) {
	return (
		<QuizProvider>
			<QuizModal pageSlug={params.slug} />
		</QuizProvider>
	);
}
