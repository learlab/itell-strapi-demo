import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { SectionLocation } from "@/types/location";
import { getLocationFromPathname } from "../utils";
import { SectionLocationSchema } from "@/trpc/schema";

export const useLocation = () => {
	const pathname = usePathname();
	const [location, setLocation] = useState<SectionLocation | null>(null);

	useEffect(() => {
		if (pathname) {
			const location = getLocationFromPathname(pathname);
			const parsedLocation = SectionLocationSchema.safeParse(location);
			if (parsedLocation.success) {
				setLocation(parsedLocation.data);
			}
		}
	}, [pathname]);

	return location;
};
