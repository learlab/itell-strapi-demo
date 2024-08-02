import { Root } from "../react-inspector/elements";

import type { Options } from "linkifyjs";
import Linkify from "linkifyjs/react";
import Inspector from "../react-inspector";
import { LogMessage } from "../types";

interface Props {
	log: LogMessage;
	color: string;
	linkifyOptions?: Options;
}

export const ObjectTree = ({ log, color, linkifyOptions }: Props) => {
	const quoted = typeof log.data[0] !== "string";
	return (
		<>
			{log.data.map((message, i: number) => {
				if (typeof message === "string") {
					const string =
						!quoted && message.length ? (
							`${message} `
						) : (
							<span>
								<span>"</span>
								<span
									style={{
										color,
									}}
								>
									{message}
								</span>
								<span>" </span>
							</span>
						);

					return (
						<Root data-type="string" key={i}>
							<Linkify options={linkifyOptions}>{string}</Linkify>
						</Root>
					);
				}

				return <Inspector data={message} key={i} />;
			})}
		</>
	);
};
