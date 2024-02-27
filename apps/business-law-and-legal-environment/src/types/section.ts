export type SidebarSection = {
	id: string;
	title: string;
	url: string;
	chapter: number;
	section: number;
	visible: boolean;
};

export type Chapter = {
	chapter: number;
	title: string;
	url: string;
	visible: boolean;
	sections: SidebarSection[];
};

export type ActivePage = Omit<SidebarSection, "id" | "title" | "visible">;
