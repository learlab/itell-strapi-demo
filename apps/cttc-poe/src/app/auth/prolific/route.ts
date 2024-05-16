import { lucia } from "@/lib/auth";
import db from "@/lib/db";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const cookieOptions: Partial<ResponseCookie> = {
	path: "/",
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	maxAge: 60 * 10,
	sameSite: "lax",
};

const setProlificOAuthState = (pid: string) => {
	cookies().set("prolific_oauth_state", pid, cookieOptions);
};

const readProlificOAuthState = () => {
	const pid = cookies().get("prolific_oauth_state")?.value ?? null;
	return pid;
};

export async function GET(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const pid = url.searchParams.get("prolific_id");
	if (!pid) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=prolific_missing_pid",
			},
		});
	}

	const storedPid = readProlificOAuthState();
	if (storedPid && storedPid !== pid) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/auth?error=prolific_existing_pid_${storedPid}`,
			},
		});
	}

	try {
		const username = `Prolific ${pid}`;
		setProlificOAuthState(pid);
		let user = await db.user.findFirst({
			where: {
				name: username,
			},
		});

		if (!user) {
			user = await db.user.create({
				data: {
					name: username,
					prolificId: pid,
					role: "user",
				},
			});
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/?login=true",
			},
		});
	} catch {
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=prolific_oauth",
			},
		});
	}
}
