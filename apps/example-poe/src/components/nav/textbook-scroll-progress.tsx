"use client";

import { useLocation } from "@/lib/hooks/utils";
import { useScroll, motion, useSpring } from "framer-motion";

export default function () {
	const { scrollYProgress } = useScroll();
	const location = useLocation();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	if (!location) {
		return null;
	}

	return (
		<motion.div
			className="h-[5px] bg-blue-400 origin-[0%]"
			style={{ scaleX }}
		/>
	);
}
