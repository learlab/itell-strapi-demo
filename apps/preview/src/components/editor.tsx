"use client";

import { TextArea } from "@itell/ui/client";
import { useEditor } from "./provider";

export const Editor = () => {
	const { setValue, value } = useEditor();

	return (
		<>
			<TextArea
				className="font-mono"
				value={value}
				onValueChange={(v) => setValue(v)}
				rows={20}
			/>
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
		</>
	);
};
