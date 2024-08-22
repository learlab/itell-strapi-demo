import React from "react";
import type { PortalElement } from "./hooks/utils";

// Separate render component
export const PortalContainer = ({ portals }: { portals: PortalElement[] }) => {
	return (
		<>
			{portals.map((portal) => (
				<div key={portal.id}>{portal.element}</div>
			))}
		</>
	);
};
