"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nonTextbookPaths = ["/", "/dashboard", "/auth", "/guide", "/summary"];

export const usePageSlug = () => {
	const [slug, setSlug] = useState<string | undefined>();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname && !nonTextbookPaths.includes(pathname)) {
			const splitted = pathname.split("/");
			if (splitted.length === 2) {
				setSlug(splitted[1]);
			}
		}
	}, [pathname]);

	return slug;
};
