import { PortalElement } from "@/hooks/utils";
import React from "react";

// Separate render component
export const PortalContainer = ({ portals }: { portals: PortalElement[] }) => {
	return <>{portals.map((portal) => portal.element)}</>;
};
