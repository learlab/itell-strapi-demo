const unwrapElement = (el: Element) => {
	if (el.textContent) {
		const text = document.createTextNode(el.textContent);
		el.parentNode?.replaceChild(text, el);
	}
};

export const removeNotes = async (id: number) => {
	// Remove all existing tags before applying new highlighting
	const highlights = getElementsByNoteId(id);
	if (highlights) {
		for (let i = 0; i < highlights.length; i++) {
			const h = highlights[i];
			if (h) {
				unwrapElement(h);
			}
		}
	}
};

export const getElementsByNoteId = (id: number) => {
	const target = document.getElementById("page-content");
	if (target) {
		return target.querySelectorAll(`span[data-note-id="${id}"]`);
	}

	return undefined;
};
