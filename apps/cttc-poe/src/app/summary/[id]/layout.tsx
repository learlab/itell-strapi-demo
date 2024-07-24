interface EditorProps {
	children?: React.ReactNode;
}

export default function EditorLayout({ children }: EditorProps) {
	return (
		<div className="max-w-4xl mx-auto grid items-start gap-10 py-8">
			{children}
		</div>
	);
}
