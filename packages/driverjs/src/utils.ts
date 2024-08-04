import { Elements } from "@itell/constants";
import { getConfig } from "./config";
import { setState } from "./state";

export function easeInOutQuad(
	elapsed: number,
	initialValue: number,
	amountOfChange: number,
	duration: number,
): number {
	if ((elapsed /= duration / 2) < 1) {
		return (amountOfChange / 2) * elapsed * elapsed + initialValue;
	}
	return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}

export function getFocusableElements(parentEls: Element[] | HTMLElement[]) {
	const focusableQuery =
		'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';

	return parentEls
		.flatMap((parentEl) => {
			const isParentFocusable = parentEl.matches(focusableQuery);
			const focusableEls: HTMLElement[] = Array.from(
				parentEl.querySelectorAll(focusableQuery),
			);

			return [
				...(isParentFocusable ? [parentEl as HTMLElement] : []),
				...focusableEls,
			];
		})
		.filter((el) => {
			return (
				getComputedStyle(el).pointerEvents !== "none" && isElementVisible(el)
			);
		});
}

export function bringInView(element: Element) {
	if (!element || isElementInView(element)) {
		return;
	}

	const shouldSmoothScroll = getConfig("smoothScroll");

	element.scrollIntoView({
		// Removing the smooth scrolling for elements which exist inside the scrollable parent
		// This was causing the highlight to not properly render
		behavior:
			!shouldSmoothScroll || hasScrollableParent(element) ? "auto" : "smooth",
		inline: "center",
		block: "center",
	});
}

function hasScrollableParent(e: Element) {
	if (!e || !e.parentElement) {
		return;
	}

	const parent = e.parentElement as HTMLElement & { scrollTopMax?: number };

	return parent.scrollHeight > parent.clientHeight;
}

function isElementInView(element: Element) {
	const rect = element.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

export function isElementVisible(el: HTMLElement) {
	return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export const fixHighlight = (activeHighlight: Element) => {
	if (!document.body.contains(activeHighlight)) {
		if (activeHighlight.classList.contains("content-chunk")) {
			const id = (activeHighlight as HTMLElement).dataset.subsectionId;
			const el = document.querySelector(`[data-subsection-id="${id}"]`);
			if (el) {
				el.classList.add("driver-active-element");
				el.setAttribute("tabIndex", "0");
				el.setAttribute("id", Elements.STAIRS_HIGHLIGHTED_CHUNK);

				const oldLink = document.getElementById(Elements.STAIRS_ANSWER_LINK);
				if (oldLink) {
					oldLink.remove();
				}
				// append link to jump to the finish reading button
				const link = document.createElement("a");
				link.href = `#${Elements.STAIRS_RETURN_BUTTON}`;
				link.textContent = "go to the finish reading button";
				link.className = "sr-only";
				link.id = Elements.STAIRS_ANSWER_LINK;
				el.insertAdjacentElement("afterend", link);

				setInertBackground(String(id));

				setState("__activeElement", el);
				return el;
			}
		}
	}

	return activeHighlight;
};

export const setInertBackground = (slug: string) => {
	document.getElementById(Elements.SITE_NAV)?.setAttribute("inert", "true");
	document.getElementById(Elements.TEXTBOOK_NAV)?.setAttribute("inert", "true");
	document.getElementById(Elements.PAGE_NAV)?.setAttribute("inert", "true");
	document
		.getElementById(Elements.PAGE_ASSIGNMENTS)
		?.setAttribute("inert", "true");
	document.getElementById(Elements.PAGE_PAGER)?.setAttribute("inert", "true");
	document.querySelectorAll(".content-chunk").forEach((el) => {
		const chunk = el.getAttribute("data-subsection-id");
		if (chunk !== slug) {
			el.setAttribute("inert", "true");
		}
	});
};

export const removeInert = () => {
	document.getElementById(Elements.SITE_NAV)?.removeAttribute("inert");
	document.getElementById(Elements.TEXTBOOK_NAV)?.removeAttribute("inert");
	document.getElementById(Elements.PAGE_NAV)?.removeAttribute("inert");
	document.getElementById(Elements.PAGE_ASSIGNMENTS)?.removeAttribute("inert");
	document.getElementById(Elements.PAGE_PAGER)?.removeAttribute("inert");
	document.querySelectorAll(".content-chunk").forEach((el) => {
		el.removeAttribute("inert");
	});
};
