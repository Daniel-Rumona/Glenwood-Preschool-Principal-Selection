import type { NavItem } from "$lib/types/nav.js";

type DocsConfig = {
	mainNav: NavItem[];
};

export const docsConfig: DocsConfig = {
	mainNav: [
		{
			title: "Dashboard",
			href: "/dashboard",
		},
		{
			title: "Applications",
			href: "/applications",
		},
		{
			title: "Settings",
			href: "/settings",
		},
	],
};

