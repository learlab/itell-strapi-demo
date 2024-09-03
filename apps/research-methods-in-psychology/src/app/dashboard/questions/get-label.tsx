export const getLabel = (score: number) => {
	if (score === 0) return "poor";
	if (score === 1) return "average";
	if (score === 2) return "excellent";

	return "unknown";
};
