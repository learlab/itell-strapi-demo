import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { keymap, KeyBinding } from "@codemirror/view";

export type PythonResult = {
	output: string | null;
	error: string | null;
};

export const BaseEditorTheme = EditorView.baseTheme({
	"&": {
		padding: "8px",
		height: "auto",
	},
	".cm-content": {
		fontFamily: "Fira Code, monospace",
		fontSize: "16px",
		lineHeight: "2rem",
	},
	".cm-gutters": {
		display: "none",
	},
});

export const createShortcuts = (keybindings: readonly KeyBinding[]) => {
	return keymap.of(keybindings);
};

export const baseExtensions = [python(), BaseEditorTheme];
