export type ClickEventData = {
	x: number;
	y: number;
	timestamp: string;
	element: string;
};

export type ScrollEventData = {
	offset: number;
	timestamp: string;
	percentage: number;
};
