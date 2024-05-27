import { PageData } from "@/lib/utils";

type Props = {
	page: PageData;
};

export const SummaryFormSimple = ({ page }: Props) => {
	return (
		<section className="max-w-2xl">
			<h2 className="font-light text-lg mb-4">
				Reference summary for this page
			</h2>
			<p>{page.referenceSummary}</p>
		</section>
	);
};
