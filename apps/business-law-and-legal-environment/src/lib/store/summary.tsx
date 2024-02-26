import {
	ErrorType,
	SummaryResponse,
	validateSummary,
} from "@itell/core/summary";
import { driver } from "driver.js";
import { createStore } from "zustand";

type Stage = "Scoring" | "Saving" | "Analyzing";
type ChunkQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

interface Props {
	pending: boolean;
	stages: Stage[];

	error: ErrorType | null;
	response: SummaryResponse | null;

	isPassed: boolean;

	isEnoughSummary: boolean;
	canProceed: boolean;

	chunkQuestion: ChunkQuestion | null;

	showQuiz: boolean;
}

interface State extends Props {
	check: (text: string) => boolean;
}

const useSummaryStore = createStore<State>((set, get) => ({
	pending: false,
	stages: [],

	error: null,
	response: null,

	isEnoughSummary: false,
	isPassed: false,
	canProceed: false,

	chunkQuestion: null,

	showQuiz: false,

	check: (text: string) => {
		set({
			pending: true,
			error: null,
			response: null,
			chunkQuestion: null,
			stages: ["Scoring"],
		});
		const error = validateSummary(text);
		if (error) {
			set({ error, pending: false, response: null, chunkQuestion: null });
			return false;
		}

		return true;
	},
}));
