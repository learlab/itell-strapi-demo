"use client";

import { cn } from "@itell/core/utils";
import { useState } from "react";
import { TwitterPicker } from "@hello-pangea/color-picker";
import { useClickOutside } from "@itell/core/hooks";

type Props = {
	color: string;
	onChange: (color: string) => void;
};

export default function NoteColorPicker({ color, onChange }: Props) {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const ref = useClickOutside<HTMLDivElement>(() => {
		setShowColorPicker(false);
	});

	const styles = {
		background: color,
	};

	return (
		<div className="relative my-2" ref={ref}>
			<button
				style={styles}
				className={cn(
					"flex w-full p-0.5 border-black h-2.5 rounded-md",
					"hover:opacity-50 transition-opacity ease-linear duration-100",
				)}
				onClick={() => setShowColorPicker((prev) => !prev)}
			/>
			{showColorPicker && (
				<div className="relative -bottom-3">
					<TwitterPicker
						onChange={(color) => {
							setShowColorPicker(false);
							onChange(color.hex);
						}}
					/>
				</div>
			)}
		</div>
	);
}
