export default function ({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl p-4 lg:max-w-7xl lg:p-8">
      {children}
    </main>
  );
}
