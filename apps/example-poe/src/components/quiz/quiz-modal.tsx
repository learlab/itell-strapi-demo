import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "../client-components";
import { Quiz } from "./quiz";

export const QuizDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>open quiz</Button>
			</DialogTrigger>
			<DialogContent>
				<Quiz />
			</DialogContent>
		</Dialog>
	);
};
