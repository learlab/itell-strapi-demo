"use client";

import useDriver from "use-driver";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import {
	PlayIcon,
	PlusIcon,
	RotateCcwIcon,
	XIcon,
	SquareIcon,
	HelpCircleIcon,
	CircleEllipsisIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@itell/core/utils";
import { useTheme } from "next-themes";
import { PythonResult, baseExtensions, createShortcuts } from "./editor-config";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../client-components";
import { usePython } from "@/lib/hooks/ues-python";
import { memo } from "react";
import { CellData, CellMode, CellStatus } from "./types";
import "use-driver/dist/driver.css";
import { toast } from "sonner";

// io and contextlib is imported as setup code in providers
const codeWithStd = (code: string) => {
	const lines = code.split("\n");
	const indentedCode = lines.map((line) => `\t${line}`).join("\n");
	const output = `
with contextlib.redirect_stdout(io.StringIO()) as f:
${indentedCode}
	s = f.getvalue()
s
`;

	return output.trim();
};

export const Cell = memo(
	({ id, deleteCell, deletable, code, addCell, mode = "script" }: CellData) => {
		const extensions = [
			...baseExtensions,
			createShortcuts([
				{
					key: "Shift-Enter",
					run: (view) => {
						run();
						return true;
					},
					preventDefault: true,
				},
			]),
		];

		const { drive, register } = useDriver();

		const [input, setInput] = useState(code);
		const [cellMode, setCellMode] = useState<CellMode>(mode);
		const [result, setResult] = useState<PythonResult | null>(null);
		const [status, setStatus] = useState<CellStatus>(undefined);
		const { theme } = useTheme();
		const [isCellRunning, setIsCellRunning] = useState(false);
		const { runPython, isRunning } = usePython();
		const editorRef = useRef<ReactCodeMirrorRef>(null);

		const run = async () => {
			setIsCellRunning(true);
			setResult(null);
			const result = await runPython(
				cellMode === "script" ? codeWithStd(input) : input,
			);
			if (result.error) {
				setStatus("error");
			} else {
				setStatus("success");
			}
			setIsCellRunning(false);
			setResult(result);
		};

		const reset = () => {
			setInput(code);
			setStatus(undefined);
			setResult(null);
			if (editorRef.current) {
				editorRef.current.view?.focus();
			}
		};

		const help = () => {
			if (!drive) {
				return toast.warning(
					"Usage help is initializing, Please try again later.",
				);
			}

			drive();
		};

		// const cancel = async () => {
		// 	// do not use interrupt buffer as it requires strict domain policy
		// 	await interruptExecution();
		// 	setIsCellRunning(false);
		// };

		return (
			<div
				className={cn("cell shadow-md border group", {
					"border-info": status === "success",
					"border-destructive": status === "error",
					"animate-border-color": isCellRunning,
				})}
			>
				<div className="grid grid-cols-[40px_1fr] gap-4">
					<div className="border-r flex flex-col gap-1 justify-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="p-0 h-full">
									<CircleEllipsisIcon className="h-5 w-5" />
									<span className="sr-only">Open</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="min-w-[20px] p-0">
								<DropdownMenuItem>
									<Button
										size="sm"
										variant="ghost"
										disabled={isRunning}
										onClick={async () => {
											if (!isRunning) {
												await run();
											}
										}}
										{...register({
											order: 2,
											popover: {
												title: "Run Code",
												description:
													"Click on this button to run your code in the editor",
											},
										})}
									>
										{isRunning ? (
											<SquareIcon className="w-4 h-4 mr-2" />
										) : (
											<PlayIcon className="w-4 h-4 mr-2" />
										)}
										<span>Run</span>
									</Button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Button
										size={"sm"}
										variant={"ghost"}
										onClick={reset}
										{...register({
											order: 3,
											popover: {
												title: "Reset Code",
												description:
													"Click on this button to reset your code in the editor",
											},
										})}
									>
										<RotateCcwIcon className="w-4 h-4 mr-2" />
										<span>Reset</span>
									</Button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Button size={"sm"} variant={"ghost"} onClick={help}>
										<HelpCircleIcon className="w-4 h-4 mr-2" />
										<span>Help</span>
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div>
						<div
							className="relative"
							{...register({
								order: 1,
								popover: {
									title: "Code Editor",
									description: "This is where you write Python code",
								},
							})}
						>
							<CodeMirror
								value={input}
								onChange={setInput}
								extensions={extensions}
								theme={theme === "light" ? githubLight : githubDark}
								basicSetup={{
									lineNumbers: false,
								}}
								ref={editorRef}
							/>
							<div className="absolute top-2 right-2 z-10">
								<Select
									value={cellMode}
									onValueChange={(val) => setCellMode(val as CellMode)}
								>
									<SelectTrigger className="w-[90px]">
										<SelectValue placeholder="Mode" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="script">Script</SelectItem>
										<SelectItem value="repl">REPL</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{result?.output && result.output !== "undefined" && (
							<pre className="my-1 py-2">{result.output}</pre>
						)}
						{result?.error && (
							<pre className="my-1 py-2 text-red-500">{result.error}</pre>
						)}
					</div>
				</div>
				<div className="add-cell h-3 flex self-center items-center flex-col ">
					<div className="add-cell-buttons flex flex-column gap-2 opacity-0 group-hover:opacity-100 transition-opacity ease-linear duration-100">
						<Button size={"sm"} variant={"outline"} onClick={addCell}>
							<PlusIcon className="w-4 h-4" />
						</Button>
						{deletable && (
							<Button
								size={"sm"}
								variant={"outline"}
								onClick={() => deleteCell(id)}
							>
								<XIcon className="w-4 h-4" />
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	},
);
