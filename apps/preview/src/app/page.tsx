import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { EditorProvider } from "@/components/provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Split } from "@/components/ui/split";
import { InfoIcon } from "lucide-react";

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

				<Split
					direction="horizontal"
					minSize={100}
					expandToMin={false}
					sizes={[50, 50]}
					gutterSize={10}
					snapOffset={30}
					className="flex gap-4"
				>
					<section aria-label="editor" className="flex-grow">
						<Editor />
					</section>
					<section aria-label="preview" className="flex-grow">
						<Preview />
					</section>
				</Split>
			</main>
		</EditorProvider>
	);
}
