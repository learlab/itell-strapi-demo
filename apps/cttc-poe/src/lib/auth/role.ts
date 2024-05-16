import { User } from "lucia";

export const isAdmin = (user: User | null) => user?.role === "admin";
