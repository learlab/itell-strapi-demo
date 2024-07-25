import React from "react";
import { Provider } from "./context";
import { Control } from "./control";
import { CodeEditor } from "./editor";
import { InlineEditor } from "./inline-editor";
import { Output } from "./output";
import { Runner } from "./runner";

type Props = {
	height?: number;
	children: React.ReactNode;
};

export const Sandbox = ({ height, children }: Props) => {
	const child = React.Children.toArray(children).at(0);
	const code = (child as any)?.props?.children || "";
	return (
		<Provider code={code}>
			<div className="grid gap-1 sandbox">
				<Control />
				<div className="flex flex-col gap-0">
					<div className="border-b pb-4">
						<CodeEditor height={height} />
					</div>
					<Output />
					<InlineEditor />
				</div>
			</div>
		</Provider>
	);
};
