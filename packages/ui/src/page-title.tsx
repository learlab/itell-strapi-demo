import { Elements } from "@itell/constants";

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1
			className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight mb-4 text-center text-balance"
			id={Elements.PAGE_TITLE}
		>
			{children}
		</h1>
	);
};
