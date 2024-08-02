// @ts-nocheck https://github.com/storybookjs/react-inspector/issues/179
import { withTheme } from "@emotion/react";
import {
	Inspector,
	ObjectLabel,
	ObjectName,
	ObjectPreview,
	ObjectRootLabel,
	ObjectValue,
	TableInspector,
} from "react-inspector";

import { PureComponent } from "react";
import { ErrorPanel } from "../message-parsers/Error";
import { Context } from "../types";
import { Constructor, HTML, Root, Table } from "./elements";

interface Props {
	theme?: Context;
	data: any;
}

const REMAINING_KEY = "__console_remaining__";

// copied from react-inspector
function intersperse(arr, sep) {
	if (arr.length === 0) {
		return [];
	}

	return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
}

const getArrayLength = (array: Array<any>) => {
	if (!array || array.length < 1) {
		return 0;
	}

	const remainingKeyCount = array[array.length - 1]
		.toString()
		.split(REMAINING_KEY);

	if (remainingKeyCount[1] === undefined) {
		return array.length;
	}
	const remaining = Number.parseInt(
		array[array.length - 1].toString().split(REMAINING_KEY)[1],
	);

	return array.length - 1 + remaining;
};

const CustomObjectRootLabel = ({ name, data }) => {
	let rootData = data;
	if (typeof data === "object" && !Array.isArray(data) && data !== null) {
		const object = {};
		for (const propertyName in data) {
			if (Object.hasOwn(data, propertyName)) {
				const propertyValue = data[propertyName];
				if (Array.isArray(propertyValue)) {
					const arrayLength = getArrayLength(propertyValue);
					object[propertyName] = new Array(arrayLength);
				} else {
					object[propertyName] = propertyValue;
				}
			}
		}
		rootData = Object.assign(
			Object.create(Object.getPrototypeOf(data)),
			object,
		);
	}

	return <ObjectRootLabel name={name} data={rootData} />;
};

const CustomObjectLabel = ({ name, data, isNonenumerable = false }) =>
	name === REMAINING_KEY ? (
		data > 0 ? (
			<span>{data} more...</span>
		) : null
	) : (
		<span>
			{typeof name === "string" ? (
				<ObjectName name={name} dimmed={isNonenumerable} />
			) : (
				<ObjectPreview data={name} />
			)}
			<span>: </span>

			<ObjectValue object={data} />
		</span>
	);

class CustomInspector extends PureComponent<Props, any> {
	render() {
		const { data, theme } = this.props;
		const { styles, method } = theme;

		const dom = data instanceof HTMLElement;
		const table = method === "table";
		return (
			<Root data-type={table ? "table" : dom ? "html" : "object"}>
				{table ? (
					<Table>
						<TableInspector theme={styles} data={data} />
					</Table>
				) : dom ? (
					<HTML>
						<Inspector data={data} theme={styles} table={false} />
					</HTML>
				) : (
					<Inspector data={data} theme={styles} table={false} />
				)}
			</Root>
		);
	}

	getCustomNode(data: any) {
		const { styles } = this.props.theme;
		const c = data?.constructor?.name;

		if (c === "Promise")
			return (
				<span style={{ fontStyle: "italic" }}>
					Promise {"{"}
					<span style={{ opacity: 0.6 }}>{"<pending>"}</span>
					{"}"}
				</span>
			);

		if (c === "Function")
			return (
				<span style={{ fontStyle: "italic" }}>
					<ObjectPreview data={data} />
					{" {"}
					<span style={{ color: "rgb(181, 181, 181)" }}>{data.body}</span>
					{"}"}
				</span>
			);

		if (data instanceof Error && typeof data.stack === "string") {
			return (
				<ErrorPanel
					error={data.stack}
					background={styles.LOG_ERROR_BACKGROUND}
				/>
			);
		}

		if (data instanceof HTMLElement)
			return (
				<HTML>
					<Inspector data={data} theme={styles} table={false} />
				</HTML>
			);

		if (Array.isArray(data)) {
			const arrayLength = getArrayLength(data);
			const maxProperties = styles.OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES;

			if (
				typeof data[data.length - 1] === "string" &&
				data[data.length - 1].includes(REMAINING_KEY)
			) {
				data = data.slice(0, -1);
			}

			const previewArray = data
				.slice(0, maxProperties)
				.map((element, index) => {
					if (Array.isArray(element)) {
						return (
							<ObjectValue
								key={index}
								object={new Array(getArrayLength(element))}
							/>
						);
					}
					return <ObjectValue key={index} object={element} />;
				});
			if (arrayLength > maxProperties) {
				previewArray.push(<span key="ellipsis">…</span>);
			}
			return (
				<>
					<span style={styles.objectDescription}>
						{arrayLength === 0 ? "" : `(${arrayLength})\xa0`}
					</span>
					<span style={styles.preview}>
						[{intersperse(previewArray, ", ")}
						{}]
					</span>
				</>
			);
		}

		return null;
	}
}

export default withTheme(CustomInspector);
