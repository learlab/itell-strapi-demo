import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createChatRouter = ({
  apiUrl,
  fetcher,
}: {
  apiUrl: string;
  fetcher: typeof fetch;
}) => {
  return new Hono()
    .post(
      "/",
      zValidator(
        "json",
        z.object({
          page_slug: z.string(),
          message: z.string(),
          current_chunk: z.string().optional().nullable(),
          history: z
            .array(
              z.object({
                agent: z.string(),
                text: z.string(),
              })
            )
            .optional(),
          summary: z.string().optional(),
        })
      ),
      async (c) => {
        const json = c.req.valid("json");
        const response = await fetcher(`${apiUrl}/chat`, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      }
    )
    .post(
      "/stairs",
      zValidator(
        "json",
        z.object({
          page_slug: z.string(),
          message: z.string(),
          current_chunk: z.string(),
          history: z
            .array(
              z.object({
                agent: z.string(),
                text: z.string(),
              })
            )
            .optional(),
          summary: z.string().optional(),
        })
      ),
      async (c) => {
        const json = c.req.valid("json");
        const response = await fetcher(`${apiUrl}/chat/sert`, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      }
    )
    .post(
      "/think_aloud",
      zValidator(
        "json",
        z.object({
          page_slug: z.string(),
          chunk_slug: z.string(),
          message: z.string(),
          history: z.array(
            z.object({
              agent: z.string(),
              text: z.string(),
            })
          ),
          question: z.string().optional(),
          student_response: z.string().optional(),
        })
      ),
      async (c) => {
        const json = c.req.valid("json");
        const response = await fetcher(`${apiUrl}/chat/think_aloud`, {
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
