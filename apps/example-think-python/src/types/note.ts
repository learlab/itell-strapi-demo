export type CreateNoteInput = {
	id: string;
	y: number;
	highlightedText: string;
	color: string;
	serializedRange: string;
};

export type UpdateNoteInput = {
	id: string;
	noteText: string;
};

export type NoteCard = {
	id: string;
	y: number;
	noteText: string;
	highlightedText: string;
	color: string;
	serializedRange: string;
	updated_at?: Date;
	created_at?: Date;
};

export type Highlight = {
	id?: string;
};
