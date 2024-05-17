import { resolve } from "node:path";
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { client, db } from "./lib/db";

(async () => {
	await client.connect();

	// This command run all migrations from the migrations folder and apply changes to the database
	// await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });

	// ... start your application
})();
