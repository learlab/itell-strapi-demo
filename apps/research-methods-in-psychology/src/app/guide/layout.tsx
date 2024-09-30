import { MainNav } from "@/components/main-nav";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav scrollProgress />
      <main className="mx-auto min-h-screen max-w-4xl p-4 lg:p-8">
        {children}
      </main>
    </>
  );
}
