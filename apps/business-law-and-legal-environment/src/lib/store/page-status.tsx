import { PageStatus } from "@/lib/page-status";
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Props {
	isFinished: boolean;
}

export interface PageStatusState extends Props {
	finish: () => void;
}

export type PageStatusStore = ReturnType<typeof createPageStatusStore>;

export const createPageStatusStore = (
	pageSlug: string,
	pageStatus: PageStatus,
) => {
	return createStore<PageStatusState>()(
		persist(
			(set) => ({
				isFinished: pageStatus.isPageUnlocked,
				finish: () => {
					set({ isFinished: true });
				},
			}),
			{
				name: `constructed-response-store-${pageSlug}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};
