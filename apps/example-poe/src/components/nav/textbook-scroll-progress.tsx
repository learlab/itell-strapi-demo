"use client";

import { useScroll, motion, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nonTextbookPaths = ["/", "/dashboard", "/auth", "/guide", "/summary"];

export const ScrollProgress = () => {
	const [show, setShow] = useState(false);
	const pathname = usePathname();
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	useEffect(() => {
		if (pathname && !nonTextbookPaths.includes(pathname)) {
			setShow(true);
		}
	}, [pathname]);

	return (
		show && (
			<motion.div
				className="h-[5px] bg-blue-400 origin-[0%]"
				style={{ scaleX }}
			/>
		)
	);
};
