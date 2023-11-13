import { it, expect } from "vitest";
import { getDatesBetween } from "../src/utils";

it("generates consecutive dates between start and end", () => {
	const start = new Date("2023-06-30");
	const end = new Date("2023-07-03");

	expect(getDatesBetween(start, end)).toEqual([
		start,
		new Date("2023-07-01"),
		new Date("2023-07-02"),
		end,
	]);
});
