interface EditorProps {
  children?: React.ReactNode;
}

export default function EditorLayout({ children }: EditorProps) {
  return (
    <div className="mx-auto grid max-w-4xl items-start gap-10 py-8">
      {children}
    </div>
  );
}
