import { useCallback, useState } from "react";

export type StageItem = {
	name: string;
	status: "active" | "inactive" | "complete";
};

type Stage = "Scoring" | "Saving" | "Analyzing";

export const useSummaryStage = () => {
	const [stages, setStages] = useState<StageItem[]>([]);

	const clearStages = useCallback(() => {
		setStages([]);
	}, []);

	const addStage = useCallback((name: Stage) => {
		setStages((currentStages) => {
			const newStage: StageItem = { name, status: "active" };
			const oldStages = currentStages.slice();
			oldStages.push(newStage);
			return oldStages;
		});
	}, []);

	const finishStage = useCallback((name: Stage) => {
		setStages((currentStages) => {
			const newStage: StageItem = { name, status: "complete" };
			const oldStages = currentStages.slice();
			const index = oldStages.findIndex((s) => s.name === name);
			if (index !== -1) {
				oldStages[index] = newStage;
			}
			return oldStages;
		});
	}, []);

	return { stages, clearStages, addStage, finishStage };
};
