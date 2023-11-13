"use client";

import { usePython } from "@webpy/react";
import { useEffect, useState } from "react";
import Spinner from "../spinner";
import { cn } from "@itell/core/utils";
import { isError } from "@tanstack/react-query";

type Command = {
	input: string;
	isError: boolean;
	result: string | null;
};

export const Repl = () => {
	const [banner, setBanner] = useState("");
	const [input, setInput] = useState("");
	const [commands, setCommands] = useState<Command[]>([
		{
			input,
			isError: false,
			result: null,
		},
	]);

	const { runPython, isLoading, isRunning, getBanner } = usePython();

	const loadBanner = async () => {
		const banner = await getBanner();
		if (banner) {
			setBanner(banner);
		}
	};

	useEffect(() => {
		if (!isLoading) {
			loadBanner();
		}
	}, [isLoading]);

	if (isLoading) {
		return (
			<pre className="flex justify-center items-center h-[100px] bg-black border shadow-sm">
				<Spinner className="mr-2" /> loading python console
			</pre>
		);
	}

	return (
		<pre className="code-repl bg-black border shadow-sm">
			{commands.map((command, index) => {
				const isActiveInput = index === commands.length - 1;
				return isActiveInput ? (
					<div className="flex gap-2 items-center">
						<code>{">>>"}</code>
						<input
							className="flex-1 bg-black"
							// rome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={async (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									const result = await runPython(input);
									const isError = result.error !== null;

									setCommands((prev) => {
										return [
											...prev.slice(0, prev.length - 1),
											{
												input,
												result: isError
													? result.error
													: result?.output !== "undefined"
													? result.output
													: null,
												isError,
											},
											{
												input: "",
												result: null,
												isError: false,
											},
										];
									});
									setInput("");
								}
							}}
							placeholder="Enter your code here"
						/>
					</div>
				) : (
					<div>
						<div className="flex gap-2 items-center">
							<code>{">>>"}</code>
							<code>{command.input}</code>
						</div>
						{command.result && (
							<pre
								className={cn("mx-0 p-0 my-2 text-sm", {
									"text-red-400": command.isError,
								})}
							>
								{command.result}
							</pre>
						)}
					</div>
				);
			})}
		</pre>
	);
};
