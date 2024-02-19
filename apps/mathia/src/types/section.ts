export type SidebarSection = {
	id: string;
	title: string;
	url: string;
	chapter: number;
	section: number;
};

export type Chapter = {
	chapter: number;
	title: string;
	url: string;
	sections: SidebarSection[];
};

export type ActivePage = Omit<SidebarSection, "id" | "title">;
