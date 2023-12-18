import { SectionLocation } from "@/types/location";
import { allSectionsSorted } from "./sections";

export const incrementLocation = (location: SectionLocation) => {
	const { module, chapter, section } = location;
	const currentSectionIndex = allSectionsSorted.findIndex(
		(s) =>
			module === s.location.module &&
			chapter === s.location.chapter &&
			section === s.location.section,
	);

	// If current section is the last one or not found, return the same location
	if (
		currentSectionIndex === -1 ||
		currentSectionIndex === allSectionsSorted.length - 1
	) {
		return location;
	}

	// Get the next section
	const nextSection = allSectionsSorted[currentSectionIndex + 1];

	if (nextSection) {
		if (nextSection.summary) {
			return nextSection.location;
		}

		// find the next section that requires a summary
		const nextSectionWithSummary = allSectionsSorted
			.slice(currentSectionIndex + 1)
			.find((s) => s.summary);
		if (nextSectionWithSummary) {
			return nextSectionWithSummary.location;
		}
		return location;
	}

	return location;
};

export const isLocationUnlockedWithoutUser = (location: SectionLocation) => {
	return location.chapter === 1 && location.section === 0;
};

export const isLocationAfter = (a: SectionLocation, b: SectionLocation) => {
	const aIndex = allSectionsSorted.findIndex(
		(s) => s.location.chapter === a.chapter && s.location.section === a.section,
	);
	const bIndex = allSectionsSorted.findIndex(
		(s) => s.location.chapter === b.chapter && s.location.section === b.section,
	);

	return aIndex > bIndex;
};

export const isLastLocation = (location: SectionLocation) => {
	const lastSection = allSectionsSorted[allSectionsSorted.length - 1];
	return (
		location.module === lastSection.location.module &&
		location.chapter === lastSection.location.chapter &&
		location.section === lastSection.location.section
	);
};
