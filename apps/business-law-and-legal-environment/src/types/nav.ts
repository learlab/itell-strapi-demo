export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type DashboardNavItem = NavItem;

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
	icon?: React.ReactNode;
} & (
	| {
			href: string;
			items?: never;
	  }
	| {
			href?: string;
			items: [];
	  }
);
