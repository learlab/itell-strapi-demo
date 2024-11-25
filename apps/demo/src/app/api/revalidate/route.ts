import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const body = (await req.json()) as { tag: string };
  revalidateTag(body.tag);
  return new Response(null, { status: 200 });
}
