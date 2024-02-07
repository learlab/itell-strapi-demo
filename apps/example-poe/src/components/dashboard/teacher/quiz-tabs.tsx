import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/client-components";
import { makePageHref } from "@/lib/utils";
import { buttonVariants } from "@itell/ui/server";
import Link from "next/link";

type Props = {
	data: { pageSlug: string; accuracies: number[] }[];
};

export const QuizTabs = ({ data }: Props) => {
	return (
		<Tabs defaultValue={data[0].pageSlug}>
			<TabsList>
				{data.map((entry, index) => (
					<TabsTrigger key={entry.pageSlug} value={entry.pageSlug}>
						Quiz {index + 1}
					</TabsTrigger>
				))}
			</TabsList>
			{data.map((entry) => (
				<TabsContent value={entry.pageSlug} key={entry.pageSlug}>
					<p>Taken {entry.accuracies.length} times</p>
					<p>
						Average accuracy:{" "}
						{(
							entry.accuracies.reduce((a, b) => a + b, 0) /
							entry.accuracies.length
						).toFixed(2)}
						%
					</p>
					<Link
						className="underline font-light"
						href={`${makePageHref(entry.pageSlug)}/quiz`}
					>
						See quiz
					</Link>
				</TabsContent>
			))}
		</Tabs>
	);
};
