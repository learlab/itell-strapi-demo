"use client";

import { usePageSlug } from "@/lib/hooks/utils";
import { useScroll, motion, useSpring } from "framer-motion";

export const ScrollProgress = () => {
	const slug = usePageSlug();
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	return (
		slug && (
			<motion.div
				className="h-[5px] bg-blue-400 origin-[0%]"
				style={{ scaleX }}
			/>
		)
	);
};
