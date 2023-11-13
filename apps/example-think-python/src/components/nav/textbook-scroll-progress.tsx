"use client";

import { useCurrentChapter } from "@/lib/hooks/utils";
import { useScroll, motion, useSpring } from "framer-motion";

export default function () {
	const { scrollYProgress } = useScroll();
	const chapter = useCurrentChapter();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	if (!chapter) {
		return null;
	}

	return (
		<motion.div
			className="h-[5px] bg-blue-400 origin-[0%]"
			style={{ scaleX }}
		/>
	);
}
