import { z } from "zod";

const MetricSchema = z.object({
  name: z.string(),
  is_passed: z.boolean().nullable(),
  score: z.number().nullable(),
  threshold: z.number().nullable(),
  feedback: z.string().nullable(),
});

export const SummaryResponseSchema = z.object({
  is_passed: z.boolean().optional(),
  prompt: z.string().optional(),
  metrics: z.record(
    z.enum([
      "containment",
      "containment_chat",
      "similarity",
      "content",
      "english",
      "profanity",
    ]),
    MetricSchema
  ),
  included_keyphrases: z.array(z.string()).optional(),
  suggested_keyphrases: z.array(z.string()).optional(),
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
