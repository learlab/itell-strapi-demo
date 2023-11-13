export const getHighlightId = (el: HTMLSpanElement) => el.dataset.noteId;

const unwrapElement = (el: Element) => {
	if (el.textContent) {
		const text = document.createTextNode(el.textContent);
		el.parentNode?.replaceChild(text, el);
	}
};

export const removeHighlights = async (id: string) => {
	// Remove all existing tags before applying new highlighting
	const highlights = getElementsByNoteId(id);
	if (highlights) {
		for (let i = 0; i < highlights.length; i++) {
			const h = highlights[i];
			unwrapElement(h);
		}
	}
};

export const getElementsByNoteId = (id: string) => {
	const target = document.getElementById("page-content");
	if (target) {
		return target.querySelectorAll(`[data-note-id="${id}"]`);
	} else {
		return undefined;
	}
};
