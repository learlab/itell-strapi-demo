import {
	ArrowLeft,
	ArrowRight,
	BugIcon,
	CircleX,
	InfoIcon,
	LucideProps,
	Table,
	TriangleAlert,
} from "lucide-react";
import React from "react";

export const methods = [
	"source-editor",
	"source-console",
	"log",
	"debug",
	"info",
	"warn",
	"error",
	"table",
	"clear",
	"time",
	"timeEnd",
	"count",
	"assert",
	"command",
	"return",
	"dir",
] as const;

export const methodIcons = {
	info: InfoIcon,
	warn: TriangleAlert,
	error: CircleX,
	debug: BugIcon,
	return: ArrowLeft,
	"source-console": ArrowRight,
	"source-editor": ArrowRight,
} satisfies Record<
	string,
	React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>
>;

export default methods;
