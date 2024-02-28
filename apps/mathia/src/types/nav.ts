export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type DashboardNavItem = NavItem;

export type SidebarNavItem = {
	title: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
	icon?: React.ReactNode;
};
