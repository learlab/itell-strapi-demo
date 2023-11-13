import { getLocationFromPathname, makeLocationHref } from "@/lib/utils";
import { it, expect } from "vitest";

const loc1 = { module: 1, chapter: 1, section: 0 };
const loc1Slug = "/module-1/chapter-1";
const loc2 = { module: 1, chapter: 1, section: 1 };
const loc2Slug = "/module-1/chapter-1/section-1";

it("extracts location from pathname", () => {
	expect(getLocationFromPathname(loc1Slug)).toEqual(loc1);
	expect(getLocationFromPathname(loc2Slug)).toEqual(loc2);
});

it("generates href with location", () => {
	expect(makeLocationHref(loc1)).toEqual(loc1Slug);
	expect(makeLocationHref(loc2)).toEqual(loc2Slug);
});
