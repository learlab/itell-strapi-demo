import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import db from "../db";

export const adapter = new PrismaAdapter(db.session, db.user);
