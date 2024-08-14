import { Preview } from "@/components/preview";
import { EditorProvider } from "@/components/provider";

import { Editor } from "@/components/editor";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
	return (
		<EditorProvider>
			<main className="flex flex-col gap-4 py-8 px-16 lg:px-32">
				<div className="flex justify-center gap-4 items-center">
					<h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
						iTELL Markdown Preview
					</h1>
					<ThemeToggle />
				</div>

				<section aria-label="editor">
					<Editor />
				</section>
				<section aria-label="preview">
					<Preview />
				</section>
			</main>
		</EditorProvider>
	);
}
