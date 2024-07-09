import { TextbookNav } from "@/components/textbook-nav";

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<>
			<TextbookNav scroll />
			<div className="max-w-4xl mx-auto min-h-screen p-4 lg:p-8">
				{children}
			</div>
		</>
	);
}
