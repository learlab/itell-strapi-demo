import "server-only";

import path from "path";
import { readFile } from "fs/promises";

export const scriptPath = (script: string) => {
	return path.join(process.cwd(), "exercise", script);
};

export const readScript = async (script: string) => {
	const p = scriptPath(script);
	try {
		const content = (await readFile(p, "utf-8")).toString();
		return content;
	} catch (err) {
		return null;
	}
};

export const getCellCodes = (input: string) => {
	// If the input doesn't start with "# %%", then it's a single cell
	if (!input.startsWith("# %%")) {
		return [input];
	}

	// Split the string by "# %%"
	const splitArray = input.split("# %%");

	// Filter out empty or whitespace-only strings and trim any excess whitespace
	return splitArray
		.map((substring) => substring.trim())
		.filter((substring) => substring.length > 0);
};
