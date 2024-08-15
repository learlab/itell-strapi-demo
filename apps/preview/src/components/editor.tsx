"use client";

import { insertComponent, insertText } from "@/lib/textarea";
import { useRef } from "react";
import { useEditor } from "./provider";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./ui/context-menu";

type MenuItem = {
	label: string;
	action: (textarea: HTMLTextAreaElement | null) => string | undefined;
};

const items: Array<MenuItem> = [
	{
		label: "Link",
		action: (t) =>
			insertText(t, "[link](https://github.com/learlab/itell)", 5, 5),
	},
	{
		label: "Blockquote",
		action: (t) => insertComponent(t, "i-blockquote", {}),
	},
	{
		label: "Image",
		action: (t) =>
			insertComponent(
				t,
				"i-image",
				{
					src: "https://nbjrajrmujlgxmcvqsge.supabase.co/storage/v1/object/public/strapi/files/1.1.png-e1cb314dd72c8b8360d0cdddc949b81f.png",
					alt: "description of the image",
					height: 200,
					width: 400,
				},
				"Dont forget to add alt text.",
			),
	},
];

const calloutItems: Array<MenuItem> = [
	{
		label: "Info",
		action: (t) => insertComponent(t, "i-callout", { variant: "info" }),
	},
	{
		label: "Warning",
		action: (t) => insertComponent(t, "i-callout", { variant: "warning" }),
	},
	{
		label: "Danger",
		action: (t) => insertComponent(t, "i-callout", { variant: "danger" }),
	},
];

export const Editor = () => {
	const { setValue, value } = useEditor();
	const ref = useRef<HTMLTextAreaElement>(null);

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<textarea
					id="editor"
					ref={ref}
					className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>Callout</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-48">
						{calloutItems.map((item) => (
							<ContextMenuItem
								inset
								key={item.label}
								onSelect={() => {
									const val = item.action(ref.current);
									if (val) setValue(val);
								}}
							>
								{item.label}
							</ContextMenuItem>
						))}
					</ContextMenuSubContent>
				</ContextMenuSub>
				{items.map((item) => (
					<ContextMenuItem
						inset
						key={item.label}
						onSelect={() => {
							const val = item.action(ref.current);
							if (val) setValue(val);
						}}
					>
						{item.label}
					</ContextMenuItem>
				))}
				<ContextMenuSeparator />
				<ContextMenuItem
					inset
					onSelect={async () => {
						const text = await navigator.clipboard.readText();
						const val = insertText(ref.current, text);
						if (val) setValue(val);
					}}
				>
					Paste
				</ContextMenuItem>
			</ContextMenuContent>

			{/* <style>{".ck-editor__editable_inline { min-height: 400px; }"}</style>
			<CKEditor
				editor={ClassicEditor}
				config={config}
				onReady={(editor) => {
					editor.model.schema.register("callout-info", {
						inheritAllFrom: "$block",
					});

					editor.conversion.for("upcast").attributeToAttribute({
						model: "id",
						view: {
							key: "id",
							value: /[\s\S]+/,
						},
					});
					editor.conversion.for("downcast").attributeToElement({
						model: "id",
						view: (modelAttributeValue, viewWriter) => {
							return viewWriter.createAttributeElement("callout-info", {
								id: modelAttributeValue,
							});
						},
					});
				}}
				onChange={(event, editor) => {
					const root = editor.editing.view.document.getRoot();
					setValue(viewToPlainText(root));
				}}
			/> */}
		</ContextMenu>
	);
};
