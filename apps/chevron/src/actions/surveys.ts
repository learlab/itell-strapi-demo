"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/actions/db";
import { CreateSurveySchema, surveys, UpdateSurveySchema } from "@/drizzle/schema";
import { authedProcedure } from "./utils";


export const createSurveyAction = authedProcedure
  .input(CreateSurveySchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return (
      await db
        .insert(surveys)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning()
    )[0];
  });

export const updateSurveyAction = authedProcedure
  .input(z.object({ id: z.number(), data: UpdateSurveySchema }))
  .handler(async ({ input }) => {
    await db.update(surveys).set(input.data).where(eq(surveys.id, input.id));
  });