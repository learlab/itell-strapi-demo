type Props = {
	stdout: string;
	stderr: string;
};

export const CodeResult = ({ stdout, stderr }: Props) => {
	return (
		<div style={{ fontFamily: "IBM Plex Mono monospace" }}>
			<pre>
				{stdout && <code>{stdout}</code>}
				{stderr && <code className="text-destructive">{stderr}</code>}
			</pre>
		</div>
	);
};
