export interface Location {
	module: number | undefined;
	chapter: number | undefined;
	section: number | undefined;
}

export interface SectionLocation {
	module: number;
	chapter: number;
	section: number;
}
