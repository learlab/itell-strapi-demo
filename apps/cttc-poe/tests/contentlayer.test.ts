import {
	getLocationFromFlattenedPath,
	getSlugFromFlattenedPath,
} from "@/lib/contentlayer";
import { it, expect } from "vitest";

it("generates url", () => {
	const path1 = "/section/module-1/chapter-1";

	expect(getSlugFromFlattenedPath(path1, "/section")).toEqual(
		"/module-1/chapter-1",
	);
});

it("parses flattened path", () => {
	const path1 = "/section/module-1/chapter-1";
	const path2 = "/section/module-1/chapter-1/section-1";

	expect(getLocationFromFlattenedPath(path1)).toEqual({
		module: 1,
		chapter: 1,
		section: 0,
	});

	expect(getLocationFromFlattenedPath(path2)).toEqual({
		module: 1,
		chapter: 1,
		section: 1,
	});
});
