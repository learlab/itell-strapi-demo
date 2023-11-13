import Link from "next/link";
import Balancer from "react-wrap-balancer";

const cards = [
	{
		front: "What is the `^` operator called in Python?",
		back: "It is a bitwise operator called XOR.",
		url: "/chapter-1/#arithmetic-operators",
	},
];

export default function FlipCard() {
	// generate random index to access random card
	const randomIndex = Math.floor(Math.random() * cards.length);
	const card = cards[randomIndex];

	return (
		<div className="flex h-full w-full items-center justify-center bg-slate-100">
			<div className="group h-3/4 w-3/5 [perspective:1000px]">
				<div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
					<div className="absolute inset-0">
						<img
							className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40"
							src="https://images.unsplash.com/photo-1680987082559-6b0f763913e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3398&q=80')"
							alt=""
						/>
						<div className="inset-center inset-x-0  text-gray-100  text-center leading-4 group-hover:hidden">
							<p className="text-xl font-normal leading-relaxed">
								<Balancer>{card.front}</Balancer>
							</p>
						</div>
					</div>
					<div className="absolute inset-0 h-full w-full rounded-xl bg-black/70 px-12 text-center text-gray-100 [transform:rotateY(180deg)] [backface-visibility:hidden]">
						<div className="flex min-h-full flex-col items-center justify-center text-white">
							<p className="font-light leading-relaxed">
								<Balancer>{card.back}</Balancer>
							</p>
							{card.url && (
								<Link
									href={card.url}
									className="uppercase border-2 p-2 mt-2 rounded-md shadow-sm"
								>
									read more
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="fixed bottom-6">
				<p className="text-sm font-light">Hover to Reveal</p>
			</div>
		</div>
	);
}
