"use server";

import {
	constructed_responses,
	constructed_responses_feedback,
} from "@/drizzle/schema";
import { PgInsertValue } from "drizzle-orm/pg-core";
import { db } from "../db";

export const createQuestionAnswer = async (
	input: PgInsertValue<typeof constructed_responses>,
) => {
	return await db.insert(constructed_responses).values(input);
};

export const createQuestionFeedback = async (
	input: PgInsertValue<typeof constructed_responses_feedback>,
) => {
	return await db.insert(constructed_responses_feedback).values(input);
};
