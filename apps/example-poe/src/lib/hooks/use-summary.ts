import { trpc } from "@/trpc/trpc-provider";
import { useLocation } from "./utils";
import { SummaryFeedback, getFeedback } from "../summary";
import { makeInputKey } from "../utils";
import { useEffect, useReducer } from "react";
import { toast } from "sonner";
import cld3 from "../cld";
import { SectionLocation } from "@/types/location";
import { Summary } from "@prisma/client";
import offensiveWords from "public/offensive-words.json";
import { SummaryResponse, SummaryScore } from "@/trpc/schema";
import { getScore } from "../score";
import { numOfWords } from "@itell/core/utils";

enum ErrorType {
	LANGUAGE_NOT_EN = "LANGUAGE_NOT_EN",
	WORD_COUNT = "WORD_COUNT",
	OFFENSIVE = "OFFENSIVE",
}

const ErrorFeedback: Record<ErrorType, string> = {
	[ErrorType.LANGUAGE_NOT_EN]: "Please use English for your summary.",
	[ErrorType.WORD_COUNT]: "Your summary must be between 50 and 200 words.",
	[ErrorType.OFFENSIVE]:
		"Your summary includes offensive language. Please remove the offensive language and resubmit.",
};

type State = {
	input: string;
	prompt: string;
	error: string | null;
	pending: boolean;
	feedback: SummaryFeedback | null;
	result: SummaryResponse | null;
};

type Action =
	| { type: "set_input"; payload: string }
	| { type: "set_pending"; payload: boolean }
	| { type: "start_check" }
	| { type: "check_length_error" }
	| { type: "check_language_error" }
	| { type: "check_offensive_error" }
	| { type: "score_summary" }
	| {
			type: "score_summary_finished";
			payload: { result: SummaryResponse; feedback: SummaryFeedback };
	  }
	| { type: "save_summary" }
	| { type: "save_summary_finished" }
	| { type: "update_summary" }
	| { type: "update_summary_finished" }
	| { type: "reset" }
	| { type: "save_summary" };

export type ScoreResponse = {
	result: SummaryResponse;
	feedback: SummaryFeedback;
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case "set_input":
			return {
				...state,
				input: action.payload,
			};
		case "set_pending": {
			return {
				...state,
				pending: action.payload,
			};
		}
		case "start_check": {
			return {
				...state,
				pending: true,
				error: null,
				prompt: "Checking",
			};
		}
		case "check_length_error": {
			return {
				...state,
				error: ErrorFeedback[ErrorType.WORD_COUNT],
				pending: false,
				prompt: "Submit your summary",
			};
		}
		case "check_language_error": {
			return {
				...state,
				error: ErrorFeedback[ErrorType.LANGUAGE_NOT_EN],
				pending: false,
				prompt: "Submit your summary",
			};
		}
		case "check_offensive_error": {
			return {
				...state,
				error: ErrorFeedback[ErrorType.OFFENSIVE],
				pending: false,
				prompt: "Submit your summary",
			};
		}

		case "score_summary": {
			return {
				...state,
				pending: true,
				feedback: null,
				prompt: "Generating score",
			};
		}
		case "score_summary_finished": {
			return {
				...state,
				result: action.payload.result,
				feedback: action.payload.feedback,
				pending: false,
				prompt: "Score generated",
			};
		}
		case "save_summary": {
			return {
				...state,
				pending: true,
				prompt: "Saving summary",
			};
		}
		case "save_summary_finished": {
			return {
				...state,
				pending: false,
				prompt: "Submit your summary",
			};
		}
		// no need to update the prompt
		// which is handled as local state in summary-editor
		case "update_summary":
			return {
				...state,
				pending: true,
			};
		case "update_summary_finished":
			return {
				...state,
				pending: false,
			};
		case "reset": {
			return {
				...state,
				pending: false,
				prompt: "Submit your summary",
				score: null,
				feedback: null,
			};
		}
		default:
			return state;
	}
};

