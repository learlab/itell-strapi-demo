import * as React from "react";

interface EmailTemplateProps {
	origin: string;
	title: string;
	code: string;
}

export const SendClassCodeTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	code,
	origin,
	title,
}) => (
	<div>
		<h3>
			Thanks for using <a href={origin}>{title}</a> for your class
		</h3>
		<p>
			Here is your class code <span className="font-bold">{code}</span>
		</p>
		<p>
			Send this code to your students so they can join your class at{" "}
			{`${origin}/dashboard/settings`}/
		</p>
	</div>
);
