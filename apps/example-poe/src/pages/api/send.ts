import { RequestClassCodeTemplate } from "@/components/email-templates/request-class-code";
import { env } from "@/env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { email, message } = JSON.parse(req.body) as {
		message: string;
		email: string;
	};
	try {
		const data = await resend.emails.send({
			from: "itell-class-code@qiushiyan.dev",
			to: ["lear.lab.vu@gmail.com"],
			subject: "Request Class Code for ITELL (Think Python)",
			// @ts-ignore
			react: RequestClassCodeTemplate({
				origin: "https://itell-think-python.vercel.app",
				email,
				message,
			}),
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);

		res.status(400).json(error);
	}
};
