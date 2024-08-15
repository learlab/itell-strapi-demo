export const insertText = (
	textarea: HTMLTextAreaElement | null,
	text: string,
	restoreSelectionStartOffset?: number,
	restoreSelectionEndOffset?: number,
) => {
	if (!textarea) return;
	const position = textarea.selectionStart;
	const before = textarea.value.substring(0, position);
	const after = textarea.value.substring(position, textarea.value.length);
	textarea.value = before + text + after;
	setTimeout(() => {
		textarea.selectionStart =
			position + (restoreSelectionStartOffset ?? text.length);
		textarea.selectionEnd =
			position + (restoreSelectionEndOffset ?? text.length);
	});

	return textarea.value;
};

export const insertComponent = (
	textarea: HTMLTextAreaElement | null,
	name: string,
	props: Record<string, string | number> = {},
	children = "",
) => {
	if (!textarea) return;

	const propsText = Object.entries(props)
		.map(([key, value]) => ` ${key}="${value}"`)
		.join("");
	const text = `<${name}${propsText}>\n${children}\n</${name}>`;
	const offset = name.length + 3 + propsText.length;
	return insertText(textarea, text, offset, offset);
};
