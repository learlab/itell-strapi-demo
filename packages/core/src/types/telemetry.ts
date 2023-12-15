export type ClickEventData = {
	x: number;
	y: number;
	timestamp: number;
	element: string;
};

export type ScrollEventData = {
	offset: number;
	timestamp: number;
	percentage: number;
};

export type ChunkEntry = {
	chunkId: string;
	totalViewTime: number;
};

export type ChunkEntryWithLastTick = ChunkEntry & { lastTick: number };

export type FocusTimeEventData = {
	entries: ChunkEntry[];
	totalViewTime: number;
};
