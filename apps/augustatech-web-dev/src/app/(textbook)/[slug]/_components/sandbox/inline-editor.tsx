"use client";
import { ChevronRight } from "lucide-react";
import { useContext } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Context } from "./context";

export const InlineEditor = () => {
	const { runCode, setLogs } = useContext(Context);

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			e.currentTarget.value += "\n";
			return;
		}

		if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			setLogs([]);
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			const output = document.querySelector("#output");
			if (output) {
				output.scrollTop = output.scrollHeight;
			}
			const code = e.currentTarget.value;
			runCode(code, "console");
			e.currentTarget.setSelectionRange(0, 0);
			e.currentTarget.value = "";
			return;
		}
	};

	return (
		<div className="flex items-center gap-2 ">
			<div className="pl-1">
				<ChevronRight className="size-5 fill-blue-500" />
			</div>
			<ReactTextareaAutosize
				className="flex-1 p-2 overflow-y-hidden"
				rows={1}
				style={{ fontFamily: "PT Mono, monospace" }}
				onKeyDown={handleKeydown}
			/>
		</div>
	);
};
