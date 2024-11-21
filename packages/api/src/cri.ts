import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const ScoreSchema = z.object({
  score: z.number(),
  is_passing: z.boolean(),
});

export const createCriRouter = ({
  fetcher,
  apiUrl,
}: {
  fetcher: typeof fetch;
  apiUrl: string;
}) => {
  return new Hono()
    .post(
      "/",
      zValidator(
        "json",
        z.object({
          page_slug: z.string(),
          chunk_slug: z.string(),
          answer: z.string(),
        })
      ),
      async (c) => {
        const json = c.req.valid("json");
        const response = await fetcher(`${apiUrl}/score/answer`, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          return c.json(
            {
              error: "Failed to get cri response",
              details: await response.text(),
            },
            500
          );
        }

        const parsed = ScoreSchema.safeParse(await response.json());
        if (parsed.success) {
          return c.json(parsed.data, 200);
        }
        return c.json(
          {
            error: "Failed to parse response",
            details: parsed.error.message,
          },
          500
        );
      }
    )
    .post(
      "/explain",
      zValidator(
        "json",
        z.object({
          page_slug: z.string(),
          chunk_slug: z.string(),
          student_response: z.string(),
        })
      ),
      async (c) => {
        const json = c.req.valid("json");
        const response = await fetcher(`${apiUrl}/chat/CRI`, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      }
    );
};
