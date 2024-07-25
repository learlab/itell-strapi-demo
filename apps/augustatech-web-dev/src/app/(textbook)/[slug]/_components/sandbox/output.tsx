"use client";
import { useTheme } from "next-themes";
import { useContext } from "react";
import { Console as LogOutput } from "react-console-viewer";
import { Context } from "./context";

export const Output = () => {
	const { logs } = useContext(Context);
	const { theme } = useTheme();

	return (
		<LogOutput
			logs={logs}
			id="output"
			variant={theme === "dark" ? "dark" : "light"}
			// @ts-ignore
			styles={{ BASE_FONT_SIZE: "14px" }}
		/>
	);
};