export const useSummary = ({
	useLocalStorage,
}: { useLocalStorage?: boolean }) => {
	const location = useLocation();
	const incrementUserLocation = trpc.user.incrementLocation.useMutation();
	const addSummary = trpc.summary.create.useMutation();
	const updateSummary = trpc.summary.update.useMutation();

	const initialState: State = {
		input: "",
		prompt: "Submit your summary",
		error: null,
		pending: false,
		feedback: null,
		result: null,
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	const checkSummary = (text: string) => {
		const wordNum = numOfWords(text);

		dispatch({ type: "start_check" });
		// check word count
		if (wordNum < 50 || wordNum > 200) {
			dispatch({ type: "check_length_error" });
			toast.error(ErrorFeedback[ErrorType.WORD_COUNT]);
			return false;
		}

		// check language is english
		const cldResult = cld3.findLanguage(text);
		if (cldResult.language !== "en") {
			dispatch({ type: "check_language_error" });
			toast.error(ErrorFeedback[ErrorType.LANGUAGE_NOT_EN]);
			return false;
		}

		// check offensive words
		let isOffensive = false;
		for (const word of text.split(" ")) {
			if (offensiveWords.includes(word.toLowerCase())) {
				isOffensive = true;
				break;
			}
		}
		if (isOffensive) {
			dispatch({ type: "check_offensive_error" });
			toast.error(ErrorFeedback[ErrorType.OFFENSIVE]);
			return false;
		}

		return true;
	};

	const setInput = (text: string) => {
		dispatch({ type: "set_input", payload: text });
	};

	useEffect(() => {
		if (location && useLocalStorage) {
			const inputKey = makeInputKey(location as SectionLocation);
			setInput(localStorage.getItem(inputKey) || "");
		}
	}, [location]);

	const score = async (location: SectionLocation) => {
		const isSummaryValid = checkSummary(state.input);
		if (isSummaryValid) {
			dispatch({ type: "score_summary" });
			if (location) {
				try {
					const response = await getScore({ input: state.input, location });
					if (!response.success) {
						// API response is not in correct shape
						console.error("API Response error", response);
						toast.error("Something went wrong, please try again later.");
						return;
					}
					const result = response.data;
					const feedback = getFeedback(result);
					dispatch({
						type: "score_summary_finished",
						payload: { result, feedback },
					});
					return { result, feedback };
				} catch (err) {
					dispatch({ type: "reset" });
					console.error(err);
					toast.error("Something went wrong, please try again later.");
				}
			} else {
				toast.success(
					"No summary is required for this section. You are good to go!",
				);
			}
		}
	};

	const update = async ({
		summary,
		score,
		feedback,
		location,
	}: {
		summary: Summary;
		score: SummaryScore | null;
		feedback: SummaryFeedback | null;
		location: SectionLocation;
	}) => {
		if (score && feedback) {
			dispatch({ type: "update_summary" });
			try {
				await updateSummary.mutateAsync({
					id: summary.id,
					text: state.input,
					isPassed: feedback.isPassed,
					score: score,
				});
				if (feedback.isPassed) {
					await incrementUserLocation.mutateAsync(location);
				}
				toast.success("Summary updated!");
				dispatch({ type: "update_summary_finished" });
			} catch (err) {
				toast.error("Something went wrong, please try again later.");
			}
		} else {
			toast.error("Please score your summary first.");
		}
	};

	const create = async (
		result: SummaryResponse | null,
		feedback: SummaryFeedback | null,
		location: SectionLocation,
	) => {
		if (result && feedback) {
			dispatch({ type: "save_summary" });
			try {
				const summary = await addSummary.mutateAsync({
					text: state.input,
					location: {
						module: location.module as number,
						chapter: location.chapter as number,
						section: location.section,
					},
					isPassed: feedback.isPassed,
					score: {
						containment: result.containment,
						similarity: result.similarity,
						wording: result.wording,
						content: result.wording,
					},
				});
				if (feedback.isPassed) {
					await incrementUserLocation.mutateAsync(location);
					toast.success("You can now proceed to the next section.");
				}
				dispatch({ type: "save_summary_finished" });
				return summary;
			} catch (err) {
				toast.error("Something went wrong, please try again later.");
			}
		}
	};

	return { state, setInput, score, create, update };
};
