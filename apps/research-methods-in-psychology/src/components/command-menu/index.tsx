import { allPagesSorted } from "@/lib/pages/pages.server";
import { CommandMenuClient } from "./command-menu.client";

export function CommandMenu() {
	return <CommandMenuClient pages={allPagesSorted} />;
}
