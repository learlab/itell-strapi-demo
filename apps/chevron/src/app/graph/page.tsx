import dynamic from "next/dynamic";

const Graph = dynamic(() => import("./graph"), { ssr: false });

export default function () {
	return (
		<div className="w-screen min-h-screen flex items-stretch justify-center p-8 lg:p-16">
			<Graph width={800} height={600} />
		</div>
	);
}
