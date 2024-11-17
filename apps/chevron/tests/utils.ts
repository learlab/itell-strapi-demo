import { pages } from "#content";

export const allPagesSorted = pages.sort((a, b) => a.order - b.order);
export const firstPage = allPagesSorted[0];
