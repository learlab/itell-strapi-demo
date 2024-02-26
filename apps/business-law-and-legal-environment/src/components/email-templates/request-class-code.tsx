import * as React from "react";

interface EmailTemplateProps {
	origin: string;
	email: string;
	message: string;
}

export const RequestClassCodeTemplate: React.FC<Readonly<EmailTemplateProps>> =
	({ origin, email, message }) => (
		<div>
			<p>
				{`${email} requested a class code on ${origin} with the following message:`}
			</p>
			<p>{message}</p>
		</div>
	);
