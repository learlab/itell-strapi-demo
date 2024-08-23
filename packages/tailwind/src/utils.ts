export const camelToKebab = (str: string) => {
	return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export const extractCssVariables = (obj: Record<string, string>) => {
	const cssVariables: Record<string, string> = {};
	for (const [key, value] of Object.entries(obj)) {
		cssVariables[`--${camelToKebab(key)}`] = value;
	}

	return cssVariables;
};
