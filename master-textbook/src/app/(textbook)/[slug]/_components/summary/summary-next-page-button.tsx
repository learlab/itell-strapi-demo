"use client";
import { Spinner } from "@/components/spinner";
import { makePageHref } from "@/lib/utils";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { AnimatePresence, type AnimationProps, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const animationProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	},
} as AnimationProps;

type Props = {
	pageSlug: string;
	text?: string;
};

export const NextPageButton = ({
	text = "Go to next page",
	pageSlug,
}: Props) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<motion.button
			{...animationProps}
			disabled={pending}
			onClick={() => {
				startTransition(async () => {
					router.push(makePageHref(pageSlug));
				});
			}}
			className={cn(
				"relative backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
				buttonVariants({ variant: "default" }),
			)}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					className="flex w-full items-center justify-center relative"
					style={{ textShadow: "0px 1px 1.5px rgba(0, 0, 0, 0.16)" }}
					initial="initial"
					animate="visible"
					exit="exit"
					variants={{
						initial: { opacity: 0, y: -25 },
						visible: { opacity: 1, y: 0 },
						exit: { opacity: 0, y: 25 },
					}}
					transition={{ type: "spring", duration: 0.3, bounce: 0 }}
					key={String(pending)}
				>
					{pending && (
						<span className="absolute inset-0 flex items-center justify-center">
							<Spinner />
						</span>
					)}
					<span
						className={cn(
							"flex items-center gap-2 relative h-full w-full text-sm tracking-wide",
							pending ? "invisible" : "",
						)}
						style={{
							maskImage:
								"linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
						}}
					>
						{text}
						<ArrowRightIcon className="size-4" />
					</span>
					<span
						style={{
							mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
							maskComposite: "exclude",
						}}
						className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
					/>
				</motion.span>
			</AnimatePresence>
		</motion.button>
	);
};
