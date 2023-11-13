import * as rs from "range-serializer";

export const serializeRange = (range: Range) => {
	return rs.serializeRange(
		range,
		document.getElementById("page-content") || undefined,
	);
};

export const deserializeRange = (serializedRange: string) => {
	return rs.deserializeRange(
		serializedRange,
		document.getElementById("page-content") || undefined,
	);
};

export const getSafeRanges = (dangerousRange: Range) => {
	const commonAncestor = dangerousRange.commonAncestorContainer;

	const s = new Array(0);
	const rs: Range[] = new Array(0);
	if (dangerousRange.startContainer !== commonAncestor) {
		for (
			let i = dangerousRange.startContainer;
			i !== commonAncestor;
			i = i.parentNode as Node
		)
			s.push(i);
	}

	if (s.length > 0) {
		for (let j = 0; j < s.length; j++) {
			const xs = document.createRange();
			if (j) {
				xs.setStartAfter(s[j - 1]);
				xs.setEndAfter(s[j].lastChild);
			} else {
				xs.setStart(s[j], dangerousRange.startOffset);
				xs.setEndAfter(
					s[j].nodeType === Node.TEXT_NODE ? s[j] : s[j].lastChild,
				);
			}
			rs.push(xs);
		}
	}

	const e = new Array(0);
	const re = new Array(0);
	if (dangerousRange.endContainer !== commonAncestor) {
		for (
			let k = dangerousRange.endContainer;
			k !== commonAncestor;
			k = k.parentNode as Node
		)
			e.push(k);
	}

	if (e.length > 0) {
		for (let m = 0; m < e.length; m++) {
			const xe = document.createRange();
			if (m) {
				xe.setStartBefore(e[m].firstChild);
				xe.setEndBefore(e[m - 1]);
			} else {
				xe.setStartBefore(
					e[m].nodeType === Node.TEXT_NODE ? e[m] : e[m].firstChild,
				);
				xe.setEnd(e[m], dangerousRange.endOffset);
			}
			re.unshift(xe);
		}
	}

	const xm = document.createRange();
	if (s.length > 0 && e.length > 0) {
		xm.setStartAfter(s[s.length - 1]);
		xm.setEndBefore(e[e.length - 1]);
	} else {
		return [dangerousRange];
	}

	rs.push(xm);

	const result = rs.concat(re);
	return result.filter((r) => r.toString().trim() !== "");
};
