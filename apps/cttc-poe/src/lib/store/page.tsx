import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FeedbackType } from "../control/feedback";

interface PageProps {
	feedbackType: FeedbackType;
}

export interface PageState extends PageProps {
	setFeedbackType: (value: FeedbackType) => void;
}

export const createPageStore = ({ pageSlug }: { pageSlug: string }) => {
	return createStore<PageState>()(
		persist(
			(set) => ({
				feedbackType: FeedbackType.STAIRS,
				setFeedbackType: (value) => set({ feedbackType: value }),
			}),
			{
				name: `config-store-${pageSlug}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};

export type PageStore = ReturnType<typeof createPageStore>;
