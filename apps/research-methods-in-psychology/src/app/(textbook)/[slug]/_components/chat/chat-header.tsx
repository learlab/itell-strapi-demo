export function ChatHeader() {
  return (
    <div
      className="flex w-full items-center justify-start gap-3"
      aria-describedby="itell-ai-description"
    >
      <p id="itell-api-description" className="sr-only">
        ITELL AI is a chatbot that can answer your questions regarding the
        textbook content.
      </p>
      <div className="flex flex-col items-start text-sm">
        <p className="text-xs">Chat with</p>
        <div className="flex items-center gap-1.5">
          <p className="h-2 w-2 rounded-full bg-green-500" />
          <p className="font-medium">ITELL AI</p>
        </div>
      </div>
    </div>
  );
}
