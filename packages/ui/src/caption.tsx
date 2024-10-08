export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center text-sm font-light">
      {children}
    </div>
  );
}
