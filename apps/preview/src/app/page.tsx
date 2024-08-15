import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { EditorProvider } from "@/components/provider";
import { Reference } from "@/components/reference";
import { ThemeToggle } from "@/components/theme-toggle";
import { Split } from "@/components/ui/split";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/client";
import { reference } from "velite/generated";

export default function Home() {
	return (
		<EditorProvider>
			<main className="flex flex-col gap-4 py-8 px-16 lg:px-32 ">
				<div className="flex justify-center gap-4 items-center">
					<h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
						iTELL Markdown Preview
					</h1>
					<ThemeToggle />
				</div>

				<Tabs defaultValue="preview">
					<TabsList>
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger value="reference">Reference</TabsTrigger>
					</TabsList>
					<TabsContent value="preview">
						<Split
							direction="horizontal"
							minSize={100}
							expandToMin={false}
							sizes={[50, 50]}
							gutterSize={10}
							snapOffset={30}
							className="flex gap-4"
						>
							<section aria-label="editor" className="basis-[100%]">
								<Editor />
							</section>
							<section aria-label="preview" className="basis-[100%]">
								<Preview />
							</section>
						</Split>
					</TabsContent>
					<TabsContent value="reference">
						<Reference />
					</TabsContent>
				</Tabs>
			</main>
		</EditorProvider>
	);
}
