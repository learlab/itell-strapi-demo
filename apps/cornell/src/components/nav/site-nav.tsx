export default function ({ children }: { children: React.ReactNode }) {
	return (
		<header
			id="site-nav"
			className="sticky top-0 z-40 w-full bg-background shadow-md"
		>
			{children}
		</header>
	);
}
