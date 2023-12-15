export type SidebarSection = {
	id: string;
	title: string;
	chapter: number;
	section: number | undefined;
	url: string;
};

export type Chapter = {
	chapter: number;
	title: string;
	url: string;
	sections: SidebarSection[];
};
