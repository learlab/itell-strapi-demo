import { db } from "@/actions/db";
import {
  ConditionAssignments,
  sessions,
  UserPreferences,
  users,
} from "@/drizzle/schema";
import { DefaultPreferences } from "@itell/constants";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
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
      finished: attributes.finished,
      classId: attributes.classId,
      pageSlug: attributes.pageSlug,
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
  classId: string | null;
  pageSlug: string | null;
  conditionAssignments: ConditionAssignments;
  preferences: UserPreferences;
}

interface DatabaseSessionAttributes {}
