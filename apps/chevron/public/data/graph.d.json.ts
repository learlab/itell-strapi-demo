declare const data: {
	nodes: {
		id: string;
		label: string;
		type: "page" | "chunk" | "custom";
	}[];
	edges: {
		source: string;
		target: string;
		label: string;
	}[];
};

export default data;
