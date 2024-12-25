"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  SurveyQuestionData,
  SurveyQuestionDataSchema,
} from "@/app/survey/[surveyId]/[sectionId]/survey-question-renderer";
import { survey_sessions } from "@/drizzle/schema";
import { db, first } from "./db";
import { authedProcedure } from "./utils";

export const upsertSurveySessionAction = authedProcedure
  .input(
    z.object({
      isFinished: z.boolean().optional(),
      surveyId: z.string(),
      sectionId: z.string(),
      data: z.record(SurveyQuestionDataSchema),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db.transaction(async (tx) => {
      const session = first(
        await tx
          .select()
          .from(survey_sessions)
          .where(
            and(
              eq(survey_sessions.userId, ctx.user.id),
              eq(survey_sessions.surveyId, input.surveyId)
            )
          )
      );

      if (!session) {
        await tx.insert(survey_sessions).values({
          userId: ctx.user.id,
          surveyId: input.surveyId,
          data: { [input.sectionId]: input.data },
          finishedAt: input.isFinished ? new Date() : null,
        });
      } else {
        await tx
          .update(survey_sessions)
          .set({
            data: { ...session.data, [input.sectionId]: input.data },
            finishedAt: input.isFinished ? new Date() : undefined,
          })
          .where(eq(survey_sessions.id, session.id));
      }
    });
  });

export const getSurveySessionAction = authedProcedure
  .input(
    z.object({
      surveyId: z.string(),
      sectionId: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    return first(
      await db
        .select({
          sectionData: sql<Record<
            string,
            SurveyQuestionData
          > | null>`${survey_sessions.data}->${input.sectionId}`,
        })
        .from(survey_sessions)
        .where(
          and(
            eq(survey_sessions.userId, ctx.user.id),
            eq(survey_sessions.surveyId, input.surveyId)
          )
        )
        .orderBy(desc(survey_sessions.createdAt))
    );
  });
