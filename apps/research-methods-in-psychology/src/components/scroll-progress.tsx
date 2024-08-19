"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress = () => {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	return (
		<motion.div
			className="h-[5px] bg-blue-400 origin-[0%]"
			style={{ scaleX }}
		/>
	);
};
