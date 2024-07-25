"use client";
import { useContext } from "react";
import { Console as LogOutput } from "react-console-viewer";
import { Context } from "./context";

export const Output = () => {
	const { logs } = useContext(Context);

	return (
		<LogOutput
			logs={logs}
			id="output"
			// @ts-ignore
			styles={{ BASE_FONT_SIZE: "14px" }}
		/>
	);
};
