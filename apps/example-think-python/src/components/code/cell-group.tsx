"use client";

import { useCallback, useState } from "react";
import { Cell } from "./cell";
import Spinner from "../spinner";
import { usePython } from "@/lib/hooks/ues-python";
import { CellMode } from "./types";
import { Errorbox } from "@itell/ui/server";

export const CellGroup = ({
	codes,
	mode,
}: { codes: string[]; mode?: CellMode }) => {
	const cellsData = codes.map((code) => ({
		code,
		deletable: false,
		id: crypto.randomUUID(),
	}));
	const [cells, setCells] = useState(() => cellsData);

	const addCell = useCallback(() => {
		setCells((cells) => [
			...cells,
			{ code: "", deletable: true, id: crypto.randomUUID() },
		]);
	}, []);

	const deleteCell = useCallback((id: string) => {
		setCells((cells) => cells.filter((cell) => cell.id !== id));
	}, []);

	const { isLoading, isError } = usePython();

	return (
		<div className="cells-group space-y-6 mb-8 bg-background">
			{isError ? (
				<Errorbox>
					Failed to setup Python environment. Please maintain network connection
					and refresh the page.
				</Errorbox>
			) : isLoading ? (
				<div className="rounded-md border p-2 lg:p-4 flex gap-2 items-center justify-center">
					<Spinner className="w-4 h-4" />
					setting up python environment
				</div>
			) : (
				cells.map((cell) => (
					<Cell
						{...cell}
						addCell={addCell}
						deleteCell={deleteCell}
						key={cell.id}
						mode={mode}
					/>
				))
			)}
		</div>
	);
};
