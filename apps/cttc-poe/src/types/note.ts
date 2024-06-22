export type CreateNoteInput = {
	id: number;
	y: number;
	highlightedText: string;
	color: string;
	range: string;
};

export type UpdateNoteInput = {
	newId?: number;
	noteText?: string;
	color?: string;
};

export type NoteCard = {
	id: number;
	y: number;
	noteText: string;
	highlightedText: string;
	color: string;
	range: string;
	updatedAt?: Date;
	createdAt?: Date;
};

export type Highlight = {
	id: number;
	color: string;
	range: string;
};
