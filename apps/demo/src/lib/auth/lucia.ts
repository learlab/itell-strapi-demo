import { DefaultPreferences } from "@itell/constants";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "@/actions/db";
import { sessions, users } from "@/drizzle/schema";
import { isProduction } from "../constants";
import type {
  ConditionAssignments,
  PersonalizationData,
  UserPreferences,
} from "@/drizzle/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: isProduction,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      image: attributes.image,
      email: attributes.email,
      role: attributes.role,
      conditionAssignments: attributes.conditionAssignments,
      pageSlug: attributes.pageSlug,
      finished: attributes.finished,
      consentGiven: attributes.consentGiven,
      surveyCompleted: attributes.surveyCompleted,
      classId: attributes.classId,
      personalization: {
        summary_streak: attributes.personalization?.summary_streak ?? 0,
        max_summary_streak: attributes.personalization?.max_summary_streak ?? 0,
        available_summary_skips:
          attributes.personalization?.available_summary_skips ?? 0,
        cri_streak: attributes.personalization?.cri_streak ?? 0,
        max_cri_streak: attributes.personalization?.max_cri_streak ?? 0,
        available_cri_skips:
          attributes.personalization?.available_cri_skips ?? 0,
      },
      preferences: {
        note_color_light:
          attributes.preferences?.note_color_light ??
          DefaultPreferences.note_color_light,
        note_color_dark:
          attributes.preferences?.note_color_dark ??
          DefaultPreferences.note_color_dark,
        theme: attributes.preferences?.theme ?? DefaultPreferences.theme,
      },
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  role: string;
  finished: boolean;
  surveyCompleted: boolean;
  consentGiven: boolean;
  classId: string | null;
  pageSlug: string | null;
  conditionAssignments: ConditionAssignments;
  preferences: UserPreferences | null;
  personalization: PersonalizationData | null;
}

interface DatabaseSessionAttributes {}
