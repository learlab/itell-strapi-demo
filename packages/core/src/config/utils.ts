import { readFile } from "fs/promises";
import { load } from "js-yaml";

export const readYAML = async (path: string) => {
	return load(await readFile(path, "utf-8"));
};
