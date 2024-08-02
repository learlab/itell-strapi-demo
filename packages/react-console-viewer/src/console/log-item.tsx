import { ThemeProvider } from "@emotion/react";

import { Options } from "linkifyjs";
import React from "react";
import { ErrorPanel } from "./message-parsers/Error";
import Formatted from "./message-parsers/Formatted";
import { ObjectTree } from "./message-parsers/Object";
import { methodIcons } from "./methods";
import { LogMessage, Method, Theme } from "./types";

// https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions
const reSubstitutions = /(%[coOs])|(%(([0-9]*[.])?[0-9]+)?[dif])/g;

type Props = {
	log: LogMessage;
	style: Record<string, any>;
	linkifyOptions?: Options;
};

export class LogItem extends React.Component<Props, any> {
	shouldComponentUpdate(nextProps) {
		return this.props.log.amount !== nextProps.log.amount;
	}

	theme = (theme: Theme) => ({
		...theme,
		method: this.props.log.method,
	});

	render() {
		const { log } = this.props;
		if (log.method === "source-editor") {
			return null;
		}

		return (
			<ThemeProvider theme={this.theme}>
				<Container style={this.props.style} method={log.method}>
					{log.method === "source-console" ? (
						<>
							<MethodIcon method={"source-console"} />
							<pre className="not-prose">{log.data[0]}</pre>
						</>
					) : (
						<>
							{log.amount && log.amount > 1 ? (
								<AmountIcon method={log.method} style={this.props.style}>
									{log.amount}
								</AmountIcon>
							) : (
								<MethodIcon method={log.method} />
							)}
							{log.timestamp && <Timestamp>{log.timestamp}</Timestamp>}
							{this.getNode()}
						</>
					)}
				</Container>
			</ThemeProvider>
		);
	}

	getNode() {
		const { log } = this.props;

		if (!log) {
			return (
				<Formatted
					data={[
						`%c[console] %cFailed to parse message! %clog was typeof ${typeof log}, but it should've been a log object`,
						"color: red",
						"color: orange",
						"color: cyan",
					]}
				/>
			);
		}

		if (!Array.isArray(log.data)) {
			return (
				<Formatted
					data={[
						"%c[console] %cFailed to parse message! %clog.data was not an array!",
						"color: red",
						"color: orange",
						"color: cyan",
					]}
				/>
			);
		}

		// Chrome formatting
		if (log.data.length > 0 && typeof log.data[0] === "string") {
			const matchLength = log.data[0].match(reSubstitutions)?.length;
			if (matchLength) {
				const restData = log.data.slice(1 + matchLength);
				return (
					<>
						<Formatted data={log.data} />
						{restData.length > 0 && (
							<ObjectTree
								log={{ ...log, data: restData }}
								color={this.props.style.OBJECT_VALUE_STRING_COLOR}
								linkifyOptions={this.props.linkifyOptions}
							/>
						)}
					</>
				);
			}
		}

		// Error panel
		if (
			log.data.every((message) => typeof message === "string") &&
			log.method === "error"
		) {
			return (
				<ErrorPanel
					error={log.data.join(" ")}
					background={this.props.style.LOG_ERROR_BACKGROUND}
				/>
			);
		}

		return (
			<ObjectTree
				log={log}
				color={this.props.style.OBJECT_VALUE_STRING_COLOR}
				linkifyOptions={this.props.linkifyOptions}
			/>
		);
	}
}

type ContainerProps = {
	children: React.ReactNode;
	style: Record<string, any>;
	method: Method;
};

const Container = ({ children, style, method }: ContainerProps) => {
	const color = getThemeItem(style, "color", method);
	const backgroundColor = getThemeItem(style, "background", method);
	const borderTop = `1px solid ${getThemeItem(style, "border", method)}`;
	const borderBottom = `1px solid ${getThemeItem(style, "border", method)}`;
	const marginBottom = /^warn|error$/.test(method) ? 1 : 0;
	const padding = style.PADDING;
	const fontFamily = style.BASE_FONT_FAMILY;
	const fontSize = style.BASE_FONT_SIZE;
	const linkColor = style.LOG_LINK_COLOR;

	return (
		<div
			className={
				"flex gap-2 items-center relative -mt-[1px] whitespace-pre-wrap message-container"
			}
			style={{
				color,
				backgroundColor,
				borderTop,
				borderBottom,
				marginBottom,
				padding,
				...style,
			}}
		>
			<style>
				{`
				.message-container * {
					font-family: ${fontFamily};
					font-size: ${fontSize};
					whitespace: pre-wrap;
				}

				.message-container a {
					color: ${linkColor};
				}
			`}
			</style>
			{children}
		</div>
	);
};

const Timestamp = ({ children }: { children: React.ReactNode }) => {
	return <time className="ml-1.5 text-[dimgray]">{children}</time>;
};

const MethodIcon = ({ method }: { method: string }) => {
	if (Object.keys(methodIcons).includes(method)) {
		const Icon = methodIcons[method];
		return <Icon className="size-5 shrink-0" />;
	}

	return <div className="size-5 rounded-full shrink-0" />;
};

type AmountIconProps = {
	children: React.ReactNode;
	method: Method;
	style: Record<string, any>;
};

const AmountIcon = ({ method, style, children }: AmountIconProps) => {
	return (
		<div
			className="flex items-center justify-center size-5 rounded-full whitespace-nowrap"
			style={{
				fontSize: "0.9em",
				background: getThemeItem(style, "amount_background", method),
				color: getThemeItem(style, "amount_color", method),
			}}
		>
			{children}
		</div>
	);
};

const getThemeItem = (
	styles: Record<string, any>,
	name: string,
	method: string,
) => {
	return (
		styles[`LOG_${method.toUpperCase()}_${name.toUpperCase()}`] ||
		styles[`LOG_${name.toUpperCase()}`]
	);
};
