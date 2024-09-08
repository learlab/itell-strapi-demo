export const ChatHeader = () => {
	return (
		<div
			className="w-full flex gap-3 justify-start items-center"
			aria-describedby="itell-ai-description"
		>
			<p id="itell-api-description" className="sr-only">
				ITELL AI is a chatbot that can answer your questions regarding the
				textbook content.
			</p>
			<div className="flex flex-col items-start text-sm">
				<p className="text-xs">Chat with</p>
				<div className="flex gap-1.5 items-center">
					<p className="w-2 h-2 rounded-full bg-green-500" />
					<p className="font-medium">ITELL AI</p>
				</div>
			</div>
		</div>
	);
};
