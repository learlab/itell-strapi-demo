import { it, expect } from "vitest";
import { getHeadingsFromRawBody } from "../src//contentlayer";

const docRaw = `
## Decisions ... Decisions in the Social Media Age

Every day we are faced with a myriad of decisions.

## Introduction

What is economics and why should you spend your time learning it?

### Details

#### Learn with Videos
`;

it("generates headings", () => {
	expect(getHeadingsFromRawBody(docRaw)).toEqual([
		{
			level: "two",
			slug: "decisions--decisions-in-the-social-media-age",
			text: "Decisions ... Decisions in the Social Media Age",
		},
		{
			level: "two",
			slug: "introduction",
			text: "Introduction",
		},
		{
			level: "three",
			slug: "details",
			text: "Details",
		},
		{
			level: "other",
			slug: "learn-with-videos",
			text: "Learn with Videos",
		},
	]);
});
