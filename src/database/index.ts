import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.NODE_ENV === "development" ? process.env.AUTH_DRIZZLE_URL! : process.env.AUTH_DRIZZLE_URL! + ";sslmode=verify-ca;sslrootcert=ca.pem"

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema: schema, logger: true });