import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FeedbackType } from "../control/feedback";

interface ConfigProps {
	isAdmin: boolean;
	feedbackType: FeedbackType;
}

export interface ConfigState extends ConfigProps {
	setFeedbackType: (value: FeedbackType) => void;
}

export const createConfigStore = ({
	isAdmin,
	pageSlug,
}: { pageSlug: string; isAdmin: boolean }) => {
	return createStore<ConfigState>()(
		persist(
			(set) => ({
				feedbackType: FeedbackType.STAIRS,
				isAdmin,
				setFeedbackType: (value) => set({ feedbackType: value }),
			}),
			{
				name: `config-store-${pageSlug}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};

export type ConfigStore = ReturnType<typeof createConfigStore>;
