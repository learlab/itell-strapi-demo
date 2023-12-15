export type CellData = {
	id: string;
	code: string;
	deletable: boolean;
	mode?: CellMode;
	addCell: () => void;
	deleteCell: (id: string) => void;
};

export type CellStatus = "success" | "error" | undefined;
export type CellMode = "script" | "repl";
