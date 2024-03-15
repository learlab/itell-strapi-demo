import { createStore } from "zustand";

export type FeedbackType = "stairs" | "simple";

interface ConfigProps {
	isAdmin: boolean;
	feedbackType: FeedbackType;
}

export interface ConfigState extends ConfigProps {
	setFeedback: (value: FeedbackType) => void;
}

export const createConfigStore = ({
	feedbackType,
	isAdmin,
}: { feedbackType: FeedbackType; isAdmin: boolean }) => {
	return createStore<ConfigState>()((set) => ({
		feedbackType: feedbackType,
		isAdmin,
		setFeedback: (value) => set({ feedbackType: value }),
	}));
};

export type ConfigStore = ReturnType<typeof createConfigStore>;
