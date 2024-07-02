export default function ({ children }: { children: React.ReactNode }) {
	return (
		<header
			id="site-nav"
			className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			{children}
		</header>
	);
}
